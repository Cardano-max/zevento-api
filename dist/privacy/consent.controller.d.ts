import { Request } from 'express';
import { ConsentService } from './consent.service';
import { AuditLogService } from './audit-log.service';
import { GrantConsentDto } from './dto/grant-consent.dto';
import { RevokeConsentDto } from './dto/revoke-consent.dto';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        activeRole?: string;
        role?: string;
    };
}
export declare class ConsentController {
    private readonly consentService;
    private readonly auditLogService;
    constructor(consentService: ConsentService, auditLogService: AuditLogService);
    grantConsent(dto: GrantConsentDto, req: AuthenticatedRequest): Promise<import("@zevento/shared").ConsentRecord>;
    revokeConsent(dto: RevokeConsentDto, req: AuthenticatedRequest): Promise<import("@zevento/shared").ConsentRecord>;
    checkConsentStatus(type: string, targetUserId: string, req: AuthenticatedRequest): Promise<{
        hasConsent: boolean;
        grantedAt?: undefined;
    } | {
        hasConsent: boolean;
        grantedAt: Date | undefined;
    }>;
    getConsentHistory(type: string, req: AuthenticatedRequest): Promise<import("@zevento/shared").ConsentRecord[]>;
    getAuditTrail(userId?: string, targetUserId?: string, consentType?: string, dateFrom?: string, dateTo?: string, page?: string, limit?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            status: string;
            consentType: string;
            ipAddress: string | null;
            userAgent: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getAuditTrailForUser(userId: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            status: string;
            consentType: string;
            ipAddress: string | null;
            userAgent: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getRevealAuditTrail(): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            status: string;
            consentType: string;
            ipAddress: string | null;
            userAgent: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
}
export {};
