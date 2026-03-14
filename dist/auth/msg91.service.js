"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Msg91Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Msg91Service = void 0;
const common_1 = require("@nestjs/common");
let Msg91Service = Msg91Service_1 = class Msg91Service {
    constructor() {
        this.logger = new common_1.Logger(Msg91Service_1.name);
    }
    async sendOtp(phone, otp) {
        if (process.env.NODE_ENV === 'development' || process.env.OTP_TEST_MODE === 'true') {
            this.logger.log(`[TEST MODE] OTP for ${phone}: ${otp}`);
            return;
        }
        const authKey = process.env.MSG91_AUTH_KEY;
        const templateId = process.env.MSG91_TEMPLATE_ID;
        if (!authKey || !templateId) {
            this.logger.warn('MSG91 credentials not configured — OTP not sent via SMS');
            return;
        }
        try {
            const response = await fetch('https://control.msg91.com/api/v5/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', authkey: authKey },
                body: JSON.stringify({ mobile: phone, template_id: templateId, otp }),
            });
            if (!response.ok) {
                const text = await response.text();
                this.logger.error(`MSG91 API error: ${response.status} ${text}`);
            }
        }
        catch (err) {
            this.logger.error(`MSG91 request failed: ${err.message}`);
        }
    }
};
exports.Msg91Service = Msg91Service;
exports.Msg91Service = Msg91Service = Msg91Service_1 = __decorate([
    (0, common_1.Injectable)()
], Msg91Service);
//# sourceMappingURL=msg91.service.js.map