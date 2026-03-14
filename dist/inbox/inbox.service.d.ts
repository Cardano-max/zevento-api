import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class InboxService {
    private readonly prisma;
    private readonly redis;
    private readonly logger;
    constructor(prisma: PrismaService, redis: RedisService);
    acceptLead(assignmentId: string, vendorId: string): Promise<{
        assignmentId: string;
        phone: string;
        leadId: string;
    }>;
    declineLead(assignmentId: string, vendorId: string, reason: string): Promise<{
        assignmentId: string;
        status: string;
    }>;
    getInbox(vendorId: string, page: number, limit: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
}
