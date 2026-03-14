import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
export declare class QuoteService {
    private readonly prisma;
    private readonly quoteExpiryQueue;
    private readonly logger;
    constructor(prisma: PrismaService, quoteExpiryQueue: Queue);
    createOrUpdateQuote(leadId: string, vendorId: string, dto: CreateQuoteDto): Promise<({
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
    }) | null>;
    submitQuote(quoteId: string, vendorId: string): Promise<{
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
    }>;
    acceptQuote(quoteId: string, customerId: string): Promise<{
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
    getQuotesForLead(leadId: string, customerId: string): Promise<({
        vendor: {
            businessName: string;
        };
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
    })[]>;
}
