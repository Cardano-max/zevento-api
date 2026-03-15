import { CatalogService } from './catalog.service';
import { SearchProductsDto } from './dto/search-products.dto';
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    searchProducts(dto: SearchProductsDto): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
            category: {
                id: string;
                name: string;
                slug: string;
            };
            pricePaise: number;
            images: {
                id: string;
                cloudinaryUrl: string;
            }[];
            vendor: {
                id: string;
                businessName: string;
            };
            stock: number;
            moq: number;
            fulfillmentSource: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getProductDetail(id: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        images: {
            id: string;
            sortOrder: number;
            cloudinaryUrl: string;
        }[];
        vendor: {
            id: string;
            businessName: string;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        categoryId: string;
        pricePaise: number;
        vendorId: string;
        stock: number;
        lowStockThreshold: number;
        moq: number;
        fulfillmentSource: string;
    }>;
    getCategories(): Promise<{
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
}
