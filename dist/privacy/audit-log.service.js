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
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditLogService = class AuditLogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logContactReveal(params) {
        await this.prisma.consentLog.create({
            data: {
                userId: params.viewerUserId,
                consentType: 'PHONE_REVEAL',
                status: params.accessGranted ? 'GRANTED' : 'REVOKED',
                ipAddress: params.ipAddress ?? null,
                metadata: {
                    auditEvent: 'contact_reveal',
                    viewerRole: params.viewerRole,
                    targetUserId: params.targetUserId,
                    targetField: params.targetField,
                    accessGranted: params.accessGranted,
                    timestamp: params.timestamp.toISOString(),
                },
            },
        });
    }
    async getAuditTrail(filters) {
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.consentType)
            where.consentType = filters.consentType;
        if (filters.dateFrom || filters.dateTo) {
            where.createdAt = {};
            if (filters.dateFrom)
                where.createdAt.gte = filters.dateFrom;
            if (filters.dateTo)
                where.createdAt.lte = filters.dateTo;
        }
        const skip = (filters.page - 1) * filters.limit;
        const [records, total] = await Promise.all([
            this.prisma.consentLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: filters.limit,
            }),
            this.prisma.consentLog.count({ where }),
        ]);
        const filtered = filters.targetUserId
            ? records.filter((r) => {
                const meta = r.metadata;
                return meta?.targetUserId === filters.targetUserId;
            })
            : records;
        return {
            data: filtered,
            total,
            page: filters.page,
            limit: filters.limit,
            pages: Math.ceil(total / filters.limit),
        };
    }
    async getRevealHistory(targetUserId) {
        const records = await this.prisma.consentLog.findMany({
            where: {
                consentType: 'PHONE_REVEAL',
            },
            orderBy: { createdAt: 'desc' },
        });
        return records.filter((r) => {
            const meta = r.metadata;
            return (meta?.targetUserId === targetUserId || meta?.auditEvent === 'contact_reveal'
                ? meta?.targetUserId === targetUserId
                : false);
        });
    }
    async exportAuditLog(filters, format) {
        const result = await this.getAuditTrail({
            ...filters,
            page: 1,
            limit: 10000,
        });
        return result.data;
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map