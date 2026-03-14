"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiresConsent = exports.CONSENT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.CONSENT_KEY = 'requires_consent';
const RequiresConsent = (consentType, targetUserIdParam = 'userId') => (0, common_1.SetMetadata)(exports.CONSENT_KEY, {
    consentType,
    targetUserIdParam,
});
exports.RequiresConsent = RequiresConsent;
//# sourceMappingURL=requires-consent.decorator.js.map