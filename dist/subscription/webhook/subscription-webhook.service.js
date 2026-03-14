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
var SubscriptionWebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionWebhookService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@zevento/shared");
const prisma_service_1 = require("../../prisma/prisma.service");
const razorpay_service_1 = require("../razorpay.service");
let SubscriptionWebhookService = SubscriptionWebhookService_1 = class SubscriptionWebhookService {
    constructor(prisma, razorpay) {
        this.prisma = prisma;
        this.razorpay = razorpay;
        this.logger = new common_1.Logger(SubscriptionWebhookService_1.name);
    }
    async handleWebhook(rawBody, signature) {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
        const isValid = this.razorpay.validateWebhookSignature(rawBody, signature, webhookSecret);
        if (!isValid) {
            this.logger.error('Invalid webhook signature');
            throw new common_1.UnauthorizedException('Invalid webhook signature');
        }
        const payload = JSON.parse(rawBody);
        const event = payload.event;
        const subscriptionEntity = payload.payload?.subscription?.entity;
        const paymentEntity = payload.payload?.payment?.entity;
        if (!subscriptionEntity) {
            this.logger.warn('Webhook payload missing subscription entity');
            return;
        }
        const subscriptionId = subscriptionEntity.id;
        const uniquePart = paymentEntity?.id ?? payload.created_at ?? Date.now();
        const externalId = `${subscriptionId}_${event}_${uniquePart}`;
        this.logger.log(`Processing webhook: event=${event}, subscriptionId=${subscriptionId}, externalId=${externalId}`);
        let webhookEvent;
        try {
            webhookEvent = await this.prisma.webhookEvent.create({
                data: {
                    provider: 'RAZORPAY',
                    externalId,
                    eventType: event,
                    status: shared_1.WebhookEventStatus.RECEIVED,
                    payload: payload,
                },
            });
        }
        catch (error) {
            if (error?.code === 'P2002') {
                this.logger.log(`Duplicate event skipped: ${externalId}`);
                return;
            }
            throw error;
        }
        const vendorSubscription = await this.prisma.vendorSubscription.findUnique({
            where: { razorpaySubscriptionId: subscriptionId },
        });
        if (!vendorSubscription) {
            this.logger.error(`Orphaned webhook: no VendorSubscription for razorpaySubscriptionId=${subscriptionId}`);
            await this.prisma.webhookEvent.update({
                where: { id: webhookEvent.id },
                data: {
                    status: shared_1.WebhookEventStatus.PROCESSED,
                    processedAt: new Date(),
                },
            });
            return;
        }
        try {
            await this.processEvent(event, vendorSubscription.id, vendorSubscription.vendorId, subscriptionEntity, paymentEntity);
            await this.prisma.webhookEvent.update({
                where: { id: webhookEvent.id },
                data: {
                    status: shared_1.WebhookEventStatus.PROCESSED,
                    processedAt: new Date(),
                },
            });
        }
        catch (error) {
            this.logger.error(`Error processing webhook event ${externalId}: ${error}`);
            await this.prisma.webhookEvent.update({
                where: { id: webhookEvent.id },
                data: { status: shared_1.WebhookEventStatus.FAILED },
            });
            throw error;
        }
    }
    async processEvent(event, vendorSubscriptionId, vendorId, subscriptionEntity, paymentEntity) {
        switch (event) {
            case 'subscription.authenticated':
                await this.updateSubscriptionStatus(vendorId, shared_1.SubscriptionStatus.AUTHENTICATED);
                break;
            case 'subscription.activated':
                await this.prisma.vendorSubscription.update({
                    where: { vendorId },
                    data: {
                        status: shared_1.SubscriptionStatus.ACTIVE,
                        currentPeriodStart: subscriptionEntity.current_start
                            ? new Date(subscriptionEntity.current_start * 1000)
                            : undefined,
                        currentPeriodEnd: subscriptionEntity.current_end
                            ? new Date(subscriptionEntity.current_end * 1000)
                            : undefined,
                    },
                });
                break;
            case 'subscription.charged':
                await this.prisma.$transaction(async (tx) => {
                    await tx.vendorSubscription.update({
                        where: { vendorId },
                        data: {
                            status: shared_1.SubscriptionStatus.ACTIVE,
                            currentPeriodStart: subscriptionEntity.current_start
                                ? new Date(subscriptionEntity.current_start * 1000)
                                : undefined,
                            currentPeriodEnd: subscriptionEntity.current_end
                                ? new Date(subscriptionEntity.current_end * 1000)
                                : undefined,
                        },
                    });
                    if (paymentEntity) {
                        await tx.transaction.create({
                            data: {
                                vendorSubscriptionId,
                                type: shared_1.TransactionType.SUBSCRIPTION,
                                amountPaise: paymentEntity.amount,
                                razorpayPaymentId: paymentEntity.id,
                                status: shared_1.TransactionStatus.PAID,
                                paidAt: paymentEntity.captured_at
                                    ? new Date(paymentEntity.captured_at * 1000)
                                    : new Date(),
                            },
                        });
                    }
                });
                break;
            case 'subscription.pending':
                await this.updateSubscriptionStatus(vendorId, shared_1.SubscriptionStatus.PENDING);
                break;
            case 'subscription.halted':
                await this.updateSubscriptionStatus(vendorId, shared_1.SubscriptionStatus.HALTED);
                break;
            case 'subscription.cancelled':
                await this.updateSubscriptionStatus(vendorId, shared_1.SubscriptionStatus.CANCELLED);
                break;
            case 'subscription.paused':
                await this.updateSubscriptionStatus(vendorId, shared_1.SubscriptionStatus.PAUSED);
                break;
            case 'subscription.resumed':
                await this.updateSubscriptionStatus(vendorId, shared_1.SubscriptionStatus.ACTIVE);
                break;
            case 'subscription.completed':
                await this.updateSubscriptionStatus(vendorId, shared_1.SubscriptionStatus.COMPLETED);
                break;
            default:
                this.logger.warn(`Unknown subscription event type: ${event}`);
                break;
        }
    }
    async updateSubscriptionStatus(vendorId, status) {
        await this.prisma.vendorSubscription.update({
            where: { vendorId },
            data: { status },
        });
    }
};
exports.SubscriptionWebhookService = SubscriptionWebhookService;
exports.SubscriptionWebhookService = SubscriptionWebhookService = SubscriptionWebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_service_1.RazorpayService])
], SubscriptionWebhookService);
//# sourceMappingURL=subscription-webhook.service.js.map