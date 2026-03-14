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
exports.ConsentRequiredGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const requires_consent_decorator_1 = require("../decorators/requires-consent.decorator");
const consent_service_1 = require("../consent.service");
const audit_log_service_1 = require("../audit-log.service");
let ConsentRequiredGuard = class ConsentRequiredGuard {
    constructor(reflector, consentService, auditLogService) {
        this.reflector = reflector;
        this.consentService = consentService;
        this.auditLogService = auditLogService;
    }
    async canActivate(context) {
        const consentMeta = this.reflector.getAllAndOverride(requires_consent_decorator_1.CONSENT_KEY, [context.getHandler(), context.getClass()]);
        if (!consentMeta)
            return true;
        const request = context.switchToHttp().getRequest();
        const viewer = request.user;
        if (!viewer) {
            throw new common_1.ForbiddenException('Authentication required');
        }
        const viewerRole = viewer.activeRole ?? viewer.role ?? 'CUSTOMER';
        if (viewerRole === 'ADMIN')
            return true;
        const targetUserId = request.params?.[consentMeta.targetUserIdParam] ??
            request.query?.[consentMeta.targetUserIdParam];
        const ipAddress = request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            request.socket?.remoteAddress ||
            undefined;
        const hasConsent = await this.consentService.hasActiveConsent(targetUserId, consentMeta.consentType, viewer.id);
        await this.auditLogService.logContactReveal({
            viewerUserId: viewer.id,
            viewerRole,
            targetUserId: targetUserId ?? 'unknown',
            targetField: 'phone',
            accessGranted: hasConsent,
            ipAddress,
            timestamp: new Date(),
        });
        if (!hasConsent) {
            throw new common_1.ForbiddenException('Consent required to access this data. Please request consent first.');
        }
        return true;
    }
};
exports.ConsentRequiredGuard = ConsentRequiredGuard;
exports.ConsentRequiredGuard = ConsentRequiredGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        consent_service_1.ConsentService,
        audit_log_service_1.AuditLogService])
], ConsentRequiredGuard);
//# sourceMappingURL=consent-required.guard.js.map