import { Queue } from 'bullmq';
import { NotificationService } from '../notification/notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { BlockDateDto } from './dto/block-date.dto';
import { TransitionStatusDto } from './dto/transition-status.dto';
export declare class BookingService {
    private readonly prisma;
    private readonly notificationService;
    private readonly payoutQueue;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService, payoutQueue: Queue);
    transitionStatus(bookingId: string, requesterId: string, requesterRole: string, dto: TransitionStatusDto): Promise<({
        statusHistory: {
            id: string;
            bookingId: string;
            note: string | null;
            changedAt: Date;
            fromStatus: string | null;
            toStatus: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string;
        vendorId: string;
        customerId: string;
        razorpayOrderId: string | null;
        quoteId: string;
        confirmedAt: Date;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancellationNote: string | null;
        paymentStatus: string | null;
        commissionRateBps: number | null;
    }) | null>;
    getBooking(bookingId: string, requesterId: string): Promise<{
        quote: {
            lineItems: {
                id: string;
                description: string;
                amountPaise: number;
                quoteId: string;
                quantity: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            submittedAt: Date | null;
            leadId: string;
            vendorId: string;
            note: string | null;
            totalPaise: number;
            validUntil: Date;
        };
        review: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vendorId: string;
            customerId: string;
            bookingId: string;
            respondedAt: Date | null;
            rating: number;
            comment: string | null;
            vendorResponse: string | null;
        } | null;
        vendor: {
            id: string;
            businessName: string;
        };
        customer: {
            id: string;
            name: string | null;
        };
        statusHistory: {
            id: string;
            bookingId: string;
            note: string | null;
            changedAt: Date;
            fromStatus: string | null;
            toStatus: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        leadId: string;
        vendorId: string;
        customerId: string;
        razorpayOrderId: string | null;
        quoteId: string;
        confirmedAt: Date;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancellationNote: string | null;
        paymentStatus: string | null;
        commissionRateBps: number | null;
    }>;
    blockDate(vendorId: string, dto: BlockDateDto): Promise<{
        id: string;
        createdAt: Date;
        vendorId: string;
        reason: string | null;
        date: Date;
    }>;
    unblockDate(vendorId: string, date: string): Promise<{
        deleted: number;
    }>;
    getVendorCalendar(vendorId: string, year: number, month: number): Promise<{
        blockedDates: string[];
        bookingDates: string[];
    }>;
    getVendorEarnings(vendorId: string): Promise<{
        leadsReceived: number;
        leadsWon: number;
        completedBookings: number;
        totalEarningsPaise: number;
    }>;
}
