import { PrismaService } from '../prisma/prisma.service';
import { RazorpayService } from './razorpay.service';
export declare class SubscriptionService {
    private readonly prisma;
    private readonly razorpay;
    private readonly logger;
    constructor(prisma: PrismaService, razorpay: RazorpayService);
    getPlansForRole(vendorRole: string): Promise<{
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
    getAllPlans(): Promise<{
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
    initiateCheckout(vendorId: string, planId: string): Promise<{
        subscriptionId: string;
        shortUrl: string;
    }>;
    getMySubscription(vendorId: string): Promise<{
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
    cancelSubscription(vendorId: string): Promise<{
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
