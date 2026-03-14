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
    }>;
}
