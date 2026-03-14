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
var LeadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const routing_constants_1 = require("../routing/routing.constants");
let LeadService = LeadService_1 = class LeadService {
    constructor(prisma, routingQueue) {
        this.prisma = prisma;
        this.routingQueue = routingQueue;
        this.logger = new common_1.Logger(LeadService_1.name);
    }
    async createInquiry(customerId, dto, ipAddress, userAgent) {
        if (!dto.consentGiven) {
            throw new common_1.BadRequestException('Consent is required to submit an inquiry');
        }
        if (!dto.targetVendorId && !dto.categoryId) {
            throw new common_1.BadRequestException('Either targetVendorId or categoryId must be provided');
        }
        if (dto.targetVendorId && dto.categoryId) {
            throw new common_1.BadRequestException('Provide either targetVendorId or categoryId, not both');
        }
        const market = await this.prisma.market.findFirst({
            where: { city: { equals: dto.city, mode: 'insensitive' } },
        });
        if (!market) {
            throw new common_1.BadRequestException("We don't serve this city yet");
        }
        if (dto.targetVendorId) {
            const vendor = await this.prisma.vendorProfile.findUnique({
                where: { id: dto.targetVendorId },
                include: { subscription: true },
            });
            if (!vendor || vendor.status !== 'APPROVED') {
                throw new common_1.NotFoundException('Vendor not found or not approved');
            }
            if (!vendor.subscription ||
                !['ACTIVE', 'AUTHENTICATED'].includes(vendor.subscription.status)) {
                throw new common_1.NotFoundException('Vendor does not have an active subscription');
            }
        }
        const consentLog = await this.prisma.consentLog.create({
            data: {
                userId: customerId,
                consentType: 'LEAD_CREATION',
                status: 'GRANTED',
                ipAddress,
                userAgent,
            },
        });
        const lead = await this.prisma.lead.create({
            data: {
                customerId,
                eventType: dto.eventType,
                eventDate: new Date(dto.eventDate),
                city: dto.city,
                latitude: market.latitude,
                longitude: market.longitude,
                budget: dto.budget,
                guestCount: dto.guestCount,
                targetVendorId: dto.targetVendorId ?? null,
                categoryId: dto.categoryId ?? null,
                status: 'PENDING',
                consentLogId: consentLog.id,
            },
        });
        const mode = dto.targetVendorId ? 'A' : 'B';
        await this.routingQueue.add(routing_constants_1.ROUTE_LEAD_JOB, { leadId: lead.id, mode }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
        });
        this.logger.log(`Lead created: ${lead.id}, mode=${mode}, city=${dto.city} — routing job enqueued`);
        return {
            leadId: lead.id,
            status: 'PENDING',
            message: 'Your inquiry has been received. We are matching you with the best vendors.',
            createdAt: lead.createdAt,
        };
    }
    async getMyInquiries(customerId, page, limit) {
        const skip = (page - 1) * limit;
        const [leads, total] = await Promise.all([
            this.prisma.lead.findMany({
                where: { customerId },
                include: {
                    category: { select: { name: true, slug: true } },
                    targetVendor: { select: { businessName: true } },
                    assignments: {
                        select: {
                            id: true,
                            score: true,
                            status: true,
                            vendor: { select: { businessName: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.lead.count({ where: { customerId } }),
        ]);
        return {
            data: leads.map((lead) => ({
                id: lead.id,
                eventType: lead.eventType,
                eventDate: lead.eventDate,
                city: lead.city,
                budget: lead.budget,
                guestCount: lead.guestCount,
                status: lead.status,
                category: lead.category,
                targetVendor: lead.targetVendor
                    ? { businessName: lead.targetVendor.businessName }
                    : null,
                assignments: lead.assignments.map((a) => ({
                    id: a.id,
                    vendorName: a.vendor.businessName,
                    score: a.score,
                    status: a.status,
                })),
                createdAt: lead.createdAt,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.LeadService = LeadService;
exports.LeadService = LeadService = LeadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(routing_constants_1.LEAD_ROUTING_QUEUE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], LeadService);
//# sourceMappingURL=lead.service.js.map