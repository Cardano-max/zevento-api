import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logContactReveal(params: {
        viewerUserId: string;
        viewerRole: string;
        targetUserId: string;
        targetField: string;
        accessGranted: boolean;
        ipAddress?: string;
        timestamp: Date;
    }): Promise<void>;
    getAuditTrail(filters: {
        userId?: string;
        targetUserId?: string;
        consentType?: string;
        dateFrom?: Date;
        dateTo?: Date;
        page: number;
        limit: number;
    }): Promise<{
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
    getRevealHistory(targetUserId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: string;
        consentType: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    exportAuditLog(filters: {
        userId?: string;
        targetUserId?: string;
        consentType?: string;
        dateFrom?: Date;
        dateTo?: Date;
    }, format: 'json'): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: string;
        consentType: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
}
