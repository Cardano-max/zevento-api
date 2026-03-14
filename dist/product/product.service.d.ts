import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly prisma;
    private readonly cloudinaryService;
    private readonly stockAlertQueue;
    private readonly logger;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService, stockAlertQueue: Queue);
    createProduct(vendorId: string, dto: CreateProductDto): Promise<{
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
    updateProduct(vendorId: string, productId: string, dto: UpdateProductDto): Promise<{
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
    deleteProduct(vendorId: string, productId: string): Promise<{
        deleted: boolean;
    }>;
    addImage(vendorId: string, productId: string, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        sortOrder: number;
        cloudinaryPublicId: string;
        cloudinaryUrl: string;
        productId: string;
    }>;
    deleteImage(vendorId: string, imageId: string): Promise<{
        deleted: boolean;
    }>;
    adjustStock(vendorId: string, productId: string, adjustment: number): Promise<{
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
    getMyProducts(vendorId: string, page: number, limit: number): Promise<{
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
    getProductById(productId: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        vendor: {
            id: string;
            businessName: string;
        };
        images: {
            id: string;
            sortOrder: number;
            cloudinaryPublicId: string;
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
    }>;
}
