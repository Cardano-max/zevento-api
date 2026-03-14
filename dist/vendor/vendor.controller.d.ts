import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { VendorService } from './vendor.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdateServiceAreaDto } from './dto/update-service-area.dto';
import { SubmitKycDto } from './dto/submit-kyc.dto';
export declare class VendorController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    createOrGetProfile(user: JwtPayload): Promise<{
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
    updateBusinessDetails(req: any, dto: CreateProfileDto): Promise<{
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
    uploadPhoto(req: any, file: Express.Multer.File, dto: UpdatePortfolioDto): Promise<{
        id: string;
        createdAt: Date;
        caption: string | null;
        categoryId: string | null;
        sortOrder: number;
        vendorId: string;
        cloudinaryPublicId: string;
        cloudinaryUrl: string;
    }>;
    getPhotos(req: any): Promise<({
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
    deletePhoto(req: any, photoId: string): Promise<void>;
    updateServiceAreas(req: any, dto: UpdateServiceAreaDto): Promise<({
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
    uploadKycDocument(req: any, file: Express.Multer.File, dto: SubmitKycDto): Promise<{
        id: string;
        createdAt: Date;
        documentType: string;
        vendorId: string;
        cloudinaryPublicId: string;
        cloudinaryUrl: string;
    }>;
    deleteKycDocument(req: any, docId: string): Promise<void>;
    submitForKyc(req: any): Promise<{
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
    getMyProfile(user: JwtPayload): Promise<{
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
}
