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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CatalogService = class CatalogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchProducts(dto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
            vendor: {
                status: 'APPROVED',
                subscription: {
                    status: { in: ['ACTIVE', 'AUTHENTICATED'] },
                },
            },
        };
        if (dto.search) {
            where.name = { contains: dto.search, mode: 'insensitive' };
        }
        if (dto.categoryId) {
            where.categoryId = dto.categoryId;
        }
        if (dto.priceMin !== undefined) {
            where.pricePaise = {
                ...where.pricePaise,
                gte: dto.priceMin,
            };
        }
        if (dto.priceMax !== undefined) {
            where.pricePaise = {
                ...where.pricePaise,
                lte: dto.priceMax,
            };
        }
        if (dto.vendorId) {
            where.vendorId = dto.vendorId;
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    pricePaise: true,
                    stock: true,
                    moq: true,
                    fulfillmentSource: true,
                    category: { select: { id: true, name: true, slug: true } },
                    vendor: { select: { id: true, businessName: true } },
                    images: {
                        take: 1,
                        orderBy: { sortOrder: 'asc' },
                        select: { id: true, cloudinaryUrl: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
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
    async getProductDetail(productId) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, isActive: true },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                vendor: { select: { id: true, businessName: true } },
                images: {
                    orderBy: { sortOrder: 'asc' },
                    select: {
                        id: true,
                        cloudinaryUrl: true,
                        sortOrder: true,
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async getCategories() {
        return this.prisma.productCategory.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                sortOrder: true,
                parentId: true,
                children: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        sortOrder: true,
                    },
                },
            },
        });
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map