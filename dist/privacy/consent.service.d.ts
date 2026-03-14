import { PrismaService } from '../prisma/prisma.service';
import { ConsentRecord, ConsentCheckResult } from '@zevento/shared';
export declare class ConsentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    grantConsent(params: {
        userId: string;
        consentType: string;
        targetUserId?: string;
        ipAddress?: string;
        userAgent?: string;
        metadata?: Record<string, any>;
    }): Promise<ConsentRecord>;
    revokeConsent(params: {
        userId: string;
        consentType: string;
        targetUserId?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<ConsentRecord>;
    hasActiveConsent(userId: string, consentType: string, targetUserId?: string): Promise<boolean>;
    getConsentHistory(userId: string, consentType?: string): Promise<ConsentRecord[]>;
    hasPhoneRevealConsent(customerId: string, vendorId: string): Promise<ConsentCheckResult>;
}
