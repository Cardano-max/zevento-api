import { PaymentWebhookService } from './payment-webhook.service';
export declare class PaymentWebhookController {
    private readonly paymentWebhookService;
    private readonly logger;
    constructor(paymentWebhookService: PaymentWebhookService);
    handlePaymentWebhook(req: any, signature: string): Promise<{
        status: string;
        message: string;
    } | {
        status: string;
        message?: undefined;
    }>;
}
