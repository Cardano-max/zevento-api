import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    private mockMode;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    registerDevice(userId: string, token: string, platform: string): Promise<void>;
    sendPushToVendor(vendorId: string, leadData: {
        leadId: string;
        eventType: string;
        city: string;
    }): Promise<void>;
    sendPushToCustomer(customerId: string, payload: {
        title: string;
        body: string;
        data: Record<string, string>;
    }): Promise<void>;
    sendPushToMultipleVendors(vendorIds: string[], leadData: {
        leadId: string;
        eventType: string;
        city: string;
    }): Promise<void>;
}
