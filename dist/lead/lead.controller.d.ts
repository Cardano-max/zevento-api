import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { LeadService } from './lead.service';
export declare class LeadController {
    private readonly leadService;
    constructor(leadService: LeadService);
    createInquiry(user: any, dto: CreateInquiryDto, req: any): Promise<import("./dto/lead-response.dto").LeadResponseDto>;
    getMyInquiries(user: any, page: number, limit: number): Promise<{
        data: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
