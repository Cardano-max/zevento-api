import { BookingService } from './booking.service';
import { BlockDateDto } from './dto/block-date.dto';
import { TransitionStatusDto } from './dto/transition-status.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    getBooking(bookingId: string, req: any): Promise<{
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
            bookingId: string;
            customerId: string;
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
        razorpayOrderId: string | null;
        quoteId: string;
        customerId: string;
        confirmedAt: Date;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancellationNote: string | null;
        paymentStatus: string | null;
        commissionRateBps: number | null;
    }>;
    transitionStatus(bookingId: string, req: any, dto: TransitionStatusDto): Promise<({
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
        razorpayOrderId: string | null;
        quoteId: string;
        customerId: string;
        confirmedAt: Date;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancellationNote: string | null;
        paymentStatus: string | null;
        commissionRateBps: number | null;
    }) | null>;
    blockDate(req: any, dto: BlockDateDto): Promise<{
        id: string;
        createdAt: Date;
        vendorId: string;
        reason: string | null;
        date: Date;
    }>;
    unblockDate(req: any, date: string): Promise<{
        deleted: number;
    }>;
    getVendorCalendar(req: any, year: number, month: number): Promise<{
        blockedDates: string[];
        bookingDates: string[];
    }>;
    getVendorEarnings(req: any): Promise<{
        leadsReceived: number;
        leadsWon: number;
        completedBookings: number;
        totalEarningsPaise: number;
    }>;
}
