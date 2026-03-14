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
var PaymentProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const shared_1 = require("@zevento/shared");
const prisma_service_1 = require("../../prisma/prisma.service");
const commission_service_1 = require("../commission.service");
let PaymentProcessor = PaymentProcessor_1 = class PaymentProcessor extends bullmq_1.WorkerHost {
    constructor(prisma, commissionService) {
        super();
        this.prisma = prisma;
        this.commissionService = commissionService;
        this.logger = new common_1.Logger(PaymentProcessor_1.name);
    }
    async process(job) {
        const { webhookEventId, paymentEntity, orderNotes } = job.data;
        this.logger.log(`Processing payment captured: paymentId=${paymentEntity.id}, orderId=${paymentEntity.order_id}`);
        const booking = await this.prisma.booking.findFirst({
            where: { razorpayOrderId: paymentEntity.order_id },
            include: {
                lead: { select: { categoryId: true } },
            },
        });
        if (!booking) {
            this.logger.error(`No booking found for order ${paymentEntity.order_id}. Marking webhook as FAILED.`);
            await this.prisma.webhookEvent.update({
                where: { id: webhookEventId },
                data: { status: shared_1.WebhookEventStatus.FAILED },
            });
            return;
        }
        let commissionRateBps = booking.commissionRateBps;
        if (commissionRateBps == null) {
            this.logger.warn(`Booking ${booking.id} has no locked commission rate. Falling back to CommissionService.`);
            commissionRateBps = await this.commissionService.getRate(booking.vendorId, booking.lead?.categoryId ?? undefined);
        }
        const totalPaise = paymentEntity.amount;
        const commissionPaise = Math.round((totalPaise * commissionRateBps) / 10000);
        const netPayoutPaise = totalPaise - commissionPaise;
        this.logger.log(`Commission split: total=${totalPaise}, commission=${commissionPaise} (${commissionRateBps}bps), net=${netPayoutPaise}`);
        await this.prisma.transaction.create({
            data: {
                bookingId: booking.id,
                type: shared_1.TransactionType.BOOKING_COMMISSION,
                amountPaise: totalPaise,
                commissionPaise,
                netPayoutPaise,
                razorpayPaymentId: paymentEntity.id,
                razorpayOrderId: paymentEntity.order_id,
                status: shared_1.TransactionStatus.PAID,
                paidAt: new Date(),
            },
        });
        await this.prisma.booking.update({
            where: { id: booking.id },
            data: { paymentStatus: 'CAPTURED' },
        });
        await this.prisma.webhookEvent.update({
            where: { id: webhookEventId },
            data: {
                status: shared_1.WebhookEventStatus.PROCESSED,
                processedAt: new Date(),
            },
        });
        this.logger.log(`Payment processed: booking=${booking.id}, transaction created, paymentStatus=CAPTURED`);
    }
    onFailed(job, error) {
        this.logger.error(`Payment processing job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts?.attempts ?? '?'}): ${error.message}`, error.stack);
    }
};
exports.PaymentProcessor = PaymentProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], PaymentProcessor.prototype, "onFailed", null);
exports.PaymentProcessor = PaymentProcessor = PaymentProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('payment-processing'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        commission_service_1.CommissionService])
], PaymentProcessor);
//# sourceMappingURL=payment.processor.js.map