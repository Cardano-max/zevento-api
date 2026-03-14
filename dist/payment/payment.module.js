"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const subscription_module_1 = require("../subscription/subscription.module");
const commission_service_1 = require("./commission.service");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
const payment_webhook_controller_1 = require("./webhook/payment-webhook.controller");
const payment_webhook_service_1 = require("./webhook/payment-webhook.service");
const payment_processor_1 = require("./processor/payment.processor");
const payout_processor_1 = require("./processor/payout.processor");
const payout_service_1 = require("./payout.service");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            subscription_module_1.SubscriptionModule,
            bullmq_1.BullModule.registerQueue({ name: 'payment-processing' }, { name: 'vendor-payout' }, { name: 'product-order-payment' }),
        ],
        controllers: [payment_controller_1.PaymentController, payment_webhook_controller_1.PaymentWebhookController],
        providers: [
            commission_service_1.CommissionService,
            payment_service_1.PaymentService,
            payment_webhook_service_1.PaymentWebhookService,
            payment_processor_1.PaymentProcessor,
            payout_processor_1.PayoutProcessor,
            payout_service_1.PayoutService,
        ],
        exports: [payment_service_1.PaymentService, commission_service_1.CommissionService, payout_service_1.PayoutService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map