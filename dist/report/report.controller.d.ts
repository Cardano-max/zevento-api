import { CreateReportDto, ReviewReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    createReport(user: {
        id: string;
    }, dto: CreateReportDto): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        reason: string;
        targetType: string;
        targetId: string;
    }>;
    listReports(status?: string, page?: string, limit?: string): Promise<{
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
    reviewReport(id: string, admin: {
        id: string;
    }, dto: ReviewReportDto): Promise<{
        id: string;
        status: string;
        adminNote: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
}
