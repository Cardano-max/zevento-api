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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const redis_service_1 = require("../redis/redis.service");
const OTP_TTL_SECONDS = 10 * 60;
const BYPASS_CODE = process.env.OTP_BYPASS_CODE ?? '999999';
let OtpService = class OtpService {
    constructor(redis) {
        this.redis = redis;
    }
    generateOtp() {
        if (process.env.OTP_BYPASS_CODE)
            return BYPASS_CODE;
        return crypto.randomInt(100000, 999999).toString();
    }
    hashOtp(otp) {
        return crypto.createHash('sha256').update(otp).digest('hex');
    }
    async storeOtp(phone, otp) {
        const hashed = this.hashOtp(otp);
        await this.redis.set(`otp:${phone}`, hashed, OTP_TTL_SECONDS);
    }
    async verifyOtp(phone, submittedOtp) {
        if (process.env.OTP_BYPASS_CODE && submittedOtp === BYPASS_CODE) {
            return true;
        }
        const stored = await this.redis.get(`otp:${phone}`);
        if (!stored)
            return false;
        const submittedHash = this.hashOtp(submittedOtp);
        if (stored === submittedHash) {
            await this.redis.del(`otp:${phone}`);
            return true;
        }
        const failedKey = `otp:failed:${phone}`;
        const count = await this.redis.incr(failedKey);
        if (count === 1)
            await this.redis.expire(failedKey, 3600);
        return false;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], OtpService);
//# sourceMappingURL=otp.service.js.map