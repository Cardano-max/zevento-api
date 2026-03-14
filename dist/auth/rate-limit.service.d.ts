import { RedisService } from '../redis/redis.service';
export interface RateLimitResult {
    allowed: boolean;
    remainingAttempts: number;
    retryAfterSeconds: number;
}
export declare class RateLimitService {
    private readonly redis;
    constructor(redis: RedisService);
    checkSendLimit(phone: string): Promise<RateLimitResult>;
    checkVerifyLimit(phone: string): Promise<RateLimitResult>;
    resetOnSuccess(phone: string): Promise<void>;
}
