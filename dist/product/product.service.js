"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProductService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let ProductService = ProductService_1 = class ProductService {
    constructor(prisma, cloudinaryService, stockAlertQueue) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
        this.stockAlertQueue = stockAlertQueue;
        this.logger = new common_1.Logger(ProductService_1.name);
    }
    async createProduct(vendorId, dto) {
        const product = await this.prisma.product.create({
            data: {
                vendorId,
                categoryId: dto.categoryId,
                name: dto.name,
                description: dto.description,
                pricePaise: dto.pricePaise,
                stock: dto.stock,
                lowStockThreshold: dto.lowStockThreshold ?? 5,
                moq: dto.moq ?? 1,
                fulfillmentSource: dto.fulfillmentSource ?? 'SUPPLIER',
            },
            include: { category: true },
        });
        this.logger.log(`Product created: ${product.id} by vendor ${vendorId}`);
        return product;
    }
    async updateProduct(vendorId, productId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.vendorId !== vendorId) {
            throw new common_1.ForbiddenException('You do not own this product');
        }
        return this.prisma.product.update({
            where: { id: productId },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.pricePaise !== undefined && { pricePaise: dto.pricePaise }),
                ...(dto.stock !== undefined && { stock: dto.stock }),
                ...(dto.lowStockThreshold !== undefined && {
                    lowStockThreshold: dto.lowStockThreshold,
                }),
                ...(dto.moq !== undefined && { moq: dto.moq }),
                ...(dto.fulfillmentSource !== undefined && {
                    fulfillmentSource: dto.fulfillmentSource,
                }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
            include: { category: true },
        });
    }
    async deleteProduct(vendorId, productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { images: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.vendorId !== vendorId) {
            throw new common_1.ForbiddenException('You do not own this product');
        }
        for (const image of product.images) {
            try {
                await this.cloudinaryService.deleteImage(image.cloudinaryPublicId);
            }
            catch (error) {
                this.logger.warn(`Failed to delete Cloudinary asset ${image.cloudinaryPublicId}: ${error}`);
            }
        }
        await this.prisma.$transaction([
            this.prisma.productImage.deleteMany({
                where: { productId },
            }),
            this.prisma.product.delete({
                where: { id: productId },
            }),
        ]);
        this.logger.log(`Product deleted: ${productId} by vendor ${vendorId}`);
        return { deleted: true };
    }
    async addImage(vendorId, productId, file) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.vendorId !== vendorId) {
            throw new common_1.ForbiddenException('You do not own this product');
        }
        const uploadResult = await this.cloudinaryService.uploadImage(file, 'product-images');
        const image = await this.prisma.productImage.create({
            data: {
                productId,
                cloudinaryPublicId: uploadResult.publicId,
                cloudinaryUrl: uploadResult.url,
            },
        });
        return image;
    }
    async deleteImage(vendorId, imageId) {
        const image = await this.prisma.productImage.findUnique({
            where: { id: imageId },
            include: { product: true },
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found');
        }
        if (image.product.vendorId !== vendorId) {
            throw new common_1.ForbiddenException('You do not own this product');
        }
        await this.cloudinaryService.deleteImage(image.cloudinaryPublicId);
        await this.prisma.productImage.delete({
            where: { id: imageId },
        });
        return { deleted: true };
    }
    async adjustStock(vendorId, productId, adjustment) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.vendorId !== vendorId) {
            throw new common_1.ForbiddenException('You do not own this product');
        }
        const updated = await this.prisma.product.update({
            where: { id: productId },
            data: { stock: { increment: adjustment } },
        });
        if (updated.stock <= updated.lowStockThreshold) {
            await this.stockAlertQueue.add('low-stock', {
                productId: updated.id,
                currentStock: updated.stock,
            });
            this.logger.log(`Low stock alert enqueued: product=${productId}, stock=${updated.stock}, threshold=${updated.lowStockThreshold}`);
        }
        return updated;
    }
    async getMyProducts(vendorId, page, limit) {
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where: { vendorId },
                skip,
                take: limit,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    images: {
                        take: 1,
                        orderBy: { sortOrder: 'asc' },
                        select: {
                            id: true,
                            cloudinaryUrl: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where: { vendorId } }),
        ]);
        return {
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getProductById(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                images: {
                    orderBy: { sortOrder: 'asc' },
                    select: {
                        id: true,
                        cloudinaryPublicId: true,
                        cloudinaryUrl: true,
                        sortOrder: true,
                    },
                },
                vendor: {
                    select: { id: true, businessName: true },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('stock-alerts')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService,
        bullmq_2.Queue])
], ProductService);
//# sourceMappingURL=product.service.js.map