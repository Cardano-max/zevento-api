import { SubscriptionWebhookService } from './subscription-webhook.service';
export declare class SubscriptionWebhookController {
    private readonly webhookService;
    private readonly logger;
    constructor(webhookService: SubscriptionWebhookService);
    handleSubscriptionWebhook(req: any, signature: string): Promise<{
        status: string;
        message: string;
    } | {
        status: string;
        message?: undefined;
    }>;
}
