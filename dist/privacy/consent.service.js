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
exports.ConsentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ConsentService = class ConsentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async grantConsent(params) {
        const metadataPayload = { ...(params.metadata ?? {}) };
        if (params.targetUserId) {
            metadataPayload.targetUserId = params.targetUserId;
        }
        const record = await this.prisma.consentLog.create({
            data: {
                userId: params.userId,
                consentType: params.consentType,
                status: 'GRANTED',
                ipAddress: params.ipAddress ?? null,
                userAgent: params.userAgent ?? null,
                metadata: Object.keys(metadataPayload).length > 0 ? metadataPayload : undefined,
            },
        });
        return {
            id: record.id,
            userId: record.userId,
            consentType: record.consentType,
            status: record.status,
            ipAddress: record.ipAddress ?? undefined,
            userAgent: record.userAgent ?? undefined,
            metadata: record.metadata ?? undefined,
            createdAt: record.createdAt,
        };
    }
    async revokeConsent(params) {
        const metadataPayload = {};
        if (params.targetUserId) {
            metadataPayload.targetUserId = params.targetUserId;
        }
        const record = await this.prisma.consentLog.create({
            data: {
                userId: params.userId,
                consentType: params.consentType,
                status: 'REVOKED',
                ipAddress: params.ipAddress ?? null,
                userAgent: params.userAgent ?? null,
                metadata: Object.keys(metadataPayload).length > 0 ? metadataPayload : undefined,
            },
        });
        return {
            id: record.id,
            userId: record.userId,
            consentType: record.consentType,
            status: record.status,
            ipAddress: record.ipAddress ?? undefined,
            userAgent: record.userAgent ?? undefined,
            metadata: record.metadata ?? undefined,
            createdAt: record.createdAt,
        };
    }
    async hasActiveConsent(userId, consentType, targetUserId) {
        const records = await this.prisma.consentLog.findMany({
            where: {
                userId,
                consentType,
            },
            orderBy: { createdAt: 'desc' },
        });
        const filtered = targetUserId
            ? records.filter((r) => {
                const meta = r.metadata;
                return meta?.targetUserId === targetUserId;
            })
            : records;
        if (filtered.length === 0)
            return false;
        return filtered[0].status === 'GRANTED';
    }
    async getConsentHistory(userId, consentType) {
        const records = await this.prisma.consentLog.findMany({
            where: {
                userId,
                ...(consentType ? { consentType } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
        return records.map((r) => ({
            id: r.id,
            userId: r.userId,
            consentType: r.consentType,
            status: r.status,
            ipAddress: r.ipAddress ?? undefined,
            userAgent: r.userAgent ?? undefined,
            metadata: r.metadata ?? undefined,
            createdAt: r.createdAt,
        }));
    }
    async hasPhoneRevealConsent(customerId, vendorId) {
        const hasConsent = await this.hasActiveConsent(customerId, 'PHONE_REVEAL', vendorId);
        if (!hasConsent) {
            return { hasConsent: false, consentType: 'PHONE_REVEAL' };
        }
        const records = await this.prisma.consentLog.findMany({
            where: {
                userId: customerId,
                consentType: 'PHONE_REVEAL',
                status: 'GRANTED',
            },
            orderBy: { createdAt: 'desc' },
        });
        const match = records.find((r) => {
            const meta = r.metadata;
            return meta?.targetUserId === vendorId;
        });
        return {
            hasConsent: true,
            grantedAt: match?.createdAt,
            consentType: 'PHONE_REVEAL',
        };
    }
};
exports.ConsentService = ConsentService;
exports.ConsentService = ConsentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsentService);
//# sourceMappingURL=consent.service.js.map