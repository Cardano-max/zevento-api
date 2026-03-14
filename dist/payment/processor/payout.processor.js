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
var PayoutProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const shared_1 = require("@zevento/shared");
const prisma_service_1 = require("../../prisma/prisma.service");
const payout_service_1 = require("../payout.service");
let PayoutProcessor = PayoutProcessor_1 = class PayoutProcessor extends bullmq_1.WorkerHost {
    constructor(prisma, payoutService) {
        super();
        this.prisma = prisma;
        this.payoutService = payoutService;
        this.logger = new common_1.Logger(PayoutProcessor_1.name);
    }
    async process(job) {
        const { bookingId, vendorId, netPayoutPaise, razorpayPaymentId } = job.data;
        this.logger.log(`Processing vendor payout: bookingId=${bookingId}, vendorId=${vendorId}, amount=${netPayoutPaise}`);
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            this.logger.error(`Booking ${bookingId} not found for payout`);
            return;
        }
        if (booking.status !== 'COMPLETED') {
            this.logger.warn(`Booking ${bookingId} status is ${booking.status}, not COMPLETED. Retrying...`);
            throw new Error(`Booking ${bookingId} is not COMPLETED (current: ${booking.status}). Will retry.`);
        }
        const result = await this.payoutService.createPayout({
            bookingId,
            vendorId,
            netPayoutPaise,
            razorpayPaymentId,
        });
        if (result.status !== 'PENDING_BANK_DETAILS') {
            await this.prisma.transaction.updateMany({
                where: {
                    bookingId,
                    type: shared_1.TransactionType.BOOKING_COMMISSION,
                },
                data: {
                    razorpayPayoutId: result.id,
                    payoutStatus: result.status === 'processing' ? 'PROCESSING' : 'QUEUED',
                },
            });
        }
        this.logger.log(`Vendor payout ${result.status}: bookingId=${bookingId}, payoutId=${result.id}`);
    }
    onFailed(job, error) {
        this.logger.error(`Vendor payout job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts?.attempts ?? '?'}): ${error.message}`, error.stack);
    }
};
exports.PayoutProcessor = PayoutProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], PayoutProcessor.prototype, "onFailed", null);
exports.PayoutProcessor = PayoutProcessor = PayoutProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('vendor-payout'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payout_service_1.PayoutService])
], PayoutProcessor);
//# sourceMappingURL=payout.processor.js.map