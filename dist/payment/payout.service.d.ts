import { PrismaService } from '../prisma/prisma.service';
export declare class PayoutService {
    private readonly prisma;
    private readonly logger;
    private readonly xKeyId;
    private readonly xKeySecret;
    private readonly accountNumber;
    readonly devMode: boolean;
    constructor(prisma: PrismaService);
    createPayout(params: {
        bookingId: string;
        vendorId: string;
        netPayoutPaise: number;
        razorpayPaymentId: string;
    }): Promise<{
        id: string;
        status: string;
        amount: number;
    }>;
}
