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
exports.RateLimitService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../redis/redis.service");
const RATE_LIMIT_WINDOW_SECONDS = 3600;
const MAX_SEND_ATTEMPTS = 5;
const MAX_VERIFY_ATTEMPTS = 5;
let RateLimitService = class RateLimitService {
    constructor(redis) {
        this.redis = redis;
    }
    async checkSendLimit(phone) {
        const key = `ratelimit:send:${phone}`;
        const current = await this.redis.get(key);
        const count = current ? parseInt(current, 10) : 0;
        if (count >= MAX_SEND_ATTEMPTS) {
            const retryAfter = await this.redis.ttl(key);
            return {
                allowed: false,
                remainingAttempts: 0,
                retryAfterSeconds: retryAfter > 0 ? retryAfter : RATE_LIMIT_WINDOW_SECONDS,
            };
        }
        const newCount = await this.redis.incr(key);
        if (newCount === 1) {
            await this.redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
        }
        return {
            allowed: true,
            remainingAttempts: MAX_SEND_ATTEMPTS - newCount,
            retryAfterSeconds: 0,
        };
    }
    async checkVerifyLimit(phone) {
        const key = `ratelimit:verify:${phone}`;
        const current = await this.redis.get(key);
        const count = current ? parseInt(current, 10) : 0;
        if (count >= MAX_VERIFY_ATTEMPTS) {
            const retryAfter = await this.redis.ttl(key);
            return {
                allowed: false,
                remainingAttempts: 0,
                retryAfterSeconds: retryAfter > 0 ? retryAfter : RATE_LIMIT_WINDOW_SECONDS,
            };
        }
        const newCount = await this.redis.incr(key);
        if (newCount === 1) {
            await this.redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
        }
        return {
            allowed: true,
            remainingAttempts: MAX_VERIFY_ATTEMPTS - newCount,
            retryAfterSeconds: 0,
        };
    }
    async resetOnSuccess(phone) {
        await this.redis.del(`ratelimit:verify:${phone}`);
    }
};
exports.RateLimitService = RateLimitService;
exports.RateLimitService = RateLimitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], RateLimitService);
//# sourceMappingURL=rate-limit.service.js.map