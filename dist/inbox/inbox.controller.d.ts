import { DeclineLeadDto } from './dto/decline-lead.dto';
import { InboxService } from './inbox.service';
export declare class InboxController {
    private readonly inboxService;
    constructor(inboxService: InboxService);
    getInbox(req: any, page: number, limit: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    acceptLead(assignmentId: string, req: any): Promise<{
        assignmentId: string;
        phone: string;
        leadId: string;
    }>;
    declineLead(assignmentId: string, req: any, dto: DeclineLeadDto): Promise<{
        assignmentId: string;
        status: string;
    }>;
}
