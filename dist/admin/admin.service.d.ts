import { Prisma } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayService } from '../subscription/razorpay.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { InitiateRefundDto } from './dto/initiate-refund.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/manage-category.dto';
import { CreateCommissionRateDto, UpdateCommissionRateDto } from './dto/manage-commission.dto';
import { CreatePlanDto, UpdatePlanDto } from './dto/manage-plan.dto';
import { MarketStatusDto } from './dto/market-status.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { RoutingOverrideDto } from './dto/routing-override.dto';
export declare class AdminService {
    private readonly prisma;
    private readonly razorpayService;
    private readonly notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, razorpayService: RazorpayService, notificationService: NotificationService);
    assignRole(userId: string, role: string, grantedBy: string, contextId?: string): Promise<({
        roles: {
            id: string;
            isActive: boolean;
            role: string;
            contextId: string | null;
            grantedAt: Date;
            grantedBy: string | null;
            revokedAt: Date | null;
            userId: string;
        }[];
    } & {
        phone: string;
        id: string;
        name: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    revokeRole(userId: string, roleId: string, revokedBy: string): Promise<({
        roles: {
            id: string;
            isActive: boolean;
            role: string;
            contextId: string | null;
            grantedAt: Date;
            grantedBy: string | null;
            revokedAt: Date | null;
            userId: string;
        }[];
    } & {
        phone: string;
        id: string;
        name: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    listUsers(page?: number, limit?: number, roleFilter?: string): Promise<{
        data: ({
            roles: {
                id: string;
                isActive: boolean;
                role: string;
                contextId: string | null;
                grantedAt: Date;
                grantedBy: string | null;
                revokedAt: Date | null;
                userId: string;
            }[];
        } & {
            phone: string;
            id: string;
            name: string | null;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUser(userId: string): Promise<{
        roles: {
            id: string;
            isActive: boolean;
            role: string;
            contextId: string | null;
            grantedAt: Date;
            grantedBy: string | null;
            revokedAt: Date | null;
            userId: string;
        }[];
    } & {
        phone: string;
        id: string;
        name: string | null;
        email: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getKycQueue(status?: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                phone: string;
                id: string;
                name: string | null;
            };
            _count: {
                photos: number;
            };
            categories: ({
                category: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                categoryId: string;
                vendorId: string;
            })[];
            serviceAreas: ({
                market: {
                    id: string;
                    city: string;
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
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getVendorDetail(vendorId: string): Promise<{
        user: {
            phone: string;
            id: string;
            name: string | null;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
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
                features: Prisma.JsonValue | null;
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
    reviewKyc(vendorId: string, dto: ReviewKycDto, adminUserId: string): Promise<{
        user: {
            phone: string;
            id: string;
            name: string | null;
        };
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
    suspendVendor(vendorId: string): Promise<{
        user: {
            phone: string;
            id: string;
            name: string | null;
        };
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
    reactivateVendor(vendorId: string): Promise<{
        user: {
            phone: string;
            id: string;
            name: string | null;
        };
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
    listVendors(status?: string, role?: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                phone: string;
                id: string;
                name: string | null;
            };
            subscription: {
                status: string;
                plan: {
                    name: string;
                    tier: string;
                };
            } | null;
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
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    private generateSlug;
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        slug: string;
        parentId: string | null;
    }>;
    updateCategory(categoryId: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        slug: string;
        parentId: string | null;
    }>;
    listCategories(includeInactive?: boolean): Promise<({
        _count: {
            vendors: number;
        };
        parent: {
            id: string;
            name: string;
        } | null;
        children: {
            id: string;
            name: string;
            isActive: boolean;
            slug: string;
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        slug: string;
        parentId: string | null;
    })[]>;
    getCategoryDetail(categoryId: string): Promise<{
        _count: {
            vendors: number;
        };
        parent: {
            id: string;
            name: string;
        } | null;
        children: {
            id: string;
            name: string;
            isActive: boolean;
            sortOrder: number;
            slug: string;
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        slug: string;
        parentId: string | null;
    }>;
    createPlan(dto: CreatePlanDto): Promise<{
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
        features: Prisma.JsonValue | null;
    }>;
    updatePlan(planId: string, dto: UpdatePlanDto): Promise<{
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
        features: Prisma.JsonValue | null;
    }>;
    listPlans(vendorRole?: string, includeInactive?: boolean): Promise<({
        _count: {
            subscriptions: number;
        };
    } & {
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
        features: Prisma.JsonValue | null;
    })[]>;
    getPlanDetail(planId: string): Promise<{
        _count: {
            subscriptions: number;
        };
    } & {
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
        features: Prisma.JsonValue | null;
    }>;
    getNotifications(page?: number, limit?: number, unreadOnly?: boolean): Promise<{
        data: {
            message: string;
            type: string;
            id: string;
            createdAt: Date;
            title: string;
            referenceId: string | null;
            isRead: boolean;
        }[];
        total: number;
        unreadCount: number;
        page: number;
        totalPages: number;
    }>;
    markNotificationRead(notificationId: string): Promise<{
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        title: string;
        referenceId: string | null;
        isRead: boolean;
    }>;
    markAllNotificationsRead(): Promise<{
        count: number;
    }>;
    getUnreadCount(): Promise<{
        unreadCount: number;
    }>;
    getPaymentLog(page: number | undefined, limit: number | undefined, filters: {
        dateFrom?: string;
        dateTo?: string;
        vendorId?: string;
        type?: string;
    }): Promise<{
        data: ({
            vendorSubscription: {
                vendor: {
                    id: string;
                    businessName: string;
                };
            } | null;
            booking: {
                id: string;
                vendor: {
                    id: string;
                    businessName: string;
                };
                customer: {
                    phone: string;
                    id: string;
                    name: string | null;
                };
            } | null;
        } & {
            type: string;
            id: string;
            createdAt: Date;
            status: string;
            amountPaise: number;
            vendorSubscriptionId: string | null;
            bookingId: string | null;
            commissionPaise: number | null;
            netPayoutPaise: number | null;
            razorpayPaymentId: string | null;
            razorpayOrderId: string | null;
            razorpayPayoutId: string | null;
            payoutStatus: string | null;
            paidAt: Date | null;
            productOrderId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    initiateRefund(dto: InitiateRefundDto): Promise<import("razorpay/dist/types/refunds").Refunds.RazorpayRefund | {
        id: string;
        payment_id: string;
        amount: number | undefined;
        status: "processed";
    }>;
    getReconciliation(): Promise<{
        revenueByStream: {
            type: string;
            count: number;
            totalAmountPaise: number | null;
            totalCommissionPaise: number | null;
            totalNetPayoutPaise: number | null;
        }[];
        payoutBreakdown: {
            status: string | null;
            count: number;
            totalPaise: number | null;
        }[];
    }>;
    createCommissionRate(dto: CreateCommissionRateDto): Promise<{
        category: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        categoryId: string | null;
        vendorRole: string | null;
        rateBps: number;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }>;
    updateCommissionRate(id: string, dto: UpdateCommissionRateDto): Promise<{
        category: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        categoryId: string | null;
        vendorRole: string | null;
        rateBps: number;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }>;
    listCommissionRates(categoryId?: string, vendorRole?: string): Promise<({
        category: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        categoryId: string | null;
        vendorRole: string | null;
        rateBps: number;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    })[]>;
    deleteCommissionRate(id: string): Promise<{
        category: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        categoryId: string | null;
        vendorRole: string | null;
        rateBps: number;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }>;
    private static readonly FUNNEL_ORDER;
    getAnalyticsDashboard(query: AnalyticsQueryDto): Promise<{
        window: {
            from: Date;
            to: Date;
        };
        leadsPerCity: {
            city: string;
            count: number;
        }[];
        conversionFunnel: {
            status: "PENDING" | "ROUTING" | "ROUTED" | "NOTIFIED" | "QUOTES_RECEIVED" | "BOOKED" | "COMPLETED" | "CANCELLED";
            count: number;
        }[];
        revenueByStream: {
            type: string;
            count: number;
            totalAmountPaise: number;
        }[];
        activeVendorCount: number;
    }>;
    getLeadRoutingTrace(leadId: string): Promise<{
        leadId: string;
        traces: ({
            vendor: {
                id: string;
                businessName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            leadId: string;
            vendorId: string;
            score: number | null;
            scoreFactors: Prisma.JsonValue;
            selected: boolean;
            skipReason: string | null;
            overriddenAt: Date | null;
            overriddenBy: string | null;
            overrideReason: string | null;
        })[];
        assignments: {
            status: string;
            vendorId: string;
            notifiedAt: Date | null;
        }[];
    }>;
    overrideRouting(leadId: string, dto: RoutingOverrideDto, adminId: string): Promise<{
        success: boolean;
        leadId: string;
        overrideVendorId: string;
    }>;
    listMarkets(): Promise<{
        id: string;
        city: string;
        status: string;
        state: string;
        launchDate: Date | null;
    }[]>;
    updateMarketStatus(marketId: string, dto: MarketStatusDto): Promise<{
        id: string;
        city: string;
        status: string;
        state: string;
        launchDate: Date | null;
    }>;
}
