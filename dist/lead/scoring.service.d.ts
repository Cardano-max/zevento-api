import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { VendorScoreFactors } from './types/vendor-score.interface';
export declare class ScoringService {
    private readonly prisma;
    private readonly redis;
    private readonly logger;
    constructor(prisma: PrismaService, redis: RedisService);
    computeScore(factors: VendorScoreFactors): number;
    findVendorsInRange(latitude: number, longitude: number, categoryId?: string): Promise<string[]>;
    getScoreFactors(vendorId: string, eventLat: number, eventLng: number): Promise<VendorScoreFactors>;
    scoreVendors(vendorIds: string[], eventLat: number, eventLng: number): Promise<Array<{
        vendorId: string;
        score: number;
        factors: VendorScoreFactors;
    }>>;
    incrementFairnessCount(vendorId: string): Promise<void>;
    invalidateScoreCache(vendorId: string): Promise<void>;
}
