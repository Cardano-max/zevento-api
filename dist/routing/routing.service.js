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
var RoutingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingService = void 0;
const common_1 = require("@nestjs/common");
const inbox_gateway_1 = require("../inbox/inbox.gateway");
const scoring_service_1 = require("../lead/scoring.service");
const notification_service_1 = require("../notification/notification.service");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const routing_constants_1 = require("./routing.constants");
let RoutingService = RoutingService_1 = class RoutingService {
    constructor(prisma, scoringService, notificationService, redis, inboxGateway) {
        this.prisma = prisma;
        this.scoringService = scoringService;
        this.notificationService = notificationService;
        this.redis = redis;
        this.inboxGateway = inboxGateway;
        this.logger = new common_1.Logger(RoutingService_1.name);
    }
    async routeDirect(leadId) {
        const lead = await this.prisma.lead.findUnique({
            where: { id: leadId },
        });
        if (!lead || !lead.targetVendorId) {
            this.logger.error(`routeDirect failed: lead ${leadId} not found or no targetVendorId`);
            return;
        }
        const vendorId = lead.targetVendorId;
        const assignment = await this.prisma.leadAssignment.create({
            data: {
                leadId,
                vendorId,
                score: null,
                status: 'PENDING',
            },
        });
        await this.prisma.leadRoutingTrace.create({
            data: {
                leadId,
                vendorId,
                score: null,
                scoreFactors: {},
                selected: true,
                skipReason: null,
            },
        });
        await this.prisma.lead.update({
            where: { id: leadId },
            data: { status: 'ROUTED' },
        });
        await this.incrementFairness(vendorId);
        await this.prisma.leadAssignment.update({
            where: { id: assignment.id },
            data: { notifiedAt: new Date(), status: 'NOTIFIED' },
        });
        this.inboxGateway.emitToVendor(vendorId, 'new_lead', {
            assignmentId: assignment.id,
            leadId,
            eventType: lead.eventType,
            city: lead.city,
            budget: lead.budget,
            eventDate: lead.eventDate,
        });
        await this.notificationService.sendPushToVendor(vendorId, {
            leadId,
            eventType: lead.eventType,
            city: lead.city,
        });
        this.logger.log(`Mode A: Lead ${leadId} routed directly to vendor ${vendorId}`);
    }
    async routeTopThree(leadId) {
        const lead = await this.prisma.lead.findUnique({
            where: { id: leadId },
        });
        if (!lead) {
            this.logger.error(`routeTopThree failed: lead ${leadId} not found`);
            return;
        }
        await this.prisma.lead.update({
            where: { id: leadId },
            data: { status: 'ROUTING' },
        });
        const vendorIds = await this.scoringService.findVendorsInRange(lead.latitude, lead.longitude, lead.categoryId ?? undefined);
        if (vendorIds.length === 0) {
            this.logger.warn(`Mode B: No eligible vendors found for lead ${leadId}`);
            await this.prisma.lead.update({
                where: { id: leadId },
                data: { status: 'ROUTED' },
            });
            return;
        }
        const scored = await this.scoringService.scoreVendors(vendorIds, lead.latitude, lead.longitude);
        const skipReasons = new Map();
        const selected = [];
        for (const entry of scored) {
            if (selected.length >= routing_constants_1.TOP_N) {
                skipReasons.set(entry.vendorId, 'TOP_N_LIMIT');
                continue;
            }
            const fairnessKey = `fairness:${entry.vendorId}`;
            const fairnessRaw = await this.redis.get(fairnessKey);
            const fairnessCount = fairnessRaw ? parseInt(fairnessRaw, 10) : 0;
            if (fairnessCount >= routing_constants_1.MAX_LEADS_PER_WINDOW) {
                this.logger.debug(`Vendor ${entry.vendorId} skipped (fairness cap: ${fairnessCount}/${routing_constants_1.MAX_LEADS_PER_WINDOW})`);
                skipReasons.set(entry.vendorId, 'FAIRNESS_CAP');
                continue;
            }
            selected.push(entry);
        }
        if (selected.length === 0) {
            this.logger.warn(`Mode B: All eligible vendors hit fairness cap for lead ${leadId}`);
            await this.prisma.lead.update({
                where: { id: leadId },
                data: { status: 'ROUTED' },
            });
            return;
        }
        for (const entry of selected) {
            await this.prisma.leadAssignment.create({
                data: {
                    leadId,
                    vendorId: entry.vendorId,
                    score: entry.score,
                    status: 'PENDING',
                },
            });
        }
        const selectedVendorIds = new Set(selected.map((s) => s.vendorId));
        await this.prisma.leadRoutingTrace.createMany({
            data: scored.map((entry) => ({
                leadId,
                vendorId: entry.vendorId,
                score: entry.score,
                scoreFactors: entry.factors,
                selected: selectedVendorIds.has(entry.vendorId),
                skipReason: selectedVendorIds.has(entry.vendorId)
                    ? null
                    : (skipReasons.get(entry.vendorId) ?? 'TOP_N_LIMIT'),
            })),
            skipDuplicates: true,
        });
        await this.prisma.lead.update({
            where: { id: leadId },
            data: { status: 'ROUTED' },
        });
        const assignedVendorIds = [];
        for (const entry of selected) {
            await this.incrementFairness(entry.vendorId);
            const assignment = await this.prisma.leadAssignment.findFirst({
                where: { leadId, vendorId: entry.vendorId },
                select: { id: true },
            });
            await this.prisma.leadAssignment.updateMany({
                where: { leadId, vendorId: entry.vendorId },
                data: { notifiedAt: new Date(), status: 'NOTIFIED' },
            });
            if (assignment) {
                this.inboxGateway.emitToVendor(entry.vendorId, 'new_lead', {
                    assignmentId: assignment.id,
                    leadId,
                    eventType: lead.eventType,
                    city: lead.city,
                    budget: lead.budget,
                    eventDate: lead.eventDate,
                });
            }
            assignedVendorIds.push(entry.vendorId);
        }
        await this.notificationService.sendPushToMultipleVendors(assignedVendorIds, {
            leadId,
            eventType: lead.eventType,
            city: lead.city,
        });
        this.logger.log(`Mode B: Lead ${leadId} routed to ${selected.length} vendors (scores: ${selected.map((s) => s.score.toFixed(3)).join(', ')})`);
    }
    async incrementFairness(vendorId) {
        const key = `fairness:${vendorId}`;
        const count = await this.redis.incr(key);
        if (count === 1) {
            await this.redis.expire(key, routing_constants_1.FAIRNESS_WINDOW_SECONDS);
        }
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = RoutingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        scoring_service_1.ScoringService,
        notification_service_1.NotificationService,
        redis_service_1.RedisService,
        inbox_gateway_1.InboxGateway])
], RoutingService);
//# sourceMappingURL=routing.service.js.map