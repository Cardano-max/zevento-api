import { RedisService } from '../redis/redis.service';
export declare class OtpService {
    private readonly redis;
    constructor(redis: RedisService);
    generateOtp(): string;
    private hashOtp;
    storeOtp(phone: string, otp: string): Promise<void>;
    verifyOtp(phone: string, submittedOtp: string): Promise<boolean>;
}
