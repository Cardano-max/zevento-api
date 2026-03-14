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
var SubscriptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@zevento/shared");
const prisma_service_1 = require("../prisma/prisma.service");
const razorpay_service_1 = require("./razorpay.service");
let SubscriptionService = SubscriptionService_1 = class SubscriptionService {
    constructor(prisma, razorpay) {
        this.prisma = prisma;
        this.razorpay = razorpay;
        this.logger = new common_1.Logger(SubscriptionService_1.name);
    }
    async getPlansForRole(vendorRole) {
        return this.prisma.subscriptionPlan.findMany({
            where: { vendorRole, isActive: true },
            orderBy: { amountPaise: 'asc' },
        });
    }
    async getAllPlans() {
        return this.prisma.subscriptionPlan.findMany({
            where: { isActive: true },
            orderBy: [{ vendorRole: 'asc' }, { amountPaise: 'asc' }],
        });
    }
    async initiateCheckout(vendorId, planId) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor profile not found');
        }
        if (vendor.status !== shared_1.VendorStatus.APPROVED) {
            throw new common_1.BadRequestException('Vendor must be KYC-approved before subscribing');
        }
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: planId },
        });
        if (!plan || !plan.isActive) {
            throw new common_1.NotFoundException('Subscription plan not found or inactive');
        }
        if (plan.vendorRole !== vendor.role) {
            throw new common_1.BadRequestException(`This plan is for ${plan.vendorRole} vendors, not ${vendor.role}`);
        }
        const existing = await this.prisma.vendorSubscription.findUnique({
            where: { vendorId },
        });
        if (existing && existing.status === shared_1.SubscriptionStatus.ACTIVE) {
            throw new common_1.ConflictException('Vendor already has an active subscription');
        }
        let razorpayPlanId = plan.razorpayPlanId;
        if (!razorpayPlanId) {
            this.logger.log(`Creating Razorpay plan for "${plan.name}" (lazy sync)`);
            const rzpPlan = await this.razorpay.createPlan({
                period: 'monthly',
                interval: plan.periodMonths,
                item: {
                    name: plan.name,
                    amount: plan.amountPaise,
                    currency: 'INR',
                    description: plan.name,
                },
            });
            razorpayPlanId = rzpPlan.id;
            await this.prisma.subscriptionPlan.update({
                where: { id: planId },
                data: { razorpayPlanId },
            });
        }
        const rzpSubscription = await this.razorpay.createSubscription({
            plan_id: razorpayPlanId,
            total_count: 120,
            customer_notify: 1,
            notes: { vendorId, planId },
        });
        if (existing) {
            await this.prisma.vendorSubscription.update({
                where: { vendorId },
                data: {
                    planId,
                    razorpaySubscriptionId: rzpSubscription.id,
                    status: shared_1.SubscriptionStatus.CREATED,
                },
            });
        }
        else {
            await this.prisma.vendorSubscription.create({
                data: {
                    vendorId,
                    planId,
                    razorpaySubscriptionId: rzpSubscription.id,
                    status: shared_1.SubscriptionStatus.CREATED,
                },
            });
        }
        return {
            subscriptionId: rzpSubscription.id,
            shortUrl: rzpSubscription.short_url,
        };
    }
    async getMySubscription(vendorId) {
        const subscription = await this.prisma.vendorSubscription.findUnique({
            where: { vendorId },
            include: {
                plan: true,
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('No subscription found');
        }
        return subscription;
    }
    async cancelSubscription(vendorId) {
        const subscription = await this.prisma.vendorSubscription.findUnique({
            where: { vendorId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('No subscription found');
        }
        if (subscription.status !== shared_1.SubscriptionStatus.ACTIVE) {
            throw new common_1.BadRequestException('Only active subscriptions can be cancelled');
        }
        if (subscription.razorpaySubscriptionId) {
            await this.razorpay.cancelSubscription(subscription.razorpaySubscriptionId, true);
        }
        return this.prisma.vendorSubscription.update({
            where: { vendorId },
            data: { status: shared_1.SubscriptionStatus.CANCELLED },
            include: { plan: true },
        });
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = SubscriptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_service_1.RazorpayService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map