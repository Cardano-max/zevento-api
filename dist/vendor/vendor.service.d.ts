import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateServiceAreaDto } from './dto/update-service-area.dto';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';
export declare class VendorService {
    private readonly prisma;
    private readonly cloudinary;
    constructor(prisma: PrismaService, cloudinary: CloudinaryService);
    createOrGetProfile(userId: string, role: string): Promise<{
        categories: ({
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
            categoryId: string;
            vendorId: string;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            caption: string | null;
            categoryId: string | null;
            sortOrder: number;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        serviceAreas: ({
            market: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                city: string;
                status: string;
                state: string;
                launchDate: Date | null;
                latitude: number | null;
                longitude: number | null;
            };
        } & {
            id: string;
            marketId: string;
            radiusKm: number;
            vendorId: string;
        })[];
        kycDocuments: {
            id: string;
            createdAt: Date;
            documentType: string;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        subscription: ({
            plan: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                vendorRole: string;
                tier: string;
                amountPaise: number;
                periodMonths: number;
                razorpayPlanId: string | null;
                features: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            vendorId: string;
            planId: string;
            razorpaySubscriptionId: string | null;
            currentPeriodStart: Date | null;
            currentPeriodEnd: Date | null;
        }) | null;
    } & {
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        description: string | null;
        status: string;
        businessName: string;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
        contactEmail: string | null;
        websiteUrl: string | null;
        instagramUrl: string | null;
        facebookUrl: string | null;
        yearsExperience: number | null;
        ownerName: string | null;
        tiktokUrl: string | null;
        youtubeUrl: string | null;
    }>;
    updateBusinessDetails(vendorId: string, dto: UpdateBusinessProfileDto): Promise<{
        categories: ({
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
            categoryId: string;
            vendorId: string;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            caption: string | null;
            categoryId: string | null;
            sortOrder: number;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        serviceAreas: ({
            market: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                city: string;
                status: string;
                state: string;
                launchDate: Date | null;
                latitude: number | null;
                longitude: number | null;
            };
        } & {
            id: string;
            marketId: string;
            radiusKm: number;
            vendorId: string;
        })[];
        kycDocuments: {
            id: string;
            createdAt: Date;
            documentType: string;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        subscription: ({
            plan: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                vendorRole: string;
                tier: string;
                amountPaise: number;
                periodMonths: number;
                razorpayPlanId: string | null;
                features: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            vendorId: string;
            planId: string;
            razorpaySubscriptionId: string | null;
            currentPeriodStart: Date | null;
            currentPeriodEnd: Date | null;
        }) | null;
    } & {
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        description: string | null;
        status: string;
        businessName: string;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
        contactEmail: string | null;
        websiteUrl: string | null;
        instagramUrl: string | null;
        facebookUrl: string | null;
        yearsExperience: number | null;
        ownerName: string | null;
        tiktokUrl: string | null;
        youtubeUrl: string | null;
    }>;
    uploadPhoto(vendorId: string, file: Express.Multer.File, dto: UpdatePortfolioDto): Promise<{
        id: string;
        createdAt: Date;
        caption: string | null;
        categoryId: string | null;
        sortOrder: number;
        vendorId: string;
        cloudinaryPublicId: string;
        cloudinaryUrl: string;
    }>;
    deletePhoto(vendorId: string, photoId: string): Promise<void>;
    getPhotos(vendorId: string): Promise<({
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        caption: string | null;
        categoryId: string | null;
        sortOrder: number;
        vendorId: string;
        cloudinaryPublicId: string;
        cloudinaryUrl: string;
    })[]>;
    updateServiceAreas(vendorId: string, dto: UpdateServiceAreaDto): Promise<({
        market: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            status: string;
            state: string;
            launchDate: Date | null;
            latitude: number | null;
            longitude: number | null;
        };
    } & {
        id: string;
        marketId: string;
        radiusKm: number;
        vendorId: string;
    })[]>;
    uploadKycDocument(vendorId: string, file: Express.Multer.File, dto: SubmitKycDto): Promise<{
        id: string;
        createdAt: Date;
        documentType: string;
        vendorId: string;
        cloudinaryPublicId: string;
        cloudinaryUrl: string;
    }>;
    deleteKycDocument(vendorId: string, docId: string): Promise<void>;
    submitForKyc(vendorId: string): Promise<{
        categories: ({
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
            categoryId: string;
            vendorId: string;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            caption: string | null;
            categoryId: string | null;
            sortOrder: number;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        serviceAreas: ({
            market: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                city: string;
                status: string;
                state: string;
                launchDate: Date | null;
                latitude: number | null;
                longitude: number | null;
            };
        } & {
            id: string;
            marketId: string;
            radiusKm: number;
            vendorId: string;
        })[];
        kycDocuments: {
            id: string;
            createdAt: Date;
            documentType: string;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        subscription: ({
            plan: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                vendorRole: string;
                tier: string;
                amountPaise: number;
                periodMonths: number;
                razorpayPlanId: string | null;
                features: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            vendorId: string;
            planId: string;
            razorpaySubscriptionId: string | null;
            currentPeriodStart: Date | null;
            currentPeriodEnd: Date | null;
        }) | null;
    } & {
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        description: string | null;
        status: string;
        businessName: string;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
        contactEmail: string | null;
        websiteUrl: string | null;
        instagramUrl: string | null;
        facebookUrl: string | null;
        yearsExperience: number | null;
        ownerName: string | null;
        tiktokUrl: string | null;
        youtubeUrl: string | null;
    }>;
    getProfile(vendorId: string): Promise<{
        categories: ({
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
            categoryId: string;
            vendorId: string;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            caption: string | null;
            categoryId: string | null;
            sortOrder: number;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        serviceAreas: ({
            market: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                city: string;
                status: string;
                state: string;
                launchDate: Date | null;
                latitude: number | null;
                longitude: number | null;
            };
        } & {
            id: string;
            marketId: string;
            radiusKm: number;
            vendorId: string;
        })[];
        kycDocuments: {
            id: string;
            createdAt: Date;
            documentType: string;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        subscription: ({
            plan: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                vendorRole: string;
                tier: string;
                amountPaise: number;
                periodMonths: number;
                razorpayPlanId: string | null;
                features: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            vendorId: string;
            planId: string;
            razorpaySubscriptionId: string | null;
            currentPeriodStart: Date | null;
            currentPeriodEnd: Date | null;
        }) | null;
    } & {
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        description: string | null;
        status: string;
        businessName: string;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
        contactEmail: string | null;
        websiteUrl: string | null;
        instagramUrl: string | null;
        facebookUrl: string | null;
        yearsExperience: number | null;
        ownerName: string | null;
        tiktokUrl: string | null;
        youtubeUrl: string | null;
    }>;
    getMyProfile(userId: string): Promise<{
        categories: ({
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
            categoryId: string;
            vendorId: string;
        })[];
        photos: {
            id: string;
            createdAt: Date;
            caption: string | null;
            categoryId: string | null;
            sortOrder: number;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        serviceAreas: ({
            market: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                city: string;
                status: string;
                state: string;
                launchDate: Date | null;
                latitude: number | null;
                longitude: number | null;
            };
        } & {
            id: string;
            marketId: string;
            radiusKm: number;
            vendorId: string;
        })[];
        kycDocuments: {
            id: string;
            createdAt: Date;
            documentType: string;
            vendorId: string;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
        }[];
        subscription: ({
            plan: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                vendorRole: string;
                tier: string;
                amountPaise: number;
                periodMonths: number;
                razorpayPlanId: string | null;
                features: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            vendorId: string;
            planId: string;
            razorpaySubscriptionId: string | null;
            currentPeriodStart: Date | null;
            currentPeriodEnd: Date | null;
        }) | null;
    } & {
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        description: string | null;
        status: string;
        businessName: string;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
        contactEmail: string | null;
        websiteUrl: string | null;
        instagramUrl: string | null;
        facebookUrl: string | null;
        yearsExperience: number | null;
        ownerName: string | null;
        tiktokUrl: string | null;
        youtubeUrl: string | null;
    }>;
    createService(vendorId: string, dto: CreateServiceDto): Promise<{
        category: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        categoryId: string | null;
        pricePaise: number;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        vendorId: string;
    }>;
    listServices(vendorId: string): Promise<({
        category: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        categoryId: string | null;
        pricePaise: number;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        vendorId: string;
    })[]>;
    updateService(vendorId: string, serviceId: string, dto: UpdateServiceDto): Promise<{
        category: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        categoryId: string | null;
        pricePaise: number;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        vendorId: string;
    }>;
    deleteService(vendorId: string, serviceId: string): Promise<{
        deleted: boolean;
    }>;
    listConversations(vendorId: string): Promise<({
        customer: {
            phone: string;
            id: string;
            name: string | null;
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
    })[]>;
    getConversationMessages(vendorId: string, conversationId: string): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        conversationId: string;
        senderRole: string;
        readAt: Date | null;
        senderId: string;
    }[]>;
    sendMessageAsVendor(vendorId: string, conversationId: string, body: string): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        conversationId: string;
        senderRole: string;
        readAt: Date | null;
        senderId: string;
    }>;
    private findProfileOrThrow;
}
