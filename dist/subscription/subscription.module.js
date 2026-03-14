"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const vendor_module_1 = require("../vendor/vendor.module");
const razorpay_service_1 = require("./razorpay.service");
const subscription_controller_1 = require("./subscription.controller");
const subscription_service_1 = require("./subscription.service");
const subscription_webhook_controller_1 = require("./webhook/subscription-webhook.controller");
const subscription_webhook_service_1 = require("./webhook/subscription-webhook.service");
let SubscriptionModule = class SubscriptionModule {
};
exports.SubscriptionModule = SubscriptionModule;
exports.SubscriptionModule = SubscriptionModule = __decorate([
    (0, common_1.Module)({
        imports: [vendor_module_1.VendorModule],
        controllers: [subscription_controller_1.SubscriptionController, subscription_webhook_controller_1.SubscriptionWebhookController],
        providers: [
            razorpay_service_1.RazorpayService,
            subscription_service_1.SubscriptionService,
            subscription_webhook_service_1.SubscriptionWebhookService,
        ],
        exports: [subscription_service_1.SubscriptionService, razorpay_service_1.RazorpayService],
    })
], SubscriptionModule);
//# sourceMappingURL=subscription.module.js.map