import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { RazorpayService } from '../../subscription/razorpay.service';
export declare class PaymentWebhookService {
    private readonly prisma;
    private readonly razorpayService;
    private readonly paymentQueue;
    private readonly productOrderPaymentQueue;
    private readonly logger;
    constructor(prisma: PrismaService, razorpayService: RazorpayService, paymentQueue: Queue, productOrderPaymentQueue: Queue);
    handleWebhook(rawBody: string, signature: string): Promise<void>;
    private handlePaymentCaptured;
    private handlePaymentFailed;
    private handleRefundProcessed;
    private markWebhookProcessed;
}
