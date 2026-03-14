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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const vendor_owner_guard_1 = require("./guards/vendor-owner.guard");
const vendor_service_1 = require("./vendor.service");
const create_profile_dto_1 = require("./dto/create-profile.dto");
const update_portfolio_dto_1 = require("./dto/update-portfolio.dto");
const update_service_area_dto_1 = require("./dto/update-service-area.dto");
const submit_kyc_dto_1 = require("./dto/submit-kyc.dto");
const IMAGE_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DOCUMENT_MIMETYPES = [...IMAGE_MIMETYPES, 'application/pdf'];
function imageFileFilter(_req, file, callback) {
    if (!IMAGE_MIMETYPES.includes(file.mimetype)) {
        return callback(new common_1.BadRequestException('Only image files (JPEG, PNG, WebP) are allowed'), false);
    }
    callback(null, true);
}
function documentFileFilter(_req, file, callback) {
    if (!DOCUMENT_MIMETYPES.includes(file.mimetype)) {
        return callback(new common_1.BadRequestException('Only image files (JPEG, PNG, WebP) and PDF are allowed'), false);
    }
    callback(null, true);
}
let VendorController = class VendorController {
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    createOrGetProfile(user) {
        return this.vendorService.createOrGetProfile(user.userId, user.activeRole);
    }
    updateBusinessDetails(req, dto) {
        return this.vendorService.updateBusinessDetails(req.vendorId, dto);
    }
    uploadPhoto(req, file, dto) {
        if (!file) {
            throw new common_1.BadRequestException('Photo file is required');
        }
        return this.vendorService.uploadPhoto(req.vendorId, file, dto);
    }
    getPhotos(req) {
        return this.vendorService.getPhotos(req.vendorId);
    }
    deletePhoto(req, photoId) {
        return this.vendorService.deletePhoto(req.vendorId, photoId);
    }
    updateServiceAreas(req, dto) {
        return this.vendorService.updateServiceAreas(req.vendorId, dto);
    }
    uploadKycDocument(req, file, dto) {
        if (!file) {
            throw new common_1.BadRequestException('Document file is required');
        }
        return this.vendorService.uploadKycDocument(req.vendorId, file, dto);
    }
    deleteKycDocument(req, docId) {
        return this.vendorService.deleteKycDocument(req.vendorId, docId);
    }
    submitForKyc(req) {
        return this.vendorService.submitForKyc(req.vendorId);
    }
    getMyProfile(user) {
        return this.vendorService.getMyProfile(user.userId);
    }
};
exports.VendorController = VendorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "createOrGetProfile", null);
__decorate([
    (0, common_1.Patch)('business'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_profile_dto_1.CreateProfileDto]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "updateBusinessDetails", null);
__decorate([
    (0, common_1.Post)('photos'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: imageFileFilter,
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, update_portfolio_dto_1.UpdatePortfolioDto]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Get)('photos'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "getPhotos", null);
__decorate([
    (0, common_1.Delete)('photos/:photoId'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('photoId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Put)('service-areas'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_service_area_dto_1.UpdateServiceAreaDto]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "updateServiceAreas", null);
__decorate([
    (0, common_1.Post)('kyc/documents'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('document', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: documentFileFilter,
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, submit_kyc_dto_1.SubmitKycDto]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "uploadKycDocument", null);
__decorate([
    (0, common_1.Delete)('kyc/documents/:docId'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('docId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "deleteKycDocument", null);
__decorate([
    (0, common_1.Post)('kyc/submit'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "submitForKyc", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorController.prototype, "getMyProfile", null);
exports.VendorController = VendorController = __decorate([
    (0, swagger_1.ApiTags)('Vendor Profile'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('vendor/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PLANNER', 'SUPPLIER'),
    __metadata("design:paramtypes", [vendor_service_1.VendorService])
], VendorController);
//# sourceMappingURL=vendor.controller.js.map