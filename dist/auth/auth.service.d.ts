import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Msg91Service } from './msg91.service';
import { OtpService } from './otp.service';
import { RateLimitService } from './rate-limit.service';
export declare class AuthService {
    private readonly otp;
    private readonly msg91;
    private readonly rateLimit;
    private readonly prisma;
    private readonly jwt;
    private readonly logger;
    constructor(otp: OtpService, msg91: Msg91Service, rateLimit: RateLimitService, prisma: PrismaService, jwt: JwtService);
    sendOtp(phone: string): Promise<{
        message: string;
        phone: string;
    }>;
    verifyOtp(phone: string, submittedOtp: string, requestedRole?: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            phone: string;
            name: string | null;
            roles: Array<{
                id: string;
                role: string;
                isActive: boolean;
            }>;
            activeRole: string;
        };
    }>;
}
