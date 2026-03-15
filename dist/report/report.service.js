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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportService = class ReportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReport(reporterId, dto) {
        return this.prisma.report.create({
            data: {
                reporterId,
                targetType: dto.targetType,
                targetId: dto.targetId,
                reason: dto.reason,
                description: dto.description,
            },
            select: {
                id: true,
                targetType: true,
                targetId: true,
                reason: true,
                status: true,
                createdAt: true,
            },
        });
    }
    async listReports(status, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        const [reports, total] = await Promise.all([
            this.prisma.report.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    targetType: true,
                    targetId: true,
                    reason: true,
                    description: true,
                    status: true,
                    adminNote: true,
                    reviewedBy: true,
                    reviewedAt: true,
                    createdAt: true,
                    reporter: { select: { id: true, name: true, phone: true } },
                },
            }),
            this.prisma.report.count({ where }),
        ]);
        return {
            data: reports,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async reviewReport(id, adminId, dto) {
        const report = await this.prisma.report.findUnique({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        return this.prisma.report.update({
            where: { id },
            data: {
                status: dto.status,
                adminNote: dto.adminNote,
                reviewedBy: adminId,
                reviewedAt: new Date(),
            },
            select: {
                id: true,
                status: true,
                adminNote: true,
                reviewedBy: true,
                reviewedAt: true,
            },
        });
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportService);
//# sourceMappingURL=report.service.js.map