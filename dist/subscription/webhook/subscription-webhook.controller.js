"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SubscriptionWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscription_webhook_service_1 = require("./subscription-webhook.service");
let SubscriptionWebhookController = SubscriptionWebhookController_1 = class SubscriptionWebhookController {
    constructor(webhookService) {
        this.webhookService = webhookService;
        this.logger = new common_1.Logger(SubscriptionWebhookController_1.name);
    }
    async handleSubscriptionWebhook(req, signature) {
        const rawBody = req.rawBody?.toString() ?? '';
        if (!rawBody) {
            this.logger.error('Empty webhook body received');
            return { status: 'error', message: 'Empty body' };
        }
        try {
            await this.webhookService.handleWebhook(rawBody, signature ?? '');
            return { status: 'ok' };
        }
        catch (error) {
            if (error?.status === 401) {
                throw error;
            }
            this.logger.error(`Webhook processing error: ${error.message}`);
            return { status: 'ok' };
        }
    }
};
exports.SubscriptionWebhookController = SubscriptionWebhookController;
__decorate([
    (0, common_1.Post)('subscription'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-razorpay-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SubscriptionWebhookController.prototype, "handleSubscriptionWebhook", null);
exports.SubscriptionWebhookController = SubscriptionWebhookController = SubscriptionWebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks/razorpay'),
    __metadata("design:paramtypes", [subscription_webhook_service_1.SubscriptionWebhookService])
], SubscriptionWebhookController);
//# sourceMappingURL=subscription-webhook.controller.js.map