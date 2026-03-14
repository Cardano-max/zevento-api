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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const admin_module_1 = require("./admin/admin.module");
const auth_module_1 = require("./auth/auth.module");
const booking_module_1 = require("./booking/booking.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const customer_module_1 = require("./customer/customer.module");
const inbox_module_1 = require("./inbox/inbox.module");
const lead_module_1 = require("./lead/lead.module");
const quote_module_1 = require("./quote/quote.module");
const notification_module_1 = require("./notification/notification.module");
const order_module_1 = require("./order/order.module");
const payment_module_1 = require("./payment/payment.module");
const product_module_1 = require("./product/product.module");
const prisma_module_1 = require("./prisma/prisma.module");
const privacy_module_1 = require("./privacy/privacy.module");
const redis_module_1 = require("./redis/redis.module");
const review_module_1 = require("./review/review.module");
const routing_module_1 = require("./routing/routing.module");
const subscription_module_1 = require("./subscription/subscription.module");
const vendor_module_1 = require("./vendor/vendor.module");
let AppController = class AppController {
    healthCheck() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'zevento-api',
            version: '0.0.0',
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "healthCheck", null);
AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
function parseBullRedisConnection() {
    const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
    try {
        const url = new URL(redisUrl);
        return {
            host: url.hostname || 'localhost',
            port: parseInt(url.port || '6379', 10),
        };
    }
    catch {
        return { host: 'localhost', port: 6379 };
    }
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            bullmq_1.BullModule.forRoot({
                connection: parseBullRedisConnection(),
            }),
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
            privacy_module_1.PrivacyModule,
            cloudinary_module_1.CloudinaryModule,
            vendor_module_1.VendorModule,
            subscription_module_1.SubscriptionModule,
            customer_module_1.CustomerModule,
            lead_module_1.LeadModule,
            notification_module_1.NotificationModule,
            routing_module_1.RoutingModule,
            inbox_module_1.InboxModule,
            quote_module_1.QuoteModule,
            booking_module_1.BookingModule,
            review_module_1.ReviewModule,
            payment_module_1.PaymentModule,
            product_module_1.ProductModule,
            order_module_1.OrderModule,
        ],
        controllers: [AppController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map