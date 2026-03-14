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
var QuoteService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
let QuoteService = QuoteService_1 = class QuoteService {
    constructor(prisma, quoteExpiryQueue) {
        this.prisma = prisma;
        this.quoteExpiryQueue = quoteExpiryQueue;
        this.logger = new common_1.Logger(QuoteService_1.name);
    }
    async createOrUpdateQuote(leadId, vendorId, dto) {
        const totalPaise = dto.lineItems.reduce((sum, item) => sum + item.amountPaise * (item.quantity ?? 1), 0);
        const existingQuote = await this.prisma.quote.findUnique({
            where: { leadId_vendorId: { leadId, vendorId } },
        });
        if (existingQuote) {
            if (existingQuote.status !== 'DRAFT') {
                throw new common_1.BadRequestException('Quote already submitted — cannot edit');
            }
            await this.prisma.$transaction(async (tx) => {
                await tx.quoteLineItem.deleteMany({
                    where: { quoteId: existingQuote.id },
                });
                await tx.quote.update({
                    where: { id: existingQuote.id },
                    data: {
                        totalPaise,
                        validUntil: dto.validUntil,
                        note: dto.note ?? null,
                        lineItems: {
                            create: dto.lineItems.map((item) => ({
                                description: item.description,
                                amountPaise: item.amountPaise,
                                quantity: item.quantity ?? 1,
                            })),
                        },
                    },
                });
            });
            return this.prisma.quote.findUnique({
                where: { id: existingQuote.id },
                include: { lineItems: true },
            });
        }
        return this.prisma.quote.create({
            data: {
                leadId,
                vendorId,
                status: 'DRAFT',
                totalPaise,
                validUntil: dto.validUntil,
                note: dto.note ?? null,
                lineItems: {
                    create: dto.lineItems.map((item) => ({
                        description: item.description,
                        amountPaise: item.amountPaise,
                        quantity: item.quantity ?? 1,
                    })),
                },
            },
            include: { lineItems: true },
        });
    }
    async submitQuote(quoteId, vendorId) {
        const quote = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.quote.updateMany({
                where: { id: quoteId, vendorId, status: 'DRAFT' },
                data: { status: 'SUBMITTED', submittedAt: new Date() },
            });
            if (updated.count === 0) {
                throw new common_1.BadRequestException('Quote not found, not in DRAFT status, or does not belong to this vendor');
            }
            const q = await tx.quote.findUnique({
                where: { id: quoteId },
                include: { lineItems: true },
            });
            if (!q) {
                throw new common_1.BadRequestException('Quote not found after update');
            }
            const submittedCount = await tx.quote.count({
                where: {
                    leadId: q.leadId,
                    status: 'SUBMITTED',
                    id: { not: quoteId },
                },
            });
            if (submittedCount === 0) {
                await tx.lead.update({
                    where: { id: q.leadId },
                    data: { status: 'QUOTES_RECEIVED' },
                });
                this.logger.log(`Lead ${q.leadId} status → QUOTES_RECEIVED (first quote submitted)`);
            }
            return q;
        });
        const delayMs = Math.max(0, quote.validUntil.getTime() - Date.now());
        await this.quoteExpiryQueue.add('expire-quote', { quoteId: quote.id }, {
            delay: delayMs,
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
        });
        this.logger.log(`Quote ${quoteId} submitted — expiry job enqueued with delay ${delayMs}ms`);
        return quote;
    }
    async acceptQuote(quoteId, customerId) {
        const booking = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.quote.updateMany({
                where: { id: quoteId, status: 'SUBMITTED' },
                data: { status: 'ACCEPTED' },
            });
            if (updated.count === 0) {
                throw new common_1.BadRequestException('Quote not found or not in SUBMITTED status');
            }
            const acceptedQuote = await tx.quote.findUnique({
                where: { id: quoteId },
                include: { lead: true },
            });
            if (!acceptedQuote) {
                throw new common_1.BadRequestException('Quote not found after update');
            }
            if (acceptedQuote.lead.customerId !== customerId) {
                throw new common_1.ForbiddenException('This lead does not belong to you');
            }
            await tx.quote.updateMany({
                where: {
                    leadId: acceptedQuote.leadId,
                    id: { not: quoteId },
                    status: 'SUBMITTED',
                },
                data: { status: 'REJECTED' },
            });
            const newBooking = await tx.booking.create({
                data: {
                    leadId: acceptedQuote.leadId,
                    quoteId,
                    customerId,
                    vendorId: acceptedQuote.vendorId,
                    status: 'BOOKED',
                },
            });
            await tx.bookingStatusHistory.create({
                data: {
                    bookingId: newBooking.id,
                    fromStatus: null,
                    toStatus: 'BOOKED',
                },
            });
            await tx.lead.update({
                where: { id: acceptedQuote.leadId },
                data: { status: 'BOOKED' },
            });
            this.logger.log(`Quote ${quoteId} accepted — Booking ${newBooking.id} created for Lead ${acceptedQuote.leadId}`);
            return newBooking;
        });
        const acceptedQuote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            select: { vendorId: true },
        });
        if (acceptedQuote) {
            await this.prisma.vendorStats.update({
                where: { vendorId: acceptedQuote.vendorId },
                data: { totalLeadsWon: { increment: 1 } },
            });
            this.logger.log(`VendorStats.totalLeadsWon incremented for vendor ${acceptedQuote.vendorId}`);
        }
        return booking;
    }
    async getQuotesForLead(leadId, customerId) {
        const lead = await this.prisma.lead.findUnique({
            where: { id: leadId },
            select: { customerId: true },
        });
        if (!lead) {
            throw new common_1.BadRequestException('Lead not found');
        }
        if (lead.customerId !== customerId) {
            throw new common_1.ForbiddenException('This lead does not belong to you');
        }
        return this.prisma.quote.findMany({
            where: { leadId, status: 'SUBMITTED' },
            include: {
                lineItems: true,
                vendor: {
                    select: { businessName: true },
                },
            },
            orderBy: { totalPaise: 'asc' },
        });
    }
};
exports.QuoteService = QuoteService;
exports.QuoteService = QuoteService = QuoteService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('quote-expiry')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], QuoteService);
//# sourceMappingURL=quote.service.js.map