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
var PaymentWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_webhook_service_1 = require("./payment-webhook.service");
let PaymentWebhookController = PaymentWebhookController_1 = class PaymentWebhookController {
    constructor(paymentWebhookService) {
        this.paymentWebhookService = paymentWebhookService;
        this.logger = new common_1.Logger(PaymentWebhookController_1.name);
    }
    async handlePaymentWebhook(req, signature) {
        const rawBody = req.rawBody?.toString() ?? '';
        if (!rawBody) {
            this.logger.error('Empty payment webhook body received');
            return { status: 'error', message: 'Empty body' };
        }
        try {
            await this.paymentWebhookService.handleWebhook(rawBody, signature ?? '');
            return { status: 'ok' };
        }
        catch (error) {
            if (error?.status === 401) {
                throw error;
            }
            this.logger.error(`Payment webhook processing error: ${error.message}`);
            return { status: 'ok' };
        }
    }
};
exports.PaymentWebhookController = PaymentWebhookController;
__decorate([
    (0, common_1.Post)('payment'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-razorpay-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentWebhookController.prototype, "handlePaymentWebhook", null);
exports.PaymentWebhookController = PaymentWebhookController = PaymentWebhookController_1 = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks/razorpay'),
    __metadata("design:paramtypes", [payment_webhook_service_1.PaymentWebhookService])
], PaymentWebhookController);
//# sourceMappingURL=payment-webhook.controller.js.map