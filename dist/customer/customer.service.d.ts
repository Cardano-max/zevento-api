import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchVendorsDto } from './dto/search-vendors.dto';
export declare class CustomerService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listCategories(): Promise<{
        id: string;
        name: string;
        description: string | null;
        sortOrder: number;
        slug: string;
        parentId: string | null;
        children: {
            id: string;
            name: string;
            description: string | null;
            sortOrder: number;
            slug: string;
        }[];
    }[]>;
    searchVendors(dto: SearchVendorsDto): Promise<{
        data: {
            id: string;
            businessName: string;
            description: string | null;
            pricingMin: number | null;
            pricingMax: number | null;
            categories: string[];
            serviceAreas: string[];
            averageRating: number | null;
            portfolioPhotoCount: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getVendorProfile(vendorId: string): Promise<{
        id: string;
        businessName: string;
        description: string | null;
        pricingMin: number | null;
        pricingMax: number | null;
        categories: {
            id: string;
            name: string;
            slug: string;
        }[];
        photos: {
            id: string;
            url: string;
            caption: string | null;
            sortOrder: number;
            category: {
                id: string;
                name: string;
            } | null;
        }[];
        serviceAreas: {
            city: string;
            state: string;
            radiusKm: number;
        }[];
        averageRating: number | null;
        responseRate: number | null;
        subscriptionTier: string | null;
        services: {
            id: string;
            description: string | null;
            title: string;
            category: {
                id: string;
                name: string;
            } | null;
            pricePaise: number;
            images: Prisma.JsonValue;
        }[];
        blockedDates: {
            reason: string | null;
            date: Date;
        }[];
    }>;
    getFavorites(userId: string): Promise<{
        favoriteId: string;
        createdAt: Date;
        vendor: {
            id: string;
            businessName: string;
            description: string | null;
            pricingMin: number | null;
            pricingMax: number | null;
            averageRating: number | null;
        };
    }[]>;
    addFavorite(userId: string, vendorId: string): Promise<{
        id: string;
        createdAt: Date;
        vendorId: string;
    }>;
    removeFavorite(userId: string, vendorId: string): Promise<{
        message: string;
    }>;
    checkFavorite(userId: string, vendorId: string): Promise<{
        isFavorited: boolean;
    }>;
    startOrGetConversation(customerId: string, vendorId: string): Promise<{
        vendor: {
            id: string;
            businessName: string;
        };
        messages: {
            id: string;
            createdAt: Date;
            body: string;
            conversationId: string;
            senderRole: string;
            readAt: Date | null;
            senderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        customerId: string;
    }>;
    sendMessageAsCustomer(customerId: string, vendorId: string, body: string): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        conversationId: string;
        senderRole: string;
        readAt: Date | null;
        senderId: string;
    }>;
    getConversationMessages(customerId: string, vendorId: string): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        conversationId: string;
        senderRole: string;
        readAt: Date | null;
        senderId: string;
    }[]>;
}
