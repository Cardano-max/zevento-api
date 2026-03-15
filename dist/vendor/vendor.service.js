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
exports.VendorService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@zevento/shared");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const MAX_PORTFOLIO_PHOTOS = 20;
let VendorService = class VendorService {
    constructor(prisma, cloudinary) {
        this.prisma = prisma;
        this.cloudinary = cloudinary;
    }
    async createOrGetProfile(userId, role) {
        const existing = await this.prisma.vendorProfile.findUnique({
            where: { userId },
            include: {
                categories: { include: { category: true } },
                photos: { orderBy: { sortOrder: 'asc' } },
                serviceAreas: { include: { market: true } },
                kycDocuments: true,
                subscription: { include: { plan: true } },
            },
        });
        if (existing) {
            return existing;
        }
        return this.prisma.vendorProfile.create({
            data: {
                userId,
                role,
                businessName: '',
                status: shared_1.VendorStatus.DRAFT,
                onboardingStep: 1,
            },
            include: {
                categories: { include: { category: true } },
                photos: { orderBy: { sortOrder: 'asc' } },
                serviceAreas: { include: { market: true } },
                kycDocuments: true,
                subscription: { include: { plan: true } },
            },
        });
    }
    async updateBusinessDetails(vendorId, dto) {
        const profile = await this.findProfileOrThrow(vendorId);
        if (dto.pricingMin !== undefined &&
            dto.pricingMax !== undefined &&
            dto.pricingMax < dto.pricingMin) {
            throw new common_1.BadRequestException('pricingMax must be greater than or equal to pricingMin');
        }
        const profileUpdateData = {};
        if (dto.businessName !== undefined)
            profileUpdateData.businessName = dto.businessName;
        if (dto.description !== undefined)
            profileUpdateData.description = dto.description;
        if (dto.pricingMin !== undefined)
            profileUpdateData.pricingMin = dto.pricingMin;
        if (dto.pricingMax !== undefined)
            profileUpdateData.pricingMax = dto.pricingMax;
        if (dto.contactEmail !== undefined)
            profileUpdateData.contactEmail = dto.contactEmail;
        if (dto.websiteUrl !== undefined)
            profileUpdateData.websiteUrl = dto.websiteUrl;
        if (dto.instagramUrl !== undefined)
            profileUpdateData.instagramUrl = dto.instagramUrl;
        if (dto.facebookUrl !== undefined)
            profileUpdateData.facebookUrl = dto.facebookUrl;
        if (dto.yearsExperience !== undefined)
            profileUpdateData.yearsExperience = dto.yearsExperience;
        if (dto.ownerName !== undefined)
            profileUpdateData.ownerName = dto.ownerName;
        if (dto.phone !== undefined)
            profileUpdateData.phone = dto.phone;
        if (dto.tiktokUrl !== undefined)
            profileUpdateData.tiktokUrl = dto.tiktokUrl;
        if (dto.youtubeUrl !== undefined)
            profileUpdateData.youtubeUrl = dto.youtubeUrl;
        profileUpdateData.onboardingStep = Math.max(profile.onboardingStep, 2);
        if (profile.status === shared_1.VendorStatus.REJECTED) {
            profileUpdateData.status = shared_1.VendorStatus.DRAFT;
            profileUpdateData.rejectionReason = null;
        }
        if (dto.categoryIds && dto.categoryIds.length > 0) {
            const categories = await this.prisma.eventCategory.findMany({
                where: { id: { in: dto.categoryIds }, isActive: true },
                select: { id: true },
            });
            if (categories.length !== dto.categoryIds.length) {
                throw new common_1.BadRequestException('One or more category IDs are invalid or inactive');
            }
            return this.prisma.$transaction(async (tx) => {
                await tx.vendorCategory.deleteMany({ where: { vendorId } });
                await tx.vendorCategory.createMany({
                    data: dto.categoryIds.map((categoryId) => ({ vendorId, categoryId })),
                });
                return tx.vendorProfile.update({
                    where: { id: vendorId },
                    data: profileUpdateData,
                    include: {
                        categories: { include: { category: true } },
                        photos: { orderBy: { sortOrder: 'asc' } },
                        serviceAreas: { include: { market: true } },
                        kycDocuments: true,
                        subscription: { include: { plan: true } },
                    },
                });
            });
        }
        return this.prisma.vendorProfile.update({
            where: { id: vendorId },
            data: profileUpdateData,
            include: {
                categories: { include: { category: true } },
                photos: { orderBy: { sortOrder: 'asc' } },
                serviceAreas: { include: { market: true } },
                kycDocuments: true,
                subscription: { include: { plan: true } },
            },
        });
    }
    async uploadPhoto(vendorId, file, dto) {
        const profile = await this.findProfileOrThrow(vendorId);
        const photoCount = await this.prisma.portfolioPhoto.count({
            where: { vendorId },
        });
        if (photoCount >= MAX_PORTFOLIO_PHOTOS) {
            throw new common_1.BadRequestException(`Maximum ${MAX_PORTFOLIO_PHOTOS} portfolio photos allowed`);
        }
        if (dto.categoryId) {
            const category = await this.prisma.eventCategory.findUnique({
                where: { id: dto.categoryId },
            });
            if (!category) {
                throw new common_1.BadRequestException('Invalid category ID');
            }
        }
        const uploadResult = await this.cloudinary.uploadImage(file, `vendors/${vendorId}/portfolio`);
        const photo = await this.prisma.portfolioPhoto.create({
            data: {
                vendorId,
                categoryId: dto.categoryId,
                cloudinaryPublicId: uploadResult.publicId,
                cloudinaryUrl: uploadResult.url,
                caption: dto.caption,
                sortOrder: dto.sortOrder ?? photoCount,
            },
        });
        await this.prisma.vendorProfile.update({
            where: { id: vendorId },
            data: {
                onboardingStep: Math.max(profile.onboardingStep, 3),
            },
        });
        return photo;
    }
    async deletePhoto(vendorId, photoId) {
        const photo = await this.prisma.portfolioPhoto.findUnique({
            where: { id: photoId },
        });
        if (!photo || photo.vendorId !== vendorId) {
            throw new common_1.NotFoundException('Photo not found');
        }
        await this.cloudinary.deleteImage(photo.cloudinaryPublicId);
        await this.prisma.portfolioPhoto.delete({ where: { id: photoId } });
    }
    async getPhotos(vendorId) {
        await this.findProfileOrThrow(vendorId);
        return this.prisma.portfolioPhoto.findMany({
            where: { vendorId },
            orderBy: { sortOrder: 'asc' },
            include: { category: true },
        });
    }
    async updateServiceAreas(vendorId, dto) {
        const profile = await this.findProfileOrThrow(vendorId);
        const marketIds = dto.serviceAreas.map((sa) => sa.marketId);
        const markets = await this.prisma.market.findMany({
            where: { id: { in: marketIds }, status: 'ACTIVE' },
            select: { id: true },
        });
        if (markets.length !== marketIds.length) {
            throw new common_1.BadRequestException('One or more market IDs are invalid or not active');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.vendorServiceArea.deleteMany({ where: { vendorId } });
            await tx.vendorServiceArea.createMany({
                data: dto.serviceAreas.map((sa) => ({
                    vendorId,
                    marketId: sa.marketId,
                    radiusKm: sa.radiusKm ?? 25,
                })),
            });
            await tx.vendorProfile.update({
                where: { id: vendorId },
                data: {
                    onboardingStep: Math.max(profile.onboardingStep, 4),
                },
            });
            return tx.vendorServiceArea.findMany({
                where: { vendorId },
                include: { market: true },
            });
        });
    }
    async uploadKycDocument(vendorId, file, dto) {
        const profile = await this.findProfileOrThrow(vendorId);
        if (profile.role === shared_1.Role.PLANNER &&
            dto.documentType === shared_1.KycDocumentType.GST_CERTIFICATE) {
            throw new common_1.BadRequestException('Planners cannot upload GST certificates. Upload Aadhaar or PAN instead.');
        }
        const uploadResult = await this.cloudinary.uploadImage(file, `vendors/${vendorId}/kyc`);
        return this.prisma.kycDocument.create({
            data: {
                vendorId,
                documentType: dto.documentType,
                cloudinaryPublicId: uploadResult.publicId,
                cloudinaryUrl: uploadResult.url,
            },
        });
    }
    async deleteKycDocument(vendorId, docId) {
        const doc = await this.prisma.kycDocument.findUnique({
            where: { id: docId },
        });
        if (!doc || doc.vendorId !== vendorId) {
            throw new common_1.NotFoundException('KYC document not found');
        }
        await this.cloudinary.deleteImage(doc.cloudinaryPublicId);
        await this.prisma.kycDocument.delete({ where: { id: docId } });
    }
    async submitForKyc(vendorId) {
        const profile = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            include: { kycDocuments: true },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Vendor profile not found');
        }
        if (profile.onboardingStep < 4) {
            throw new common_1.BadRequestException('Complete all onboarding steps before submitting for KYC review');
        }
        if (profile.status === shared_1.VendorStatus.PENDING_KYC) {
            throw new common_1.ConflictException('KYC review already submitted');
        }
        if (profile.kycDocuments.length === 0) {
            throw new common_1.BadRequestException('Upload at least one KYC document before submitting');
        }
        if (profile.role === shared_1.Role.SUPPLIER) {
            const hasGst = profile.kycDocuments.some((doc) => doc.documentType === shared_1.KycDocumentType.GST_CERTIFICATE);
            if (!hasGst) {
                throw new common_1.BadRequestException('Suppliers must upload a GST certificate');
            }
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.vendorProfile.update({
                where: { id: vendorId },
                data: {
                    status: shared_1.VendorStatus.PENDING_KYC,
                    onboardingStep: 5,
                    submittedAt: new Date(),
                },
                include: {
                    categories: { include: { category: true } },
                    photos: { orderBy: { sortOrder: 'asc' } },
                    serviceAreas: { include: { market: true } },
                    kycDocuments: true,
                    subscription: { include: { plan: true } },
                },
            });
            await tx.adminNotification.create({
                data: {
                    type: 'KYC_SUBMISSION',
                    title: 'New KYC submission',
                    message: `Vendor "${profile.businessName}" (${profile.role}) has submitted KYC documents for review.`,
                    referenceId: vendorId,
                },
            });
            return updated;
        });
    }
    async getProfile(vendorId) {
        const profile = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            include: {
                categories: { include: { category: true } },
                photos: { orderBy: { sortOrder: 'asc' } },
                serviceAreas: { include: { market: true } },
                kycDocuments: true,
                subscription: { include: { plan: true } },
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Vendor profile not found');
        }
        return profile;
    }
    async getMyProfile(userId) {
        const profile = await this.prisma.vendorProfile.findUnique({
            where: { userId },
            include: {
                categories: { include: { category: true } },
                photos: { orderBy: { sortOrder: 'asc' } },
                serviceAreas: { include: { market: true } },
                kycDocuments: true,
                subscription: { include: { plan: true } },
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Vendor profile not found. Create a profile first.');
        }
        return profile;
    }
    async createService(vendorId, dto) {
        return this.prisma.vendorService.create({
            data: { vendorId, ...dto },
            include: { category: { select: { id: true, name: true } } },
        });
    }
    async listServices(vendorId) {
        return this.prisma.vendorService.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' },
            include: { category: { select: { id: true, name: true } } },
        });
    }
    async updateService(vendorId, serviceId, dto) {
        const svc = await this.prisma.vendorService.findFirst({ where: { id: serviceId, vendorId } });
        if (!svc)
            throw new common_1.NotFoundException('Service not found');
        return this.prisma.vendorService.update({
            where: { id: serviceId },
            data: dto,
            include: { category: { select: { id: true, name: true } } },
        });
    }
    async deleteService(vendorId, serviceId) {
        const svc = await this.prisma.vendorService.findFirst({ where: { id: serviceId, vendorId } });
        if (!svc)
            throw new common_1.NotFoundException('Service not found');
        await this.prisma.vendorService.delete({ where: { id: serviceId } });
        return { deleted: true };
    }
    async listConversations(vendorId) {
        return this.prisma.conversation.findMany({
            where: { vendorId },
            orderBy: { updatedAt: 'desc' },
            include: {
                customer: { select: { id: true, name: true, phone: true } },
                messages: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
        });
    }
    async getConversationMessages(vendorId, conversationId) {
        const conv = await this.prisma.conversation.findFirst({ where: { id: conversationId, vendorId } });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        await this.prisma.message.updateMany({
            where: { conversationId, senderRole: 'CUSTOMER', readAt: null },
            data: { readAt: new Date() },
        });
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async sendMessageAsVendor(vendorId, conversationId, body) {
        const conv = await this.prisma.conversation.findFirst({ where: { id: conversationId, vendorId } });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        const vendorProfile = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            select: { userId: true },
        });
        const msg = await this.prisma.message.create({
            data: { conversationId, senderId: vendorProfile.userId, senderRole: 'VENDOR', body },
        });
        await this.prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
        return msg;
    }
    async findProfileOrThrow(vendorId) {
        const profile = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Vendor profile not found');
        }
        return profile;
    }
};
exports.VendorService = VendorService;
exports.VendorService = VendorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], VendorService);
//# sourceMappingURL=vendor.service.js.map