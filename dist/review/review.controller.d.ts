import { CreateReviewDto } from './dto/create-review.dto';
import { RespondReviewDto } from './dto/respond-review.dto';
import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(bookingId: string, req: any, dto: CreateReviewDto): Promise<{
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
    }>;
    respondToReview(reviewId: string, req: any, dto: RespondReviewDto): Promise<{
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
    }>;
    getVendorReviews(vendorId: string, page: number, limit: number): Promise<{
        data: ({
            booking: {
                lead: {
                    eventType: string;
                };
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
            };
            customer: {
                id: string;
                name: string | null;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
}
