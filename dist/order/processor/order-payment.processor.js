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
var OrderPaymentProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaymentProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const shared_1 = require("@zevento/shared");
const prisma_service_1 = require("../../prisma/prisma.service");
const commission_service_1 = require("../../payment/commission.service");
const notification_service_1 = require("../../notification/notification.service");
let OrderPaymentProcessor = OrderPaymentProcessor_1 = class OrderPaymentProcessor extends bullmq_1.WorkerHost {
    constructor(prisma, commissionService, notificationService) {
        super();
        this.prisma = prisma;
        this.commissionService = commissionService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(OrderPaymentProcessor_1.name);
    }
    async process(job) {
        const { webhookEventId, paymentEntity } = job.data;
        this.logger.log(`Processing product order payment captured: paymentId=${paymentEntity.id}, orderId=${paymentEntity.order_id}`);
        const productOrder = await this.prisma.productOrder.findFirst({
            where: { razorpayOrderId: paymentEntity.order_id },
        });
        if (!productOrder) {
            this.logger.error(`No ProductOrder found for order ${paymentEntity.order_id}. Marking webhook as FAILED.`);
            await this.prisma.webhookEvent.update({
                where: { id: webhookEventId },
                data: { status: shared_1.WebhookEventStatus.FAILED },
            });
            return;
        }
        let commissionRateBps = productOrder.commissionRateBps;
        if (commissionRateBps == null) {
            this.logger.warn(`ProductOrder ${productOrder.id} has no locked commission rate. Falling back to CommissionService.`);
            commissionRateBps = await this.commissionService.getRate(productOrder.vendorId, null);
        }
        const totalPaise = paymentEntity.amount;
        const commissionPaise = Math.round((totalPaise * commissionRateBps) / 10000);
        const netPayoutPaise = totalPaise - commissionPaise;
        this.logger.log(`Commission split: total=${totalPaise}, commission=${commissionPaise} (${commissionRateBps}bps), net=${netPayoutPaise}`);
        await this.prisma.transaction.create({
            data: {
                productOrderId: productOrder.id,
                type: shared_1.TransactionType.MARKETPLACE_SALE,
                amountPaise: totalPaise,
                commissionPaise,
                netPayoutPaise,
                razorpayPaymentId: paymentEntity.id,
                razorpayOrderId: paymentEntity.order_id,
                status: shared_1.TransactionStatus.PAID,
                paidAt: new Date(),
            },
        });
        await this.prisma.productOrder.update({
            where: { id: productOrder.id },
            data: { paymentStatus: 'CAPTURED' },
        });
        await this.prisma.webhookEvent.update({
            where: { id: webhookEventId },
            data: {
                status: shared_1.WebhookEventStatus.PROCESSED,
                processedAt: new Date(),
            },
        });
        try {
            await this.notificationService.sendPushToVendor(productOrder.vendorId, {
                leadId: productOrder.id,
                eventType: 'New product order received!',
                city: 'Order Alert',
            });
        }
        catch (error) {
            this.logger.warn(`Failed to send push notification to vendor ${productOrder.vendorId}: ${error}`);
        }
        this.logger.log(`Product order payment processed: order=${productOrder.id}, transaction created, paymentStatus=CAPTURED`);
    }
    onFailed(job, error) {
        this.logger.error(`Product order payment job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts?.attempts ?? '?'}): ${error.message}`, error.stack);
    }
};
exports.OrderPaymentProcessor = OrderPaymentProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], OrderPaymentProcessor.prototype, "onFailed", null);
exports.OrderPaymentProcessor = OrderPaymentProcessor = OrderPaymentProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('product-order-payment'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        commission_service_1.CommissionService,
        notification_service_1.NotificationService])
], OrderPaymentProcessor);
//# sourceMappingURL=order-payment.processor.js.map