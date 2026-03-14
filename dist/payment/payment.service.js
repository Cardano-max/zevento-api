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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@zevento/shared");
const prisma_service_1 = require("../prisma/prisma.service");
const razorpay_service_1 = require("../subscription/razorpay.service");
const commission_service_1 = require("./commission.service");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(prisma, razorpayService, commissionService) {
        this.prisma = prisma;
        this.razorpayService = razorpayService;
        this.commissionService = commissionService;
        this.logger = new common_1.Logger(PaymentService_1.name);
    }
    async createBookingOrder(bookingId, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                quote: true,
                vendor: { select: { id: true, businessName: true } },
                lead: { select: { categoryId: true } },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.customerId !== userId) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== 'BOOKED') {
            throw new common_1.BadRequestException('Booking is not in a payable state');
        }
        if (booking.razorpayOrderId &&
            booking.paymentStatus !== shared_1.PaymentStatus.FAILED) {
            throw new common_1.BadRequestException('Payment already initiated');
        }
        const commissionRateBps = await this.commissionService.getRate(booking.vendorId, booking.lead?.categoryId);
        const order = await this.razorpayService.createOrder({
            amount: booking.quote.totalPaise,
            currency: 'INR',
            receipt: `bkg_${booking.id.substring(0, 30)}`,
            notes: {
                bookingId: booking.id,
                vendorId: booking.vendorId,
                customerId: booking.customerId,
                type: 'BOOKING_COMMISSION',
                commissionRateBps: String(commissionRateBps),
            },
        });
        await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                razorpayOrderId: order.id,
                paymentStatus: shared_1.PaymentStatus.PENDING,
                commissionRateBps,
            },
        });
        this.logger.log(`Razorpay order created: orderId=${order.id}, bookingId=${bookingId}, amount=${order.amount}, commissionBps=${commissionRateBps}`);
        return {
            orderId: order.id,
            amount: order.amount,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
        };
    }
    async createProductOrderPayment(orderId, userId) {
        const order = await this.prisma.productOrder.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Product order not found');
        }
        if (order.buyerId !== userId) {
            throw new common_1.NotFoundException('Product order not found');
        }
        if (order.status !== 'PENDING') {
            throw new common_1.BadRequestException('Only PENDING orders can be paid for');
        }
        if (order.razorpayOrderId &&
            order.paymentStatus !== 'FAILED') {
            throw new common_1.BadRequestException('Payment already initiated for this order');
        }
        const commissionRateBps = await this.commissionService.getRate(order.vendorId, null);
        const razorpayOrder = await this.razorpayService.createOrder({
            amount: order.totalPaise,
            currency: 'INR',
            receipt: `po_${order.id.substring(0, 30)}`,
            notes: {
                productOrderId: order.id,
                vendorId: order.vendorId,
                customerId: order.buyerId,
                type: 'MARKETPLACE_SALE',
                commissionRateBps: String(commissionRateBps),
            },
        });
        await this.prisma.productOrder.update({
            where: { id: orderId },
            data: {
                razorpayOrderId: razorpayOrder.id,
                paymentStatus: 'PENDING',
                commissionRateBps,
            },
        });
        this.logger.log(`Product order Razorpay order created: orderId=${razorpayOrder.id}, productOrderId=${orderId}, amount=${razorpayOrder.amount}, commissionBps=${commissionRateBps}`);
        return {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
        };
    }
    async verifyPayment(dto) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = dto;
        const isValid = this.razorpayService.validatePaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid payment signature');
        }
        const booking = await this.prisma.booking.findFirst({
            where: { razorpayOrderId: razorpay_order_id },
        });
        if (booking) {
            await this.prisma.booking.update({
                where: { id: booking.id },
                data: { paymentStatus: shared_1.PaymentStatus.CAPTURED },
            });
            this.logger.log(`Payment verified: bookingId=${booking.id}, paymentId=${razorpay_payment_id}`);
        }
        else {
            this.logger.warn(`No booking found for orderId=${razorpay_order_id} during payment verification`);
        }
        return { status: 'ok', paymentId: razorpay_payment_id };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_service_1.RazorpayService,
        commission_service_1.CommissionService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map