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
var CommissionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommissionService = CommissionService_1 = class CommissionService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CommissionService_1.name);
    }
    async getRate(vendorId, categoryId) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            select: { role: true },
        });
        const vendorRole = vendor?.role ?? null;
        const now = new Date();
        const orConditions = [];
        if (categoryId && vendorRole) {
            orConditions.push({ categoryId, vendorRole });
        }
        if (categoryId) {
            orConditions.push({ categoryId, vendorRole: null });
        }
        if (vendorRole) {
            orConditions.push({ categoryId: null, vendorRole });
        }
        orConditions.push({ categoryId: null, vendorRole: null });
        const rate = await this.prisma.commissionRate.findFirst({
            where: {
                effectiveFrom: { lte: now },
                OR: [{ effectiveTo: null }, { effectiveTo: { gte: now } }],
                AND: {
                    OR: orConditions,
                },
            },
            orderBy: [
                { categoryId: { sort: 'desc', nulls: 'last' } },
                { vendorRole: { sort: 'desc', nulls: 'last' } },
            ],
        });
        if (!rate) {
            this.logger.error(`No commission rate found for vendorId=${vendorId}, categoryId=${categoryId}, vendorRole=${vendorRole}`);
            throw new common_1.InternalServerErrorException('No commission rate configured');
        }
        this.logger.debug(`Commission rate for vendorId=${vendorId}: ${rate.rateBps} bps (rateId=${rate.id})`);
        return rate.rateBps;
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = CommissionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommissionService);
//# sourceMappingURL=commission.service.js.map