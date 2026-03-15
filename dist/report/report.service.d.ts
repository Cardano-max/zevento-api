import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, ReviewReportDto } from './dto/create-report.dto';
export declare class ReportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createReport(reporterId: string, dto: CreateReportDto): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        reason: string;
        targetType: string;
        targetId: string;
    }>;
    listReports(status?: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            description: string | null;
            status: string;
            reason: string;
            targetType: string;
            targetId: string;
            adminNote: string | null;
            reviewedBy: string | null;
            reviewedAt: Date | null;
            reporter: {
                phone: string;
                id: string;
                name: string | null;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    reviewReport(id: string, adminId: string, dto: ReviewReportDto): Promise<{
        id: string;
        status: string;
        adminNote: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
}
