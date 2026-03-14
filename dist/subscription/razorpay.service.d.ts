export declare class RazorpayService {
    private readonly logger;
    private readonly instance;
    private readonly keySecret;
    readonly devMode: boolean;
    constructor();
    createPlan(params: {
        period: 'daily' | 'weekly' | 'monthly' | 'yearly';
        interval: number;
        item: {
            name: string;
            amount: number;
            currency: string;
            description: string;
        };
    }): Promise<import("razorpay/dist/types/plans").Plans.RazorPayPlans | {
        id: string;
        entity: string;
        interval: number;
        period: "daily" | "weekly" | "monthly" | "yearly";
        item: {
            name: string;
            amount: number;
            currency: string;
            description: string;
            id: string;
        };
        created_at: number;
    }>;
    createSubscription(params: {
        plan_id: string;
        total_count: number;
        customer_notify?: 0 | 1;
        notes?: Record<string, string>;
    }): Promise<import("razorpay/dist/types/subscriptions").Subscriptions.RazorpaySubscription>;
    cancelSubscription(subscriptionId: string, cancelAtCycleEnd: boolean): Promise<import("razorpay/dist/types/subscriptions").Subscriptions.RazorpaySubscription | {
        id: string;
        status: "cancelled";
    }>;
    fetchSubscription(subscriptionId: string): Promise<import("razorpay/dist/types/subscriptions").Subscriptions.RazorpaySubscription | {
        id: string;
        entity: string;
        status: "active";
    }>;
    createOrder(params: {
        amount: number;
        currency: string;
        receipt: string;
        notes?: Record<string, string>;
    }): Promise<import("razorpay/dist/types/orders").Orders.RazorpayOrder | {
        id: string;
        entity: "order";
        amount: number;
        currency: string;
        receipt: string;
        status: "created";
    }>;
    validatePaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
    createRefund(paymentId: string, params: {
        amount?: number;
        notes?: Record<string, string>;
    }): Promise<import("razorpay/dist/types/refunds").Refunds.RazorpayRefund | {
        id: string;
        payment_id: string;
        amount: number | undefined;
        status: "processed";
    }>;
    validateWebhookSignature(body: string, signature: string, secret: string): boolean;
}
