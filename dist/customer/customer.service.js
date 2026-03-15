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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomerService = class CustomerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listCategories() {
        return this.prisma.eventCategory.findMany({
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
    async searchVendors(dto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {
            status: 'APPROVED',
            subscription: {
                status: { in: ['ACTIVE', 'AUTHENTICATED'] },
            },
        };
        if (dto.categoryId) {
            where.categories = {
                some: { categoryId: dto.categoryId },
            };
        }
        if (dto.city) {
            where.serviceAreas = {
                some: {
                    market: {
                        city: { equals: dto.city, mode: 'insensitive' },
                    },
                },
            };
        }
        if (dto.budgetMin !== undefined) {
            where.pricingMin = { gte: dto.budgetMin };
        }
        if (dto.budgetMax !== undefined) {
            where.pricingMax = { lte: dto.budgetMax };
        }
        const [vendors, total] = await Promise.all([
            this.prisma.vendorProfile.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    businessName: true,
                    description: true,
                    pricingMin: true,
                    pricingMax: true,
                    categories: {
                        select: {
                            category: {
                                select: { id: true, name: true, slug: true },
                            },
                        },
                    },
                    serviceAreas: {
                        select: {
                            market: {
                                select: { id: true, city: true, state: true },
                            },
                        },
                    },
                    stats: {
                        select: { averageRating: true },
                    },
                    photos: {
                        select: { id: true },
                    },
                },
                orderBy: { businessName: 'asc' },
            }),
            this.prisma.vendorProfile.count({ where }),
        ]);
        const data = vendors.map((vendor) => ({
            id: vendor.id,
            businessName: vendor.businessName,
            description: vendor.description,
            pricingMin: vendor.pricingMin,
            pricingMax: vendor.pricingMax,
            categories: vendor.categories.map((vc) => vc.category.name),
            serviceAreas: vendor.serviceAreas.map((sa) => sa.market.city),
            averageRating: vendor.stats?.averageRating ?? null,
            portfolioPhotoCount: vendor.photos.length,
        }));
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getVendorProfile(vendorId) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            select: {
                id: true,
                businessName: true,
                description: true,
                pricingMin: true,
                pricingMax: true,
                categories: {
                    select: {
                        category: {
                            select: { id: true, name: true, slug: true },
                        },
                    },
                },
                photos: {
                    orderBy: { sortOrder: 'asc' },
                    select: {
                        id: true,
                        cloudinaryUrl: true,
                        caption: true,
                        sortOrder: true,
                        category: {
                            select: { id: true, name: true },
                        },
                    },
                },
                serviceAreas: {
                    select: {
                        market: {
                            select: { id: true, city: true, state: true },
                        },
                        radiusKm: true,
                    },
                },
                stats: {
                    select: {
                        averageRating: true,
                        responseRate: true,
                    },
                },
                subscription: {
                    select: {
                        plan: {
                            select: { tier: true },
                        },
                    },
                },
                services: {
                    where: { isActive: true },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        pricePaise: true,
                        images: true,
                        category: { select: { id: true, name: true } },
                    },
                },
                blockedDates: {
                    select: { date: true, reason: true },
                    orderBy: { date: 'asc' },
                },
                status: true,
            },
        });
        if (!vendor || vendor.status !== 'APPROVED') {
            throw new common_1.NotFoundException('Vendor not found');
        }
        return {
            id: vendor.id,
            businessName: vendor.businessName,
            description: vendor.description,
            pricingMin: vendor.pricingMin,
            pricingMax: vendor.pricingMax,
            categories: vendor.categories.map((vc) => ({
                id: vc.category.id,
                name: vc.category.name,
                slug: vc.category.slug,
            })),
            photos: vendor.photos.map((p) => ({
                id: p.id,
                url: p.cloudinaryUrl,
                caption: p.caption,
                sortOrder: p.sortOrder,
                category: p.category
                    ? { id: p.category.id, name: p.category.name }
                    : null,
            })),
            serviceAreas: vendor.serviceAreas.map((sa) => ({
                city: sa.market.city,
                state: sa.market.state,
                radiusKm: sa.radiusKm,
            })),
            averageRating: vendor.stats?.averageRating ?? null,
            responseRate: vendor.stats?.responseRate ?? null,
            subscriptionTier: vendor.subscription?.plan?.tier ?? null,
            services: vendor.services,
            blockedDates: vendor.blockedDates,
        };
    }
    async getFavorites(userId) {
        const favorites = await this.prisma.favoriteVendor.findMany({
            where: { customerId: userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                createdAt: true,
                vendor: {
                    select: {
                        id: true,
                        businessName: true,
                        description: true,
                        pricingMin: true,
                        pricingMax: true,
                        stats: { select: { averageRating: true } },
                    },
                },
            },
        });
        return favorites.map((f) => ({
            favoriteId: f.id,
            createdAt: f.createdAt,
            vendor: {
                id: f.vendor.id,
                businessName: f.vendor.businessName,
                description: f.vendor.description,
                pricingMin: f.vendor.pricingMin,
                pricingMax: f.vendor.pricingMax,
                averageRating: f.vendor.stats?.averageRating ?? null,
            },
        }));
    }
    async addFavorite(userId, vendorId) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        const existing = await this.prisma.favoriteVendor.findUnique({
            where: { customerId_vendorId: { customerId: userId, vendorId } },
        });
        if (existing) {
            throw new common_1.ConflictException('Vendor already in favorites');
        }
        return this.prisma.favoriteVendor.create({
            data: { customerId: userId, vendorId },
            select: { id: true, createdAt: true, vendorId: true },
        });
    }
    async removeFavorite(userId, vendorId) {
        const favorite = await this.prisma.favoriteVendor.findUnique({
            where: { customerId_vendorId: { customerId: userId, vendorId } },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Favorite not found');
        }
        await this.prisma.favoriteVendor.delete({
            where: { customerId_vendorId: { customerId: userId, vendorId } },
        });
        return { message: 'Removed from favorites' };
    }
    async checkFavorite(userId, vendorId) {
        const favorite = await this.prisma.favoriteVendor.findUnique({
            where: { customerId_vendorId: { customerId: userId, vendorId } },
        });
        return { isFavorited: !!favorite };
    }
    async startOrGetConversation(customerId, vendorId) {
        return this.prisma.conversation.upsert({
            where: { customerId_vendorId: { customerId, vendorId } },
            create: { customerId, vendorId },
            update: {},
            include: {
                vendor: { select: { id: true, businessName: true } },
                messages: { orderBy: { createdAt: 'asc' } },
            },
        });
    }
    async sendMessageAsCustomer(customerId, vendorId, body) {
        const conv = await this.startOrGetConversation(customerId, vendorId);
        const msg = await this.prisma.message.create({
            data: { conversationId: conv.id, senderId: customerId, senderRole: 'CUSTOMER', body },
        });
        await this.prisma.conversation.update({ where: { id: conv.id }, data: { updatedAt: new Date() } });
        return msg;
    }
    async getConversationMessages(customerId, vendorId) {
        const conv = await this.prisma.conversation.findFirst({ where: { customerId, vendorId } });
        if (!conv)
            return [];
        await this.prisma.message.updateMany({
            where: { conversationId: conv.id, senderRole: 'VENDOR', readAt: null },
            data: { readAt: new Date() },
        });
        return this.prisma.message.findMany({
            where: { conversationId: conv.id },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map