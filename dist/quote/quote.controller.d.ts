import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteService } from './quote.service';
export declare class QuoteController {
    private readonly quoteService;
    constructor(quoteService: QuoteService);
    createOrUpdateQuote(leadId: string, req: any, dto: CreateQuoteDto): Promise<({
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
    submitQuote(quoteId: string, req: any): Promise<{
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
    getQuotesForLead(leadId: string, req: any): Promise<({
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
    acceptQuote(quoteId: string, req: any): Promise<{
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
}
