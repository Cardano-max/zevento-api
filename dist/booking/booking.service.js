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
var BookingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const notification_service_1 = require("../notification/notification.service");
const prisma_service_1 = require("../prisma/prisma.service");
const BOOKING_PUSH_MESSAGES = {
    BOOKED: { title: 'Booking Confirmed', body: 'Your booking has been confirmed.' },
    IN_PROGRESS: { title: 'Event in Progress', body: 'Your vendor is on the way.' },
    COMPLETED: { title: 'Event Completed', body: 'How did it go? Leave a review.' },
    CANCELLED: { title: 'Booking Cancelled', body: 'Your booking has been cancelled.' },
};
const VALID_TRANSITIONS = {
    BOOKED: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
};
let BookingService = BookingService_1 = class BookingService {
    constructor(prisma, notificationService, payoutQueue) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.payoutQueue = payoutQueue;
        this.logger = new common_1.Logger(BookingService_1.name);
    }
    async transitionStatus(bookingId, requesterId, requesterRole, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking ${bookingId} not found`);
        }
        if (requesterRole === 'VENDOR' || requesterRole === 'PLANNER' || requesterRole === 'SUPPLIER') {
            const vendor = await this.prisma.vendorProfile.findUnique({
                where: { userId: requesterId },
                select: { id: true },
            });
            if (!vendor || vendor.id !== booking.vendorId) {
                throw new common_1.ForbiddenException('You are not the vendor for this booking');
            }
        }
        else if (requesterRole === 'CUSTOMER') {
            if (booking.customerId !== requesterId) {
                throw new common_1.ForbiddenException('You are not the customer for this booking');
            }
        }
        else {
            throw new common_1.ForbiddenException('Insufficient role to transition booking status');
        }
        const allowedNext = VALID_TRANSITIONS[booking.status] ?? [];
        if (!allowedNext.includes(dto.status)) {
            throw new common_1.BadRequestException(`Cannot transition booking from ${booking.status} to ${dto.status}. ` +
                `Allowed transitions: ${allowedNext.join(', ') || 'none'}`);
        }
        const currentStatus = booking.status;
        await this.prisma.$transaction(async (tx) => {
            const updated = await tx.booking.updateMany({
                where: { id: bookingId, status: currentStatus },
                data: {
                    status: dto.status,
                    completedAt: dto.status === 'COMPLETED' ? new Date() : undefined,
                    cancelledAt: dto.status === 'CANCELLED' ? new Date() : undefined,
                    cancellationNote: dto.status === 'CANCELLED' ? (dto.note ?? undefined) : undefined,
                },
            });
            if (updated.count === 0) {
                throw new common_1.BadRequestException(`Booking status conflict: expected ${currentStatus}, booking may have already transitioned`);
            }
            await tx.bookingStatusHistory.create({
                data: {
                    bookingId,
                    fromStatus: currentStatus,
                    toStatus: dto.status,
                    note: dto.note ?? null,
                },
            });
            if (dto.status === 'COMPLETED') {
                await tx.lead.update({
                    where: { id: booking.leadId },
                    data: { status: 'COMPLETED' },
                });
            }
        });
        if (dto.status === 'COMPLETED') {
            const tx = await this.prisma.transaction.findFirst({
                where: {
                    bookingId: booking.id,
                    type: 'BOOKING_COMMISSION',
                    status: 'PAID',
                },
            });
            if (tx && tx.netPayoutPaise) {
                await this.payoutQueue.add('vendor-payout', {
                    bookingId: booking.id,
                    vendorId: booking.vendorId,
                    netPayoutPaise: tx.netPayoutPaise,
                    razorpayPaymentId: tx.razorpayPaymentId,
                }, {
                    attempts: 5,
                    backoff: { type: 'exponential', delay: 60000 },
                });
                this.logger.log(`Vendor payout job enqueued for booking ${booking.id}: ${tx.netPayoutPaise} paise`);
            }
        }
        const pushMessage = BOOKING_PUSH_MESSAGES[dto.status];
        if (pushMessage) {
            await this.notificationService.sendPushToCustomer(booking.customerId, {
                title: pushMessage.title,
                body: pushMessage.body,
                data: { bookingId, type: 'BOOKING_STATUS' },
            });
        }
        this.logger.log(`Booking ${bookingId}: ${currentStatus} → ${dto.status} by ${requesterRole} ${requesterId}`);
        return this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { statusHistory: { orderBy: { changedAt: 'desc' } } },
        });
    }
    async getBooking(bookingId, requesterId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                statusHistory: { orderBy: { changedAt: 'desc' } },
                quote: {
                    include: { lineItems: true },
                },
                vendor: { select: { id: true, businessName: true } },
                customer: { select: { id: true, name: true } },
                review: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking ${bookingId} not found`);
        }
        if (booking.customerId !== requesterId && booking.vendorId !== booking.vendorId) {
            const vendor = await this.prisma.vendorProfile.findUnique({
                where: { userId: requesterId },
                select: { id: true },
            });
            if (!vendor || vendor.id !== booking.vendorId) {
                if (booking.customerId !== requesterId) {
                    throw new common_1.ForbiddenException('Access denied: not your booking');
                }
            }
        }
        return booking;
    }
    async blockDate(vendorId, dto) {
        try {
            const blocked = await this.prisma.blockedDate.create({
                data: {
                    vendorId,
                    date: new Date(dto.date),
                    reason: dto.reason ?? null,
                },
            });
            return blocked;
        }
        catch (error) {
            if (error?.code === 'P2002') {
                throw new common_1.ConflictException(`Date ${dto.date} is already blocked`);
            }
            throw error;
        }
    }
    async unblockDate(vendorId, date) {
        const result = await this.prisma.blockedDate.deleteMany({
            where: { vendorId, date: new Date(date) },
        });
        return { deleted: result.count };
    }
    async getVendorCalendar(vendorId, year, month) {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);
        const [blockedDates, bookings] = await Promise.all([
            this.prisma.blockedDate.findMany({
                where: {
                    vendorId,
                    date: { gte: startOfMonth, lte: endOfMonth },
                },
                select: { date: true },
            }),
            this.prisma.booking.findMany({
                where: {
                    vendorId,
                    status: { in: ['BOOKED', 'IN_PROGRESS'] },
                    lead: {
                        eventDate: { gte: startOfMonth, lte: endOfMonth },
                    },
                },
                include: {
                    lead: { select: { eventDate: true } },
                },
            }),
        ]);
        const toDateString = (d) => d.toISOString().split('T')[0];
        return {
            blockedDates: blockedDates.map((b) => toDateString(b.date)),
            bookingDates: bookings.map((b) => toDateString(b.lead.eventDate)),
        };
    }
    async getVendorEarnings(vendorId) {
        const [stats, completedBookings, completedBookingsList] = await Promise.all([
            this.prisma.vendorStats.findUnique({
                where: { vendorId },
                select: { totalLeadsReceived: true, totalLeadsWon: true },
            }),
            this.prisma.booking.count({
                where: { vendorId, status: 'COMPLETED' },
            }),
            this.prisma.booking.findMany({
                where: { vendorId, status: 'COMPLETED' },
                include: { quote: { select: { totalPaise: true } } },
            }),
        ]);
        const totalEarningsPaise = completedBookingsList.reduce((sum, b) => sum + (b.quote?.totalPaise ?? 0), 0);
        return {
            leadsReceived: stats?.totalLeadsReceived ?? 0,
            leadsWon: stats?.totalLeadsWon ?? 0,
            completedBookings,
            totalEarningsPaise,
        };
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = BookingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('vendor-payout')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        bullmq_2.Queue])
], BookingService);
//# sourceMappingURL=booking.service.js.map