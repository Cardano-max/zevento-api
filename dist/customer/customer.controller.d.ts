import { CustomerService } from './customer.service';
import { SearchVendorsDto } from './dto/search-vendors.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
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
    getVendorProfile(id: string): Promise<{
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
            images: import("@prisma/client/runtime/library").JsonValue;
        }[];
        blockedDates: {
            reason: string | null;
            date: Date;
        }[];
    }>;
    getFavorites(user: {
        id: string;
    }): Promise<{
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
    addFavorite(user: {
        id: string;
    }, vendorId: string): Promise<{
        id: string;
        createdAt: Date;
        vendorId: string;
    }>;
    removeFavorite(user: {
        id: string;
    }, vendorId: string): Promise<{
        message: string;
    }>;
    checkFavorite(user: {
        id: string;
    }, vendorId: string): Promise<{
        isFavorited: boolean;
    }>;
    sendMessage(user: {
        id: string;
    }, vendorId: string, body: string): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        conversationId: string;
        senderRole: string;
        readAt: Date | null;
        senderId: string;
    }>;
    getMessages(user: {
        id: string;
    }, vendorId: string): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        conversationId: string;
        senderRole: string;
        readAt: Date | null;
        senderId: string;
    }[]>;
}
