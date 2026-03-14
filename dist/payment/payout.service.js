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
var PayoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PayoutService = PayoutService_1 = class PayoutService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PayoutService_1.name);
        this.xKeyId = process.env.RAZORPAY_X_KEY_ID ?? '';
        this.xKeySecret = process.env.RAZORPAY_X_KEY_SECRET ?? '';
        this.accountNumber = process.env.RAZORPAY_X_ACCOUNT_NUMBER ?? '';
        if (!this.xKeyId || !this.xKeySecret || !this.accountNumber) {
            this.devMode = true;
            this.logger.warn('RAZORPAY_X_KEY_ID, RAZORPAY_X_KEY_SECRET, or RAZORPAY_X_ACCOUNT_NUMBER not set. ' +
                'PayoutService running in dev mock mode.');
        }
        else {
            this.devMode = false;
        }
    }
    async createPayout(params) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: params.vendorId },
            include: {
                user: { select: { phone: true, email: true } },
            },
        });
        if (!vendor) {
            throw new Error(`Vendor ${params.vendorId} not found`);
        }
        if (!vendor.bankAccountNumber || !vendor.bankIfsc || !vendor.bankAccountName) {
            this.logger.warn(`Vendor ${params.vendorId} missing bank details. Payout deferred.`);
            await this.prisma.transaction.updateMany({
                where: {
                    bookingId: params.bookingId,
                    type: 'BOOKING_COMMISSION',
                },
                data: { payoutStatus: 'PENDING_BANK_DETAILS' },
            });
            return {
                id: `pending_${params.bookingId}`,
                status: 'PENDING_BANK_DETAILS',
                amount: params.netPayoutPaise,
            };
        }
        if (this.devMode) {
            this.logger.warn(`Dev mode: mock payout of ${params.netPayoutPaise} paise to vendor ${params.vendorId}`);
            return {
                id: `pout_mock_${Date.now()}`,
                status: 'processing',
                amount: params.netPayoutPaise,
            };
        }
        const response = await fetch('https://api.razorpay.com/v1/payouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${Buffer.from(`${this.xKeyId}:${this.xKeySecret}`).toString('base64')}`,
                'X-Payout-Idempotency': `payout_${params.bookingId}_${params.razorpayPaymentId}`,
            },
            body: JSON.stringify({
                account_number: this.accountNumber,
                fund_account: {
                    account_type: 'bank_account',
                    bank_account: {
                        name: vendor.bankAccountName,
                        ifsc: vendor.bankIfsc,
                        account_number: vendor.bankAccountNumber,
                    },
                    contact: {
                        name: vendor.businessName,
                        type: 'vendor',
                        email: vendor.user.email || undefined,
                        contact: vendor.user.phone,
                    },
                },
                amount: params.netPayoutPaise,
                currency: 'INR',
                mode: 'IMPS',
                purpose: 'vendor_payout',
                queue_if_low_balance: true,
                reference_id: `booking_${params.bookingId}`.substring(0, 40),
                narration: `Zevento payout for booking ${params.bookingId.substring(0, 8)}`,
            }),
        });
        const body = await response.json();
        if (!response.ok) {
            this.logger.error(`RazorpayX Payout API error: ${response.status} ${JSON.stringify(body)}`);
            throw new Error(`RazorpayX payout failed: ${response.status} - ${body?.error?.description || JSON.stringify(body)}`);
        }
        this.logger.log(`Payout created: id=${body.id}, status=${body.status}, amount=${body.amount}`);
        return {
            id: body.id,
            status: body.status,
            amount: body.amount,
        };
    }
};
exports.PayoutService = PayoutService;
exports.PayoutService = PayoutService = PayoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayoutService);
//# sourceMappingURL=payout.service.js.map