import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CheckoutDto } from './dto/checkout.dto';
import { SubscriptionService } from './subscription.service';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getPlans(user: JwtPayload): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        vendorRole: string;
        tier: string;
        amountPaise: number;
        periodMonths: number;
        razorpayPlanId: string | null;
        features: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    checkout(req: any, dto: CheckoutDto): Promise<{
        subscriptionId: string;
        shortUrl: string;
    }>;
    getMySubscription(req: any): Promise<{
        plan: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            vendorRole: string;
            tier: string;
            amountPaise: number;
            periodMonths: number;
            razorpayPlanId: string | null;
            features: import("@prisma/client/runtime/library").JsonValue | null;
        };
        transactions: {
            type: string;
            id: string;
            createdAt: Date;
            status: string;
            amountPaise: number;
            vendorSubscriptionId: string | null;
            bookingId: string | null;
            commissionPaise: number | null;
            netPayoutPaise: number | null;
            razorpayPaymentId: string | null;
            razorpayOrderId: string | null;
            razorpayPayoutId: string | null;
            payoutStatus: string | null;
            paidAt: Date | null;
            productOrderId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        planId: string;
        razorpaySubscriptionId: string | null;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
    }>;
    cancelSubscription(req: any): Promise<{
        plan: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            vendorRole: string;
            tier: string;
            amountPaise: number;
            periodMonths: number;
            razorpayPlanId: string | null;
            features: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        planId: string;
        razorpaySubscriptionId: string | null;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
    }>;
}
