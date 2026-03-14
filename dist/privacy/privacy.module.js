"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../prisma/prisma.module");
const consent_service_1 = require("./consent.service");
const contact_masking_service_1 = require("./contact-masking.service");
const audit_log_service_1 = require("./audit-log.service");
const consent_controller_1 = require("./consent.controller");
const mask_phone_interceptor_1 = require("./interceptors/mask-phone.interceptor");
const consent_required_guard_1 = require("./guards/consent-required.guard");
let PrivacyModule = class PrivacyModule {
};
exports.PrivacyModule = PrivacyModule;
exports.PrivacyModule = PrivacyModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        providers: [
            consent_service_1.ConsentService,
            contact_masking_service_1.ContactMaskingService,
            audit_log_service_1.AuditLogService,
            consent_required_guard_1.ConsentRequiredGuard,
            mask_phone_interceptor_1.MaskPhoneInterceptor,
        ],
        controllers: [consent_controller_1.ConsentController],
        exports: [
            consent_service_1.ConsentService,
            contact_masking_service_1.ContactMaskingService,
            mask_phone_interceptor_1.MaskPhoneInterceptor,
            audit_log_service_1.AuditLogService,
            consent_required_guard_1.ConsentRequiredGuard,
        ],
    })
], PrivacyModule);
//# sourceMappingURL=privacy.module.js.map