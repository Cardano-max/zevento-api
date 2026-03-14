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
var ReviewService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let ReviewService = ReviewService_1 = class ReviewService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
        this.logger = new common_1.Logger(ReviewService_1.name);
    }
    async createReview(bookingId, customerId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking ${bookingId} not found`);
        }
        if (booking.customerId !== customerId) {
            throw new common_1.ForbiddenException('Not your booking');
        }
        if (booking.status !== 'COMPLETED') {
            throw new common_1.ForbiddenException('Booking must be completed before leaving a review');
        }
        const existingReview = await this.prisma.review.findUnique({
            where: { bookingId },
        });
        if (existingReview) {
            throw new common_1.ConflictException('A review already exists for this booking');
        }
        const review = await this.prisma.review.create({
            data: {
                bookingId,
                customerId,
                vendorId: booking.vendorId,
                rating: dto.rating,
                comment: dto.comment ?? null,
            },
        });
        const stats = await this.prisma.vendorStats.findUnique({
            where: { vendorId: booking.vendorId },
        });
        const oldCount = stats?.totalReviewCount ?? 0;
        const oldAvg = stats?.averageRating ?? 3.0;
        const newAvg = (oldAvg * oldCount + dto.rating) / (oldCount + 1);
        await this.prisma.vendorStats.update({
            where: { vendorId: booking.vendorId },
            data: {
                averageRating: newAvg,
                totalReviewCount: { increment: 1 },
            },
        });
        await this.redis.del(`vendor:score:factors:${booking.vendorId}`);
        this.logger.log(`Review created for booking ${bookingId} by customer ${customerId} (rating: ${dto.rating}, newAvg: ${newAvg.toFixed(2)})`);
        return review;
    }
    async respondToReview(reviewId, vendorId, dto) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review ${reviewId} not found`);
        }
        if (review.vendorId !== vendorId) {
            throw new common_1.ForbiddenException('You can only respond to reviews for your own bookings');
        }
        const updated = await this.prisma.review.update({
            where: { id: reviewId },
            data: {
                vendorResponse: dto.response,
                respondedAt: new Date(),
            },
        });
        this.logger.log(`Vendor ${vendorId} responded to review ${reviewId}`);
        return updated;
    }
    async getVendorReviews(vendorId, page, limit) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { vendorId },
                include: {
                    customer: { select: { id: true, name: true } },
                    booking: {
                        include: {
                            lead: { select: { eventType: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.review.count({ where: { vendorId } }),
        ]);
        return { data: reviews, total, page, limit };
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = ReviewService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], ReviewService);
//# sourceMappingURL=review.service.js.map