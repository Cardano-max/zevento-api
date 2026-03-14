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
var StockAlertProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockAlertProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../../prisma/prisma.service");
const notification_service_1 = require("../../notification/notification.service");
let StockAlertProcessor = StockAlertProcessor_1 = class StockAlertProcessor extends bullmq_1.WorkerHost {
    constructor(prisma, notificationService) {
        super();
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(StockAlertProcessor_1.name);
    }
    async process(job) {
        const { productId, currentStock } = job.data;
        this.logger.log(`Processing low-stock alert: productId=${productId}, currentStock=${currentStock}`);
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                vendorId: true,
                lowStockThreshold: true,
            },
        });
        if (!product) {
            this.logger.warn(`Product ${productId} not found — skipping alert`);
            return;
        }
        if (currentStock <= product.lowStockThreshold) {
            await this.notificationService.sendPushToVendor(product.vendorId, {
                leadId: product.id,
                eventType: `Low stock: ${product.name} (${currentStock} remaining)`,
                city: 'Inventory Alert',
            });
            this.logger.log(`Low-stock notification sent to vendor ${product.vendorId} for product ${product.name}`);
        }
    }
    onFailed(job, error) {
        this.logger.error(`Stock alert job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts?.attempts ?? '?'}): ${error.message}`, error.stack);
    }
};
exports.StockAlertProcessor = StockAlertProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], StockAlertProcessor.prototype, "onFailed", null);
exports.StockAlertProcessor = StockAlertProcessor = StockAlertProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('stock-alerts'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], StockAlertProcessor);
//# sourceMappingURL=stock-alert.processor.js.map