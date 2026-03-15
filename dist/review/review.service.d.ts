import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RespondReviewDto } from './dto/respond-review.dto';
export declare class ReviewService {
    private readonly prisma;
    private readonly redis;
    private readonly logger;
    constructor(prisma: PrismaService, redis: RedisService);
    createReview(bookingId: string, customerId: string, dto: CreateReviewDto): Promise<{
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
    }>;
    respondToReview(reviewId: string, vendorId: string, dto: RespondReviewDto): Promise<{
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
                customerId: string;
                razorpayOrderId: string | null;
                quoteId: string;
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
            customerId: string;
            bookingId: string;
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
