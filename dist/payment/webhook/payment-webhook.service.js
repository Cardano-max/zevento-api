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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentWebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const shared_1 = require("@zevento/shared");
const prisma_service_1 = require("../../prisma/prisma.service");
const razorpay_service_1 = require("../../subscription/razorpay.service");
let PaymentWebhookService = PaymentWebhookService_1 = class PaymentWebhookService {
    constructor(prisma, razorpayService, paymentQueue, productOrderPaymentQueue) {
        this.prisma = prisma;
        this.razorpayService = razorpayService;
        this.paymentQueue = paymentQueue;
        this.productOrderPaymentQueue = productOrderPaymentQueue;
        this.logger = new common_1.Logger(PaymentWebhookService_1.name);
    }
    async handleWebhook(rawBody, signature) {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
        const isValid = this.razorpayService.validateWebhookSignature(rawBody, signature, webhookSecret);
        if (!isValid) {
            this.logger.error('Invalid payment webhook signature');
            throw new common_1.UnauthorizedException('Invalid webhook signature');
        }
        const payload = JSON.parse(rawBody);
        const event = payload.event;
        const paymentEntity = payload.payload?.payment?.entity;
        if (!paymentEntity) {
            this.logger.warn('Payment webhook payload missing payment entity');
            return;
        }
        const externalId = `${paymentEntity.id}_${event}`;
        this.logger.log(`Processing payment webhook: event=${event}, paymentId=${paymentEntity.id}, externalId=${externalId}`);
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
                this.logger.log(`Duplicate payment event skipped: ${externalId}`);
                return;
            }
            throw error;
        }
        try {
            switch (event) {
                case 'payment.captured':
                    await this.handlePaymentCaptured(webhookEvent.id, paymentEntity);
                    break;
                case 'payment.failed':
                    await this.handlePaymentFailed(paymentEntity);
                    await this.markWebhookProcessed(webhookEvent.id);
                    break;
                case 'refund.processed':
                    await this.handleRefundProcessed(paymentEntity);
                    await this.markWebhookProcessed(webhookEvent.id);
                    break;
                default:
                    this.logger.warn(`Unhandled payment event type: ${event}`);
                    await this.markWebhookProcessed(webhookEvent.id);
                    break;
            }
        }
        catch (error) {
            this.logger.error(`Error processing payment webhook event ${externalId}: ${error}`);
            await this.prisma.webhookEvent.update({
                where: { id: webhookEvent.id },
                data: { status: shared_1.WebhookEventStatus.FAILED },
            });
            throw error;
        }
    }
    async handlePaymentCaptured(webhookEventId, paymentEntity) {
        const notes = paymentEntity.notes || {};
        const paymentType = notes.type;
        if (paymentType === 'MARKETPLACE_SALE') {
            await this.productOrderPaymentQueue.add('product-order-payment-captured', { webhookEventId, paymentEntity, orderNotes: notes }, { attempts: 3, backoff: { type: 'exponential', delay: 60000 } });
            this.logger.log(`Enqueued product-order-payment job for payment ${paymentEntity.id}`);
        }
        else {
            await this.paymentQueue.add('payment-captured', {
                webhookEventId,
                paymentEntity,
                orderNotes: notes,
            }, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 60000 },
            });
            this.logger.log(`Enqueued payment-processing job for payment ${paymentEntity.id}`);
        }
    }
    async handlePaymentFailed(paymentEntity) {
        const orderId = paymentEntity.order_id;
        if (!orderId) {
            this.logger.warn('payment.failed event has no order_id');
            return;
        }
        const notes = paymentEntity.notes || {};
        const paymentType = notes.type;
        if (paymentType === 'MARKETPLACE_SALE') {
            const productOrder = await this.prisma.productOrder.findFirst({
                where: { razorpayOrderId: orderId },
                include: { items: true },
            });
            if (productOrder) {
                await this.prisma.$transaction(async (tx) => {
                    for (const item of productOrder.items) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: { stock: { increment: item.quantity } },
                        });
                    }
                    await tx.productOrder.update({
                        where: { id: productOrder.id },
                        data: { paymentStatus: 'FAILED' },
                    });
                });
                this.logger.log(`ProductOrder ${productOrder.id} payment FAILED — stock restored for ${productOrder.items.length} item(s) (order ${orderId})`);
            }
            else {
                this.logger.warn(`No ProductOrder found for order ${orderId} in payment.failed event (MARKETPLACE_SALE)`);
            }
        }
        else {
            const booking = await this.prisma.booking.findFirst({
                where: { razorpayOrderId: orderId },
            });
            if (booking) {
                await this.prisma.booking.update({
                    where: { id: booking.id },
                    data: { paymentStatus: 'FAILED' },
                });
                this.logger.log(`Booking ${booking.id} payment status set to FAILED (order ${orderId})`);
            }
            else {
                this.logger.warn(`No booking found for order ${orderId} in payment.failed event`);
            }
        }
    }
    async handleRefundProcessed(paymentEntity) {
        const paymentId = paymentEntity.id;
        const transaction = await this.prisma.transaction.findUnique({
            where: { razorpayPaymentId: paymentId },
        });
        if (transaction) {
            await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'REFUNDED' },
            });
            if (transaction.bookingId) {
                await this.prisma.booking.update({
                    where: { id: transaction.bookingId },
                    data: { paymentStatus: 'REFUNDED' },
                });
            }
            this.logger.log(`Transaction ${transaction.id} marked REFUNDED for payment ${paymentId}`);
        }
        else {
            this.logger.warn(`No transaction found for payment ${paymentId} in refund.processed event`);
        }
    }
    async markWebhookProcessed(webhookEventId) {
        await this.prisma.webhookEvent.update({
            where: { id: webhookEventId },
            data: {
                status: shared_1.WebhookEventStatus.PROCESSED,
                processedAt: new Date(),
            },
        });
    }
};
exports.PaymentWebhookService = PaymentWebhookService;
exports.PaymentWebhookService = PaymentWebhookService = PaymentWebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('payment-processing')),
    __param(3, (0, bullmq_1.InjectQueue)('product-order-payment')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_service_1.RazorpayService,
        bullmq_2.Queue,
        bullmq_2.Queue])
], PaymentWebhookService);
//# sourceMappingURL=payment-webhook.service.js.map