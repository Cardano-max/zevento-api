import { PrismaService } from '../../prisma/prisma.service';
import { RazorpayService } from '../razorpay.service';
export declare class SubscriptionWebhookService {
    private readonly prisma;
    private readonly razorpay;
    private readonly logger;
    constructor(prisma: PrismaService, razorpay: RazorpayService);
    handleWebhook(rawBody: string, signature: string): Promise<void>;
    private processEvent;
    private updateSubscriptionStatus;
}
