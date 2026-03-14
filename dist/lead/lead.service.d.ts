import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { LeadResponseDto } from './dto/lead-response.dto';
export declare class LeadService {
    private readonly prisma;
    private readonly routingQueue;
    private readonly logger;
    constructor(prisma: PrismaService, routingQueue: Queue);
    createInquiry(customerId: string, dto: CreateInquiryDto, ipAddress: string, userAgent: string): Promise<LeadResponseDto>;
    getMyInquiries(customerId: string, page: number, limit: number): Promise<{
        data: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
