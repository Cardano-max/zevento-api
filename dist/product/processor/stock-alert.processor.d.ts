import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../notification/notification.service';
export declare class StockAlertProcessor extends WorkerHost {
    private readonly prisma;
    private readonly notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    process(job: Job<{
        productId: string;
        currentStock: number;
    }>): Promise<void>;
    onFailed(job: Job, error: Error): void;
}
