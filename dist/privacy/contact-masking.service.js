"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMaskingService = void 0;
const common_1 = require("@nestjs/common");
let ContactMaskingService = class ContactMaskingService {
    maskPhone(phone) {
        if (!phone || phone.length < 4)
            return '****';
        return '****' + phone.slice(-4);
    }
    maskEmail(email) {
        if (!email || !email.includes('@'))
            return email;
        const [local, domain] = email.split('@');
        const prefix = local.length >= 2 ? local.slice(0, 2) : local;
        return `${prefix}****@${domain}`;
    }
    maskUserData(userData, fieldsToMask) {
        if (!userData || typeof userData !== 'object')
            return userData;
        const cloned = Array.isArray(userData)
            ? userData.map((item) => this.maskUserData(item, fieldsToMask))
            : { ...userData };
        if (Array.isArray(cloned))
            return cloned;
        for (const key of Object.keys(cloned)) {
            if (fieldsToMask.includes(key)) {
                if (key === 'phone' && typeof cloned[key] === 'string') {
                    cloned[key] = this.maskPhone(cloned[key]);
                }
                else if (key === 'email' && typeof cloned[key] === 'string') {
                    cloned[key] = this.maskEmail(cloned[key]);
                }
                else {
                    cloned[key] = '****';
                }
            }
            else if (cloned[key] && typeof cloned[key] === 'object') {
                cloned[key] = this.maskUserData(cloned[key], fieldsToMask);
            }
        }
        return cloned;
    }
    shouldMaskForRole(viewerRole, dataOwnerRole) {
        if (viewerRole === 'ADMIN')
            return false;
        if (dataOwnerRole === 'CUSTOMER' &&
            (viewerRole === 'PLANNER' || viewerRole === 'SUPPLIER')) {
            return true;
        }
        if ((dataOwnerRole === 'PLANNER' || dataOwnerRole === 'SUPPLIER') &&
            viewerRole !== 'ADMIN') {
            return true;
        }
        return false;
    }
};
exports.ContactMaskingService = ContactMaskingService;
exports.ContactMaskingService = ContactMaskingService = __decorate([
    (0, common_1.Injectable)()
], ContactMaskingService);
//# sourceMappingURL=contact-masking.service.js.map