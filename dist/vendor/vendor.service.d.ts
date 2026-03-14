import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateServiceAreaDto } from './dto/update-service-area.dto';
import { SubmitKycDto } from './dto/submit-kyc.dto';
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
                status: string;
                city: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        businessName: string;
        description: string | null;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        status: string;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
    }>;
    updateBusinessDetails(vendorId: string, dto: CreateProfileDto): Promise<{
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
                status: string;
                city: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        businessName: string;
        description: string | null;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        status: string;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
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
            status: string;
            city: string;
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
                status: string;
                city: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        businessName: string;
        description: string | null;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        status: string;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
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
                status: string;
                city: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        businessName: string;
        description: string | null;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        status: string;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
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
                status: string;
                city: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        userId: string;
        businessName: string;
        description: string | null;
        pricingMin: number | null;
        pricingMax: number | null;
        onboardingStep: number;
        status: string;
        rejectionReason: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
        bankIfsc: string | null;
    }>;
    private findProfileOrThrow;
}
