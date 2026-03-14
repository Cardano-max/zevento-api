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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const consent_service_1 = require("./consent.service");
const audit_log_service_1 = require("./audit-log.service");
const grant_consent_dto_1 = require("./dto/grant-consent.dto");
const revoke_consent_dto_1 = require("./dto/revoke-consent.dto");
let ConsentController = class ConsentController {
    constructor(consentService, auditLogService) {
        this.consentService = consentService;
        this.auditLogService = auditLogService;
    }
    async grantConsent(dto, req) {
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            req.socket?.remoteAddress ||
            undefined;
        const userAgent = req.headers['user-agent'] ?? undefined;
        return this.consentService.grantConsent({
            userId: req.user.id,
            consentType: dto.consentType,
            targetUserId: dto.targetUserId,
            ipAddress,
            userAgent,
            metadata: dto.metadata,
        });
    }
    async revokeConsent(dto, req) {
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            req.socket?.remoteAddress ||
            undefined;
        const userAgent = req.headers['user-agent'] ?? undefined;
        return this.consentService.revokeConsent({
            userId: req.user.id,
            consentType: dto.consentType,
            targetUserId: dto.targetUserId,
            ipAddress,
            userAgent,
        });
    }
    async checkConsentStatus(type, targetUserId, req) {
        const hasConsent = await this.consentService.hasActiveConsent(req.user.id, type, targetUserId);
        if (!hasConsent) {
            return { hasConsent: false };
        }
        const history = await this.consentService.getConsentHistory(req.user.id, type);
        const granted = history.find((r) => r.status === 'GRANTED' &&
            (!targetUserId || r.metadata?.targetUserId === targetUserId));
        return {
            hasConsent: true,
            grantedAt: granted?.createdAt,
        };
    }
    async getConsentHistory(type, req) {
        return this.consentService.getConsentHistory(req.user.id, type);
    }
    async getAuditTrail(userId, targetUserId, consentType, dateFrom, dateTo, page, limit) {
        return this.auditLogService.getAuditTrail({
            userId,
            targetUserId,
            consentType,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }
    async getAuditTrailForUser(userId) {
        return this.auditLogService.getAuditTrail({
            userId,
            page: 1,
            limit: 100,
        });
    }
    async getRevealAuditTrail() {
        return this.auditLogService.getAuditTrail({
            consentType: 'PHONE_REVEAL',
            page: 1,
            limit: 100,
        });
    }
};
exports.ConsentController = ConsentController;
__decorate([
    (0, common_2.Post)('consent'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grant_consent_dto_1.GrantConsentDto, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "grantConsent", null);
__decorate([
    (0, common_1.Delete)('consent'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [revoke_consent_dto_1.RevokeConsentDto, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "revokeConsent", null);
__decorate([
    (0, common_1.Get)('consent/status'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('targetUserId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "checkConsentStatus", null);
__decorate([
    (0, common_1.Get)('consent/history'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getConsentHistory", null);
__decorate([
    (0, common_1.Get)('audit-trail'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('targetUserId')),
    __param(2, (0, common_1.Query)('consentType')),
    __param(3, (0, common_1.Query)('dateFrom')),
    __param(4, (0, common_1.Query)('dateTo')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getAuditTrail", null);
__decorate([
    (0, common_1.Get)('audit-trail/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getAuditTrailForUser", null);
__decorate([
    (0, common_1.Get)('audit-trail/reveals'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getRevealAuditTrail", null);
exports.ConsentController = ConsentController = __decorate([
    (0, swagger_1.ApiTags)('Privacy'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('privacy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [consent_service_1.ConsentService,
        audit_log_service_1.AuditLogService])
], ConsentController);
//# sourceMappingURL=consent.controller.js.map