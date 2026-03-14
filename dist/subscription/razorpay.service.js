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
var RazorpayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const razorpay_1 = require("razorpay");
let RazorpayService = RazorpayService_1 = class RazorpayService {
    constructor() {
        this.logger = new common_1.Logger(RazorpayService_1.name);
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        this.keySecret = keySecret ?? '';
        if (!keyId ||
            !keySecret ||
            process.env.NODE_ENV === 'development') {
            if (!keyId || !keySecret) {
                this.logger.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set. Running in dev mock mode.');
                this.devMode = true;
                this.instance = null;
            }
            else {
                this.devMode = false;
                this.instance = new razorpay_1.default({
                    key_id: keyId,
                    key_secret: keySecret,
                });
            }
        }
        else {
            this.devMode = false;
            this.instance = new razorpay_1.default({
                key_id: keyId,
                key_secret: keySecret,
            });
        }
    }
    async createPlan(params) {
        if (this.devMode) {
            this.logger.warn('Dev mode: returning mock plan');
            return {
                id: `plan_mock_${Date.now()}`,
                entity: 'plan',
                interval: params.interval,
                period: params.period,
                item: {
                    id: `item_mock_${Date.now()}`,
                    ...params.item,
                },
                created_at: Math.floor(Date.now() / 1000),
            };
        }
        return this.instance.plans.create({
            period: params.period,
            interval: params.interval,
            item: {
                name: params.item.name,
                amount: params.item.amount,
                currency: params.item.currency,
                description: params.item.description,
            },
        });
    }
    async createSubscription(params) {
        if (this.devMode) {
            this.logger.warn('Dev mode: returning mock subscription');
            const mockId = `sub_mock_${Date.now()}`;
            return {
                id: mockId,
                entity: 'subscription',
                plan_id: params.plan_id,
                status: 'created',
                short_url: `https://rzp.io/mock/${mockId}`,
                current_start: null,
                current_end: null,
                total_count: params.total_count,
                paid_count: 0,
                remaining_count: String(params.total_count),
                customer_notify: params.customer_notify ?? 1,
                created_at: Math.floor(Date.now() / 1000),
                charge_at: Math.floor(Date.now() / 1000),
                start_at: Math.floor(Date.now() / 1000),
                end_at: 0,
                auth_attempts: 0,
                has_scheduled_changes: false,
                source: 'api',
                customer_id: null,
                payment_method: null,
            };
        }
        return this.instance.subscriptions.create({
            plan_id: params.plan_id,
            total_count: params.total_count,
            customer_notify: params.customer_notify,
            notes: params.notes,
        });
    }
    async cancelSubscription(subscriptionId, cancelAtCycleEnd) {
        if (this.devMode) {
            this.logger.warn('Dev mode: mock cancel subscription');
            return { id: subscriptionId, status: 'cancelled' };
        }
        return this.instance.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
    }
    async fetchSubscription(subscriptionId) {
        if (this.devMode) {
            this.logger.warn('Dev mode: mock fetch subscription');
            return {
                id: subscriptionId,
                entity: 'subscription',
                status: 'active',
            };
        }
        return this.instance.subscriptions.fetch(subscriptionId);
    }
    async createOrder(params) {
        if (this.devMode) {
            this.logger.warn('Dev mode: returning mock order');
            return {
                id: `order_mock_${Date.now()}`,
                entity: 'order',
                amount: params.amount,
                currency: params.currency,
                receipt: params.receipt,
                status: 'created',
            };
        }
        return this.instance.orders.create({
            amount: params.amount,
            currency: params.currency,
            receipt: params.receipt,
            notes: params.notes,
        });
    }
    validatePaymentSignature(orderId, paymentId, signature) {
        if (this.devMode) {
            this.logger.warn('Dev mode: skipping payment signature verification');
            return true;
        }
        const expectedSignature = crypto
            .createHmac('sha256', this.keySecret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');
        return expectedSignature === signature;
    }
    async createRefund(paymentId, params) {
        if (this.devMode) {
            this.logger.warn('Dev mode: returning mock refund');
            return {
                id: `rfnd_mock_${Date.now()}`,
                payment_id: paymentId,
                amount: params.amount,
                status: 'processed',
            };
        }
        return this.instance.payments.refund(paymentId, params);
    }
    validateWebhookSignature(body, signature, secret) {
        if (this.devMode) {
            this.logger.warn('Dev mode: skipping webhook signature verification');
            return true;
        }
        try {
            razorpay_1.default.validateWebhookSignature(body, signature, secret);
            return true;
        }
        catch {
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(body)
                .digest('hex');
            return expectedSignature === signature;
        }
    }
};
exports.RazorpayService = RazorpayService;
exports.RazorpayService = RazorpayService = RazorpayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RazorpayService);
//# sourceMappingURL=razorpay.service.js.map