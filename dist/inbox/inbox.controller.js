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
exports.InboxController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const vendor_owner_guard_1 = require("../vendor/guards/vendor-owner.guard");
const decline_lead_dto_1 = require("./dto/decline-lead.dto");
const inbox_service_1 = require("./inbox.service");
let InboxController = class InboxController {
    constructor(inboxService) {
        this.inboxService = inboxService;
    }
    getInbox(req, page, limit) {
        return this.inboxService.getInbox(req.vendorId, page, limit);
    }
    acceptLead(assignmentId, req) {
        return this.inboxService.acceptLead(assignmentId, req.vendorId);
    }
    declineLead(assignmentId, req, dto) {
        return this.inboxService.declineLead(assignmentId, req.vendorId, dto.reason);
    }
};
exports.InboxController = InboxController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], InboxController.prototype, "getInbox", null);
__decorate([
    (0, common_1.Patch)('assignments/:id/accept'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InboxController.prototype, "acceptLead", null);
__decorate([
    (0, common_1.Patch)('assignments/:id/decline'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, decline_lead_dto_1.DeclineLeadDto]),
    __metadata("design:returntype", void 0)
], InboxController.prototype, "declineLead", null);
exports.InboxController = InboxController = __decorate([
    (0, swagger_1.ApiTags)('Vendor Inbox'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('inbox'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('VENDOR'),
    __metadata("design:paramtypes", [inbox_service_1.InboxService])
], InboxController);
//# sourceMappingURL=inbox.controller.js.map