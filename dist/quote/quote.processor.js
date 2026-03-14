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
var QuoteExpiryProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteExpiryProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuoteExpiryProcessor = QuoteExpiryProcessor_1 = class QuoteExpiryProcessor extends bullmq_1.WorkerHost {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.logger = new common_1.Logger(QuoteExpiryProcessor_1.name);
    }
    async process(job) {
        const { quoteId } = job.data;
        const result = await this.prisma.quote.updateMany({
            where: { id: quoteId, status: 'SUBMITTED' },
            data: { status: 'EXPIRED' },
        });
        if (result.count > 0) {
            this.logger.log(`Quote ${quoteId} expired`);
        }
        else {
            this.logger.debug(`Quote ${quoteId} expiry job fired but quote was not in SUBMITTED state — no-op`);
        }
    }
};
exports.QuoteExpiryProcessor = QuoteExpiryProcessor;
exports.QuoteExpiryProcessor = QuoteExpiryProcessor = QuoteExpiryProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('quote-expiry'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuoteExpiryProcessor);
//# sourceMappingURL=quote.processor.js.map