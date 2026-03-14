"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ScoringService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const WEIGHTS = {
    SUBSCRIPTION_TIER: 0.3,
    RATING: 0.2,
    RESPONSE_RATE: 0.2,
    LOCATION_MATCH: 0.2,
    FAIRNESS_ROTATION: 0.1,
};
const SCORE_CACHE_TTL = 300;
const FAIRNESS_WINDOW_DAYS = 7;
const FAIRNESS_WINDOW_TTL = FAIRNESS_WINDOW_DAYS * 24 * 60 * 60;
const MAX_LEADS_PER_WINDOW = 50;
let ScoringService = ScoringService_1 = class ScoringService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
        this.logger = new common_1.Logger(ScoringService_1.name);
    }
    computeScore(factors) {
        const tierScore = factors.subscriptionTier === 'PREMIUM' ? 1.0 : 0.5;
        const ratingScore = factors.averageRating / 5.0;
        const responseScore = factors.responseRate;
        const locationScore = factors.locationMatch ? 1.0 : 0.0;
        const fairnessScore = Math.max(0, 1.0 - factors.fairnessCount / MAX_LEADS_PER_WINDOW);
        return (tierScore * WEIGHTS.SUBSCRIPTION_TIER +
            ratingScore * WEIGHTS.RATING +
            responseScore * WEIGHTS.RESPONSE_RATE +
            locationScore * WEIGHTS.LOCATION_MATCH +
            fairnessScore * WEIGHTS.FAIRNESS_ROTATION);
    }
    async findVendorsInRange(latitude, longitude, categoryId) {
        if (categoryId) {
            const rows = await this.prisma.$queryRaw `
        SELECT DISTINCT vsa.vendor_id
        FROM vendor_service_areas vsa
        JOIN markets m ON m.id = vsa.market_id
        JOIN vendor_profiles vp ON vp.id = vsa.vendor_id
        JOIN vendor_subscriptions vs ON vs.vendor_id = vp.id
        JOIN vendor_categories vc ON vc.vendor_id = vp.id
        WHERE ST_DWithin(
          ST_MakePoint(m.longitude, m.latitude)::geography,
          ST_MakePoint(${longitude}, ${latitude})::geography,
          vsa.radius_km * 1000
        )
        AND vp.status = 'APPROVED'
        AND vs.status IN ('ACTIVE', 'AUTHENTICATED')
        AND m.status = 'ACTIVE'
        AND vc.category_id = ${categoryId}::uuid
      `;
            return rows.map((r) => r.vendor_id);
        }
        const rows = await this.prisma.$queryRaw `
      SELECT DISTINCT vsa.vendor_id
      FROM vendor_service_areas vsa
      JOIN markets m ON m.id = vsa.market_id
      JOIN vendor_profiles vp ON vp.id = vsa.vendor_id
      JOIN vendor_subscriptions vs ON vs.vendor_id = vp.id
      WHERE ST_DWithin(
        ST_MakePoint(m.longitude, m.latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography,
        vsa.radius_km * 1000
      )
      AND vp.status = 'APPROVED'
      AND vs.status IN ('ACTIVE', 'AUTHENTICATED')
      AND m.status = 'ACTIVE'
    `;
        return rows.map((r) => r.vendor_id);
    }
    async getScoreFactors(vendorId, eventLat, eventLng) {
        const cacheKey = `vendor:score:factors:${vendorId}`;
        const locationRows = await this.prisma.$queryRaw `
      SELECT EXISTS(
        SELECT 1
        FROM vendor_service_areas vsa
        JOIN markets m ON m.id = vsa.market_id
        WHERE vsa.vendor_id = ${vendorId}::uuid
        AND ST_DWithin(
          ST_MakePoint(m.longitude, m.latitude)::geography,
          ST_MakePoint(${eventLng}, ${eventLat})::geography,
          vsa.radius_km * 1000
        )
      ) AS found
    `;
        const locationMatch = locationRows[0]?.found ?? false;
        const fairnessKey = `fairness:${vendorId}`;
        const fairnessRaw = await this.redis.get(fairnessKey);
        const fairnessCount = fairnessRaw ? parseInt(fairnessRaw, 10) : 0;
        const cached = await this.redis.get(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            return {
                vendorId,
                subscriptionTier: parsed.subscriptionTier,
                averageRating: parsed.averageRating,
                responseRate: parsed.responseRate,
                locationMatch,
                fairnessCount,
            };
        }
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            include: {
                subscription: { include: { plan: true } },
                stats: true,
            },
        });
        const subscriptionTier = vendor?.subscription?.plan?.tier ?? 'BASIC';
        const averageRating = vendor?.stats?.averageRating ?? 3.0;
        const responseRate = vendor?.stats?.responseRate ?? 0.5;
        await this.redis.set(cacheKey, JSON.stringify({ subscriptionTier, averageRating, responseRate }), SCORE_CACHE_TTL);
        return {
            vendorId,
            subscriptionTier,
            averageRating,
            responseRate,
            locationMatch,
            fairnessCount,
        };
    }
    async scoreVendors(vendorIds, eventLat, eventLng) {
        const scored = await Promise.all(vendorIds.map(async (vendorId) => {
            const factors = await this.getScoreFactors(vendorId, eventLat, eventLng);
            const score = this.computeScore(factors);
            return { vendorId, score, factors };
        }));
        return scored.sort((a, b) => b.score - a.score);
    }
    async incrementFairnessCount(vendorId) {
        const key = `fairness:${vendorId}`;
        const count = await this.redis.incr(key);
        if (count === 1) {
            await this.redis.expire(key, FAIRNESS_WINDOW_TTL);
        }
    }
    async invalidateScoreCache(vendorId) {
        await this.redis.del(`vendor:score:factors:${vendorId}`);
    }
};
exports.ScoringService = ScoringService;
exports.ScoringService = ScoringService = ScoringService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], ScoringService);
//# sourceMappingURL=scoring.service.js.map