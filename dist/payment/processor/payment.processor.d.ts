import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CommissionService } from '../commission.service';
export declare class PaymentProcessor extends WorkerHost {
    private readonly prisma;
    private readonly commissionService;
    private readonly logger;
    constructor(prisma: PrismaService, commissionService: CommissionService);
    process(job: Job<{
        webhookEventId: string;
        paymentEntity: any;
        orderNotes: Record<string, any>;
    }>): Promise<void>;
    onFailed(job: Job, error: Error): void;
}
