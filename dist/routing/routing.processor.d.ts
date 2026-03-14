import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RoutingService } from './routing.service';
export declare class RoutingProcessor extends WorkerHost {
    private readonly routingService;
    private readonly logger;
    constructor(routingService: RoutingService);
    process(job: Job<{
        leadId: string;
        mode: 'A' | 'B';
    }>): Promise<void>;
    onFailed(job: Job, error: Error): void;
}
