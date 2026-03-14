import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CommissionService } from '../../payment/commission.service';
import { NotificationService } from '../../notification/notification.service';
export declare class OrderPaymentProcessor extends WorkerHost {
    private readonly prisma;
    private readonly commissionService;
    private readonly notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, commissionService: CommissionService, notificationService: NotificationService);
    process(job: Job<{
        webhookEventId: string;
        paymentEntity: any;
        orderNotes: Record<string, any>;
    }>): Promise<void>;
    onFailed(job: Job, error: Error): void;
}
