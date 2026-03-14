import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { PayoutService } from '../payout.service';
export declare class PayoutProcessor extends WorkerHost {
    private readonly prisma;
    private readonly payoutService;
    private readonly logger;
    constructor(prisma: PrismaService, payoutService: PayoutService);
    process(job: Job<{
        bookingId: string;
        vendorId: string;
        netPayoutPaise: number;
        razorpayPaymentId: string;
    }>): Promise<void>;
    onFailed(job: Job, error: Error): void;
}
