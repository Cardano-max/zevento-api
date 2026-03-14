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
var InboxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let InboxService = InboxService_1 = class InboxService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
        this.logger = new common_1.Logger(InboxService_1.name);
    }
    async acceptLead(assignmentId, vendorId) {
        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.leadAssignment.updateMany({
                where: { id: assignmentId, vendorId, status: 'NOTIFIED' },
                data: { status: 'ACCEPTED', respondedAt: new Date() },
            });
            if (updated.count === 0) {
                throw new common_1.BadRequestException('Assignment not found, not in NOTIFIED status, or does not belong to this vendor');
            }
            const assignment = await tx.leadAssignment.findUnique({
                where: { id: assignmentId },
                include: {
                    lead: {
                        include: {
                            customer: {
                                select: { phone: true, id: true },
                            },
                        },
                    },
                },
            });
            if (!assignment) {
                throw new common_1.BadRequestException('Assignment not found after update');
            }
            const customer = assignment.lead.customer;
            await tx.consentLog.create({
                data: {
                    userId: customer.id,
                    consentType: 'PHONE_REVEAL',
                    status: 'GRANTED',
                    metadata: { revealedToVendorId: vendorId },
                },
            });
            return {
                assignmentId,
                phone: customer.phone,
                leadId: assignment.leadId,
            };
        });
        await this.redis.del(`vendor:score:factors:${vendorId}`);
        this.logger.log(`Vendor ${vendorId} accepted assignment ${assignmentId} — phone revealed`);
        return result;
    }
    async declineLead(assignmentId, vendorId, reason) {
        const updated = await this.prisma.leadAssignment.updateMany({
            where: { id: assignmentId, vendorId, status: 'NOTIFIED' },
            data: { status: 'DECLINED', respondedAt: new Date() },
        });
        if (updated.count === 0) {
            throw new common_1.BadRequestException('Assignment not found, not in NOTIFIED status, or does not belong to this vendor');
        }
        await this.redis.del(`vendor:score:factors:${vendorId}`);
        this.logger.log(`Vendor ${vendorId} declined assignment ${assignmentId}: ${reason}`);
        return { assignmentId, status: 'DECLINED' };
    }
    async getInbox(vendorId, page, limit) {
        const skip = (page - 1) * limit;
        const [assignments, total] = await Promise.all([
            this.prisma.leadAssignment.findMany({
                where: { vendorId },
                include: {
                    lead: {
                        select: {
                            id: true,
                            eventType: true,
                            eventDate: true,
                            city: true,
                            budget: true,
                            status: true,
                            quotes: {
                                where: { vendorId },
                                select: { id: true, status: true, totalPaise: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.leadAssignment.count({ where: { vendorId } }),
        ]);
        return { data: assignments, total, page, limit };
    }
};
exports.InboxService = InboxService;
exports.InboxService = InboxService = InboxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], InboxService);
//# sourceMappingURL=inbox.service.js.map