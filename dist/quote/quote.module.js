"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const quote_controller_1 = require("./quote.controller");
const quote_processor_1 = require("./quote.processor");
const quote_service_1 = require("./quote.service");
let QuoteModule = class QuoteModule {
};
exports.QuoteModule = QuoteModule;
exports.QuoteModule = QuoteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            bullmq_1.BullModule.registerQueue({ name: 'quote-expiry' }),
        ],
        providers: [quote_service_1.QuoteService, quote_processor_1.QuoteExpiryProcessor],
        controllers: [quote_controller_1.QuoteController],
        exports: [quote_service_1.QuoteService],
    })
], QuoteModule);
//# sourceMappingURL=quote.module.js.map