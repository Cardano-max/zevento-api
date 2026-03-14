"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const notification_module_1 = require("../notification/notification.module");
const vendor_module_1 = require("../vendor/vendor.module");
const product_controller_1 = require("./product.controller");
const catalog_controller_1 = require("./catalog.controller");
const product_service_1 = require("./product.service");
const catalog_service_1 = require("./catalog.service");
const stock_alert_processor_1 = require("./processor/stock-alert.processor");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({ name: 'stock-alerts' }),
            notification_module_1.NotificationModule,
            vendor_module_1.VendorModule,
        ],
        controllers: [product_controller_1.ProductController, catalog_controller_1.CatalogController],
        providers: [product_service_1.ProductService, catalog_service_1.CatalogService, stock_alert_processor_1.StockAlertProcessor],
        exports: [product_service_1.ProductService],
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map