import { PrismaService } from '../prisma/prisma.service';
export declare class CommissionService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getRate(vendorId: string, categoryId?: string | null): Promise<number>;
}
