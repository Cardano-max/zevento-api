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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../notification/notification.service");
const prisma_service_1 = require("../prisma/prisma.service");
const razorpay_service_1 = require("../subscription/razorpay.service");
const review_kyc_dto_1 = require("./dto/review-kyc.dto");
let AdminService = AdminService_1 = class AdminService {
    constructor(prisma, razorpayService, notificationService) {
        this.prisma = prisma;
        this.razorpayService = razorpayService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(AdminService_1.name);
    }
    async assignRole(userId, role, grantedBy, contextId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        const existing = user.roles.find((r) => r.role === role &&
            r.isActive &&
            r.contextId === (contextId ?? null));
        if (existing) {
            throw new common_1.BadRequestException(`User already has active role: ${role}`);
        }
        await this.prisma.userRole.create({
            data: {
                userId,
                role,
                contextId: contextId ?? null,
                grantedBy,
            },
        });
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: true },
        });
    }
    async revokeRole(userId, roleId, revokedBy) {
        const userRole = await this.prisma.userRole.findUnique({
            where: { id: roleId },
        });
        if (!userRole) {
            throw new common_1.NotFoundException(`Role assignment ${roleId} not found`);
        }
        if (userRole.userId !== userId) {
            throw new common_1.NotFoundException(`Role ${roleId} does not belong to user ${userId}`);
        }
        await this.prisma.userRole.update({
            where: { id: roleId },
            data: {
                isActive: false,
                revokedAt: new Date(),
            },
        });
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: true },
        });
    }
    async listUsers(page = 1, limit = 20, roleFilter) {
        const skip = (page - 1) * limit;
        const where = roleFilter
            ? {
                roles: {
                    some: {
                        role: roleFilter,
                        isActive: true,
                    },
                },
            }
            : {};
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                include: { roles: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        return user;
    }
    async getKycQueue(status, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = { status: status || 'PENDING_KYC' };
        const [data, total] = await Promise.all([
            this.prisma.vendorProfile.findMany({
                where,
                include: {
                    user: { select: { id: true, phone: true, name: true } },
                    categories: { include: { category: { select: { id: true, name: true } } } },
                    serviceAreas: { include: { market: { select: { id: true, city: true } } } },
                    kycDocuments: true,
                    _count: { select: { photos: true } },
                },
                skip,
                take: limit,
                orderBy: { submittedAt: 'asc' },
            }),
            this.prisma.vendorProfile.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getVendorDetail(vendorId) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            include: {
                user: true,
                categories: { include: { category: true } },
                photos: { orderBy: { sortOrder: 'asc' } },
                serviceAreas: { include: { market: true } },
                kycDocuments: true,
                subscription: { include: { plan: true } },
            },
        });
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
        }
        return vendor;
    }
    async reviewKyc(vendorId, dto, adminUserId) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
        }
        if (vendor.status !== 'PENDING_KYC') {
            throw new common_1.BadRequestException(`Vendor status is ${vendor.status}, expected PENDING_KYC`);
        }
        if (dto.action === review_kyc_dto_1.KycAction.REJECT && !dto.rejectionReason?.trim()) {
            throw new common_1.BadRequestException('rejectionReason is required when rejecting a KYC application');
        }
        const updateData = dto.action === review_kyc_dto_1.KycAction.APPROVE
            ? {
                status: 'APPROVED',
                approvedAt: new Date(),
                rejectionReason: null,
            }
            : {
                status: 'REJECTED',
                rejectionReason: dto.rejectionReason,
            };
        const [updatedVendor] = await this.prisma.$transaction([
            this.prisma.vendorProfile.update({
                where: { id: vendorId },
                data: updateData,
                include: { user: { select: { id: true, phone: true, name: true } } },
            }),
            this.prisma.adminNotification.create({
                data: {
                    type: 'KYC_REVIEW',
                    title: `KYC ${dto.action === review_kyc_dto_1.KycAction.APPROVE ? 'Approved' : 'Rejected'}: ${vendor.businessName}`,
                    message: dto.action === review_kyc_dto_1.KycAction.APPROVE
                        ? `Vendor "${vendor.businessName}" KYC approved by admin`
                        : `Vendor "${vendor.businessName}" KYC rejected: ${dto.rejectionReason}`,
                    referenceId: vendorId,
                },
            }),
        ]);
        return updatedVendor;
    }
    async suspendVendor(vendorId) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
        }
        return this.prisma.vendorProfile.update({
            where: { id: vendorId },
            data: { status: 'SUSPENDED' },
            include: { user: { select: { id: true, phone: true, name: true } } },
        });
    }
    async reactivateVendor(vendorId) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
        }
        if (vendor.status !== 'SUSPENDED') {
            throw new common_1.BadRequestException(`Vendor status is ${vendor.status}, expected SUSPENDED for reactivation`);
        }
        return this.prisma.vendorProfile.update({
            where: { id: vendorId },
            data: { status: 'APPROVED' },
            include: { user: { select: { id: true, phone: true, name: true } } },
        });
    }
    async listVendors(status, role, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (role)
            where.role = role;
        const [data, total] = await Promise.all([
            this.prisma.vendorProfile.findMany({
                where,
                include: {
                    user: { select: { id: true, phone: true, name: true } },
                    subscription: { select: { status: true, plan: { select: { name: true, tier: true } } } },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.vendorProfile.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    async createCategory(dto) {
        const slug = this.generateSlug(dto.name);
        const existing = await this.prisma.eventCategory.findFirst({
            where: { OR: [{ name: dto.name }, { slug }] },
        });
        if (existing) {
            throw new common_1.ConflictException(`Category with name "${dto.name}" already exists`);
        }
        if (dto.parentId) {
            const parent = await this.prisma.eventCategory.findUnique({
                where: { id: dto.parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException(`Parent category ${dto.parentId} not found`);
            }
        }
        return this.prisma.eventCategory.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description,
                parentId: dto.parentId,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async updateCategory(categoryId, dto) {
        const category = await this.prisma.eventCategory.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category ${categoryId} not found`);
        }
        const updateData = {};
        if (dto.name !== undefined) {
            const slug = this.generateSlug(dto.name);
            const existing = await this.prisma.eventCategory.findFirst({
                where: {
                    OR: [{ name: dto.name }, { slug }],
                    NOT: { id: categoryId },
                },
            });
            if (existing) {
                let uniqueSlug = slug;
                let suffix = 2;
                while (true) {
                    const conflict = await this.prisma.eventCategory.findUnique({
                        where: { slug: uniqueSlug },
                    });
                    if (!conflict || conflict.id === categoryId)
                        break;
                    uniqueSlug = `${slug}-${suffix}`;
                    suffix++;
                }
                if (existing.name === dto.name) {
                    throw new common_1.ConflictException(`Category with name "${dto.name}" already exists`);
                }
                updateData.slug = uniqueSlug;
            }
            else {
                updateData.slug = slug;
            }
            updateData.name = dto.name;
        }
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.parentId !== undefined)
            updateData.parentId = dto.parentId;
        if (dto.sortOrder !== undefined)
            updateData.sortOrder = dto.sortOrder;
        if (dto.isActive !== undefined)
            updateData.isActive = dto.isActive;
        return this.prisma.eventCategory.update({
            where: { id: categoryId },
            data: updateData,
        });
    }
    async listCategories(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        return this.prisma.eventCategory.findMany({
            where,
            include: {
                parent: { select: { id: true, name: true } },
                children: { select: { id: true, name: true, slug: true, isActive: true } },
                _count: { select: { vendors: true } },
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async getCategoryDetail(categoryId) {
        const category = await this.prisma.eventCategory.findUnique({
            where: { id: categoryId },
            include: {
                parent: { select: { id: true, name: true } },
                children: { select: { id: true, name: true, slug: true, isActive: true, sortOrder: true } },
                _count: { select: { vendors: true } },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category ${categoryId} not found`);
        }
        return category;
    }
    async createPlan(dto) {
        const existing = await this.prisma.subscriptionPlan.findUnique({
            where: {
                vendorRole_tier: {
                    vendorRole: dto.vendorRole,
                    tier: dto.tier,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Plan for ${dto.vendorRole} ${dto.tier} already exists`);
        }
        return this.prisma.subscriptionPlan.create({
            data: {
                name: dto.name,
                vendorRole: dto.vendorRole,
                tier: dto.tier,
                amountPaise: dto.amountPaise,
                periodMonths: dto.periodMonths ?? 1,
                features: dto.features
                    ? dto.features
                    : undefined,
            },
        });
    }
    async updatePlan(planId, dto) {
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Plan ${planId} not found`);
        }
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.features !== undefined)
            updateData.features = dto.features;
        if (dto.isActive !== undefined)
            updateData.isActive = dto.isActive;
        if (dto.amountPaise !== undefined) {
            updateData.amountPaise = dto.amountPaise;
            if (plan.razorpayPlanId && dto.amountPaise !== plan.amountPaise) {
                updateData.razorpayPlanId = null;
            }
        }
        return this.prisma.subscriptionPlan.update({
            where: { id: planId },
            data: updateData,
        });
    }
    async listPlans(vendorRole, includeInactive = false) {
        const where = {};
        if (vendorRole)
            where.vendorRole = vendorRole;
        if (!includeInactive)
            where.isActive = true;
        return this.prisma.subscriptionPlan.findMany({
            where,
            include: {
                _count: { select: { subscriptions: true } },
            },
            orderBy: [{ vendorRole: 'asc' }, { tier: 'asc' }],
        });
    }
    async getPlanDetail(planId) {
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: planId },
            include: {
                _count: { select: { subscriptions: true } },
            },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Plan ${planId} not found`);
        }
        return plan;
    }
    async getNotifications(page = 1, limit = 20, unreadOnly = false) {
        const skip = (page - 1) * limit;
        const where = unreadOnly ? { isRead: false } : {};
        const [data, total, unreadCount] = await Promise.all([
            this.prisma.adminNotification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.adminNotification.count({ where }),
            this.prisma.adminNotification.count({ where: { isRead: false } }),
        ]);
        return { data, total, unreadCount, page, totalPages: Math.ceil(total / limit) };
    }
    async markNotificationRead(notificationId) {
        const notification = await this.prisma.adminNotification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification ${notificationId} not found`);
        }
        return this.prisma.adminNotification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
    async markAllNotificationsRead() {
        const result = await this.prisma.adminNotification.updateMany({
            where: { isRead: false },
            data: { isRead: true },
        });
        return { count: result.count };
    }
    async getUnreadCount() {
        const count = await this.prisma.adminNotification.count({
            where: { isRead: false },
        });
        return { unreadCount: count };
    }
    async getPaymentLog(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.type) {
            where.type = filters.type;
        }
        if (filters.dateFrom || filters.dateTo) {
            where.createdAt = {};
            if (filters.dateFrom)
                where.createdAt.gte = new Date(filters.dateFrom);
            if (filters.dateTo)
                where.createdAt.lte = new Date(filters.dateTo);
        }
        if (filters.vendorId) {
            where.OR = [
                { booking: { vendorId: filters.vendorId } },
                { vendorSubscription: { vendorId: filters.vendorId } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    booking: {
                        select: {
                            id: true,
                            vendor: {
                                select: { id: true, businessName: true },
                            },
                            customer: {
                                select: { id: true, name: true, phone: true },
                            },
                        },
                    },
                    vendorSubscription: {
                        select: {
                            vendor: {
                                select: { id: true, businessName: true },
                            },
                        },
                    },
                },
            }),
            this.prisma.transaction.count({ where }),
        ]);
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
    async initiateRefund(dto) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: dto.transactionId },
            include: { booking: true },
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction ${dto.transactionId} not found`);
        }
        if (transaction.type !== 'BOOKING_COMMISSION') {
            throw new common_1.BadRequestException(`Transaction type is ${transaction.type}, only BOOKING_COMMISSION can be refunded`);
        }
        if (transaction.status !== 'PAID') {
            throw new common_1.BadRequestException(`Transaction status is ${transaction.status}, expected PAID`);
        }
        if (dto.amountPaise && dto.amountPaise > transaction.amountPaise) {
            throw new common_1.BadRequestException(`Refund amount (${dto.amountPaise}) exceeds transaction amount (${transaction.amountPaise})`);
        }
        if (!transaction.razorpayPaymentId) {
            throw new common_1.BadRequestException('Transaction has no Razorpay payment ID — cannot process refund');
        }
        const refundResult = await this.razorpayService.createRefund(transaction.razorpayPaymentId, {
            amount: dto.amountPaise || transaction.amountPaise,
            notes: { reason: dto.reason, initiatedBy: 'admin' },
        });
        await this.prisma.transaction.update({
            where: { id: dto.transactionId },
            data: { status: 'REFUNDED' },
        });
        if (transaction.bookingId) {
            await this.prisma.booking.update({
                where: { id: transaction.bookingId },
                data: { paymentStatus: 'REFUNDED' },
            });
        }
        return refundResult;
    }
    async getReconciliation() {
        const totals = await this.prisma.transaction.groupBy({
            by: ['type'],
            _sum: { amountPaise: true, commissionPaise: true, netPayoutPaise: true },
            _count: true,
            where: { status: 'PAID' },
        });
        const payoutBreakdown = await this.prisma.transaction.groupBy({
            by: ['payoutStatus'],
            _sum: { netPayoutPaise: true },
            _count: true,
            where: { type: 'BOOKING_COMMISSION', status: 'PAID' },
        });
        return {
            revenueByStream: totals.map((t) => ({
                type: t.type,
                count: t._count,
                totalAmountPaise: t._sum.amountPaise,
                totalCommissionPaise: t._sum.commissionPaise,
                totalNetPayoutPaise: t._sum.netPayoutPaise,
            })),
            payoutBreakdown: payoutBreakdown.map((p) => ({
                status: p.payoutStatus,
                count: p._count,
                totalPaise: p._sum.netPayoutPaise,
            })),
        };
    }
    async createCommissionRate(dto) {
        if (dto.categoryId) {
            const category = await this.prisma.eventCategory.findUnique({
                where: { id: dto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category ${dto.categoryId} not found`);
            }
        }
        return this.prisma.commissionRate.create({
            data: {
                categoryId: dto.categoryId || null,
                vendorRole: dto.vendorRole || null,
                rateBps: dto.rateBps,
                effectiveFrom: dto.effectiveFrom
                    ? new Date(dto.effectiveFrom)
                    : new Date(),
                effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
            },
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async updateCommissionRate(id, dto) {
        const rate = await this.prisma.commissionRate.findUnique({
            where: { id },
        });
        if (!rate) {
            throw new common_1.NotFoundException(`Commission rate ${id} not found`);
        }
        const updates = {};
        if (dto.rateBps !== undefined)
            updates.rateBps = dto.rateBps;
        if (dto.effectiveTo !== undefined)
            updates.effectiveTo = new Date(dto.effectiveTo);
        return this.prisma.commissionRate.update({
            where: { id },
            data: updates,
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async listCommissionRates(categoryId, vendorRole) {
        const where = {};
        if (categoryId)
            where.categoryId = categoryId;
        if (vendorRole)
            where.vendorRole = vendorRole;
        return this.prisma.commissionRate.findMany({
            where,
            orderBy: [
                { categoryId: { sort: 'desc', nulls: 'last' } },
                { vendorRole: { sort: 'desc', nulls: 'last' } },
                { effectiveFrom: 'desc' },
            ],
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async deleteCommissionRate(id) {
        const rate = await this.prisma.commissionRate.findUnique({
            where: { id },
        });
        if (!rate) {
            throw new common_1.NotFoundException(`Commission rate ${id} not found`);
        }
        return this.prisma.commissionRate.update({
            where: { id },
            data: { effectiveTo: new Date() },
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async getAnalyticsDashboard(query) {
        const since = query.dateFrom
            ? new Date(query.dateFrom)
            : new Date(Date.now() - 24 * 60 * 60 * 1000);
        const until = query.dateTo ? new Date(query.dateTo) : new Date();
        const [leadsPerCityRaw, funnelRaw, revenueRaw, activeVendorCount] = await Promise.all([
            this.prisma.lead.groupBy({
                by: ['city'],
                _count: { id: true },
                where: { createdAt: { gte: since, lte: until } },
                orderBy: { _count: { id: 'desc' } },
            }),
            this.prisma.lead.groupBy({
                by: ['status'],
                _count: { id: true },
                where: { createdAt: { gte: since, lte: until } },
            }),
            this.prisma.transaction.groupBy({
                by: ['type'],
                _sum: { amountPaise: true, commissionPaise: true },
                _count: { id: true },
                where: { status: 'PAID', createdAt: { gte: since, lte: until } },
            }),
            this.prisma.vendorProfile.count({
                where: {
                    status: 'APPROVED',
                    subscription: { status: { in: ['ACTIVE', 'AUTHENTICATED'] } },
                },
            }),
        ]);
        const funnelMap = new Map(funnelRaw.map((r) => [r.status, r._count.id]));
        const conversionFunnel = AdminService_1.FUNNEL_ORDER.map((status) => ({
            status,
            count: funnelMap.get(status) ?? 0,
        }));
        const revenueByStream = revenueRaw.map((r) => ({
            type: r.type,
            count: r._count.id,
            totalAmountPaise: r._sum.amountPaise ?? 0,
        }));
        return {
            window: { from: since, to: until },
            leadsPerCity: leadsPerCityRaw.map((r) => ({
                city: r.city,
                count: r._count.id,
            })),
            conversionFunnel,
            revenueByStream,
            activeVendorCount,
        };
    }
    async getLeadRoutingTrace(leadId) {
        const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead)
            throw new common_1.NotFoundException(`Lead ${leadId} not found`);
        const [traces, assignments] = await Promise.all([
            this.prisma.leadRoutingTrace.findMany({
                where: { leadId },
                include: { vendor: { select: { id: true, businessName: true } } },
                orderBy: [{ selected: 'desc' }, { score: 'desc' }],
            }),
            this.prisma.leadAssignment.findMany({
                where: { leadId },
                select: { vendorId: true, status: true, notifiedAt: true },
            }),
        ]);
        return { leadId, traces, assignments };
    }
    async overrideRouting(leadId, dto, adminId) {
        const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead)
            throw new common_1.NotFoundException(`Lead ${leadId} not found`);
        if (['BOOKED', 'COMPLETED', 'CANCELLED'].includes(lead.status)) {
            throw new common_1.BadRequestException(`Cannot override routing for lead with status ${lead.status}`);
        }
        const result = await this.prisma.$transaction(async (tx) => {
            await tx.leadAssignment.updateMany({
                where: { leadId, status: { in: ['PENDING', 'NOTIFIED'] } },
                data: { status: 'CANCELLED' },
            });
            await tx.leadAssignment.create({
                data: {
                    leadId,
                    vendorId: dto.vendorId,
                    score: null,
                    status: 'PENDING',
                },
            });
            await tx.leadRoutingTrace.upsert({
                where: { leadId_vendorId: { leadId, vendorId: dto.vendorId } },
                create: {
                    leadId,
                    vendorId: dto.vendorId,
                    score: 0,
                    scoreFactors: {},
                    selected: true,
                    overriddenAt: new Date(),
                    overriddenBy: adminId,
                    overrideReason: dto.reason ?? 'Admin override',
                },
                update: {
                    selected: true,
                    overriddenAt: new Date(),
                    overriddenBy: adminId,
                    overrideReason: dto.reason ?? 'Admin override',
                },
            });
            return { success: true, leadId, overrideVendorId: dto.vendorId };
        });
        this.notificationService
            .sendPushToVendor(dto.vendorId, {
            leadId,
            eventType: lead.eventType,
            city: lead.city,
        })
            .catch((err) => this.logger.error(`Override push notification failed: ${err.message}`));
        return result;
    }
    async listMarkets() {
        return this.prisma.market.findMany({
            select: {
                id: true,
                city: true,
                state: true,
                status: true,
                launchDate: true,
            },
            orderBy: { city: 'asc' },
        });
    }
    async updateMarketStatus(marketId, dto) {
        const market = await this.prisma.market.findUnique({
            where: { id: marketId },
        });
        if (!market)
            throw new common_1.NotFoundException(`Market ${marketId} not found`);
        return this.prisma.market.update({
            where: { id: marketId },
            data: { status: dto.status },
            select: {
                id: true,
                city: true,
                state: true,
                status: true,
                launchDate: true,
            },
        });
    }
};
exports.AdminService = AdminService;
AdminService.FUNNEL_ORDER = [
    'PENDING',
    'ROUTING',
    'ROUTED',
    'NOTIFIED',
    'QUOTES_RECEIVED',
    'BOOKED',
    'COMPLETED',
    'CANCELLED',
];
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        razorpay_service_1.RazorpayService,
        notification_service_1.NotificationService])
], AdminService);
//# sourceMappingURL=admin.service.js.map