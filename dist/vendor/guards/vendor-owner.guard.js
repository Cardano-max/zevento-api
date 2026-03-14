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
exports.VendorOwnerGuard = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@zevento/shared");
const prisma_service_1 = require("../../prisma/prisma.service");
let VendorOwnerGuard = class VendorOwnerGuard {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (user.activeRole === shared_1.Role.ADMIN) {
            return true;
        }
        const vendorProfile = await this.prisma.vendorProfile.findUnique({
            where: { userId: user.userId },
            select: { id: true },
        });
        if (!vendorProfile) {
            throw new common_1.NotFoundException('Vendor profile not found. Create a profile first.');
        }
        request.vendorId = vendorProfile.id;
        return true;
    }
};
exports.VendorOwnerGuard = VendorOwnerGuard;
exports.VendorOwnerGuard = VendorOwnerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VendorOwnerGuard);
//# sourceMappingURL=vendor-owner.guard.js.map