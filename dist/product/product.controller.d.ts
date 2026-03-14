import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    createProduct(req: any, dto: CreateProductDto): Promise<{
        category: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            sortOrder: number;
            slug: string;
            parentId: string | null;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        categoryId: string;
        vendorId: string;
        pricePaise: number;
        stock: number;
        lowStockThreshold: number;
        moq: number;
        fulfillmentSource: string;
    }>;
    updateProduct(req: any, id: string, dto: UpdateProductDto): Promise<{
        category: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            sortOrder: number;
            slug: string;
            parentId: string | null;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        categoryId: string;
        vendorId: string;
        pricePaise: number;
        stock: number;
        lowStockThreshold: number;
        moq: number;
        fulfillmentSource: string;
    }>;
    deleteProduct(req: any, id: string): Promise<{
        deleted: boolean;
    }>;
    getMyProducts(req: any, page?: string, limit?: string): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
            images: {
                id: string;
                cloudinaryUrl: string;
            }[];
        } & {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            categoryId: string;
            vendorId: string;
            pricePaise: number;
            stock: number;
            lowStockThreshold: number;
            moq: number;
            fulfillmentSource: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    addImage(req: any, id: string, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        sortOrder: number;
        cloudinaryPublicId: string;
        cloudinaryUrl: string;
        productId: string;
    }>;
    deleteImage(req: any, imageId: string): Promise<{
        deleted: boolean;
    }>;
    adjustStock(req: any, id: string, adjustment: number): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        categoryId: string;
        vendorId: string;
        pricePaise: number;
        stock: number;
        lowStockThreshold: number;
        moq: number;
        fulfillmentSource: string;
    }>;
}
