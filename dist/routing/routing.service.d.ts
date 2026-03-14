import { InboxGateway } from '../inbox/inbox.gateway';
import { ScoringService } from '../lead/scoring.service';
import { NotificationService } from '../notification/notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class RoutingService {
    private readonly prisma;
    private readonly scoringService;
    private readonly notificationService;
    private readonly redis;
    private readonly inboxGateway;
    private readonly logger;
    constructor(prisma: PrismaService, scoringService: ScoringService, notificationService: NotificationService, redis: RedisService, inboxGateway: InboxGateway);
    routeDirect(leadId: string): Promise<void>;
    routeTopThree(leadId: string): Promise<void>;
    private incrementFairness;
}
