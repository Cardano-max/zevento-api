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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const admin_service_1 = require("./admin.service");
const analytics_query_dto_1 = require("./dto/analytics-query.dto");
const initiate_refund_dto_1 = require("./dto/initiate-refund.dto");
const manage_category_dto_1 = require("./dto/manage-category.dto");
const manage_commission_dto_1 = require("./dto/manage-commission.dto");
const manage_plan_dto_1 = require("./dto/manage-plan.dto");
const manage_role_dto_1 = require("./dto/manage-role.dto");
const market_status_dto_1 = require("./dto/market-status.dto");
const review_kyc_dto_1 = require("./dto/review-kyc.dto");
const routing_override_dto_1 = require("./dto/routing-override.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async listUsers(page = '1', limit = '20', role) {
        return this.adminService.listUsers(parseInt(page, 10), parseInt(limit, 10), role);
    }
    async getUser(id) {
        return this.adminService.getUser(id);
    }
    async assignRole(userId, dto, currentUser) {
        return this.adminService.assignRole(userId, dto.role, currentUser.id, dto.contextId);
    }
    async revokeRole(userId, roleId, currentUser) {
        return this.adminService.revokeRole(userId, roleId, currentUser.id);
    }
    async listVendors(status, role, page = '1', limit = '20') {
        return this.adminService.listVendors(status, role, parseInt(page, 10), parseInt(limit, 10));
    }
    async getKycQueue(status, page = '1', limit = '20') {
        return this.adminService.getKycQueue(status, parseInt(page, 10), parseInt(limit, 10));
    }
    async getVendorDetail(vendorId) {
        return this.adminService.getVendorDetail(vendorId);
    }
    async reviewKyc(vendorId, dto, currentUser) {
        return this.adminService.reviewKyc(vendorId, dto, currentUser.id);
    }
    async suspendVendor(vendorId) {
        return this.adminService.suspendVendor(vendorId);
    }
    async reactivateVendor(vendorId) {
        return this.adminService.reactivateVendor(vendorId);
    }
    async createCategory(dto) {
        return this.adminService.createCategory(dto);
    }
    async updateCategory(categoryId, dto) {
        return this.adminService.updateCategory(categoryId, dto);
    }
    async listCategories(includeInactive) {
        return this.adminService.listCategories(includeInactive === 'true');
    }
    async getCategoryDetail(categoryId) {
        return this.adminService.getCategoryDetail(categoryId);
    }
    async createPlan(dto) {
        return this.adminService.createPlan(dto);
    }
    async updatePlan(planId, dto) {
        return this.adminService.updatePlan(planId, dto);
    }
    async listPlans(vendorRole, includeInactive) {
        return this.adminService.listPlans(vendorRole, includeInactive === 'true');
    }
    async getPlanDetail(planId) {
        return this.adminService.getPlanDetail(planId);
    }
    async getNotifications(page = '1', limit = '20', unreadOnly) {
        return this.adminService.getNotifications(parseInt(page, 10), parseInt(limit, 10), unreadOnly === 'true');
    }
    async getUnreadCount() {
        return this.adminService.getUnreadCount();
    }
    async markNotificationRead(notificationId) {
        return this.adminService.markNotificationRead(notificationId);
    }
    async markAllNotificationsRead() {
        return this.adminService.markAllNotificationsRead();
    }
    async getPaymentLog(page = '1', limit = '20', dateFrom, dateTo, vendorId, type) {
        return this.adminService.getPaymentLog(parseInt(page, 10), parseInt(limit, 10), { dateFrom, dateTo, vendorId, type });
    }
    async initiateRefund(dto) {
        return this.adminService.initiateRefund(dto);
    }
    async getReconciliation() {
        return this.adminService.getReconciliation();
    }
    async createCommissionRate(dto) {
        return this.adminService.createCommissionRate(dto);
    }
    async updateCommissionRate(id, dto) {
        return this.adminService.updateCommissionRate(id, dto);
    }
    async listCommissionRates(categoryId, vendorRole) {
        return this.adminService.listCommissionRates(categoryId, vendorRole);
    }
    async deleteCommissionRate(id) {
        return this.adminService.deleteCommissionRate(id);
    }
    async getAnalyticsDashboard(query) {
        return this.adminService.getAnalyticsDashboard(query);
    }
    async getLeadRoutingTrace(leadId) {
        return this.adminService.getLeadRoutingTrace(leadId);
    }
    async overrideRouting(leadId, dto, currentUser) {
        return this.adminService.overrideRouting(leadId, dto, currentUser.id);
    }
    async listMarkets() {
        return this.adminService.listMarkets();
    }
    async updateMarketStatus(marketId, dto) {
        return this.adminService.updateMarketStatus(marketId, dto);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)('users/:id/roles'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, manage_role_dto_1.AssignRoleDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Delete)('users/:id/roles/:roleId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "revokeRole", null);
__decorate([
    (0, common_1.Get)('vendors'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('role')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listVendors", null);
__decorate([
    (0, common_1.Get)('vendors/kyc-queue'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getKycQueue", null);
__decorate([
    (0, common_1.Get)('vendors/:vendorId'),
    __param(0, (0, common_1.Param)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVendorDetail", null);
__decorate([
    (0, common_1.Post)('vendors/:vendorId/kyc-review'),
    __param(0, (0, common_1.Param)('vendorId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_kyc_dto_1.ReviewKycDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "reviewKyc", null);
__decorate([
    (0, common_1.Patch)('vendors/:vendorId/suspend'),
    __param(0, (0, common_1.Param)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "suspendVendor", null);
__decorate([
    (0, common_1.Patch)('vendors/:vendorId/reactivate'),
    __param(0, (0, common_1.Param)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "reactivateVendor", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manage_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, manage_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listCategories", null);
__decorate([
    (0, common_1.Get)('categories/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCategoryDetail", null);
__decorate([
    (0, common_1.Post)('subscription-plans'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manage_plan_dto_1.CreatePlanDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Patch)('subscription-plans/:planId'),
    __param(0, (0, common_1.Param)('planId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, manage_plan_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Get)('subscription-plans'),
    __param(0, (0, common_1.Query)('vendorRole')),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listPlans", null);
__decorate([
    (0, common_1.Get)('subscription-plans/:planId'),
    __param(0, (0, common_1.Param)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPlanDetail", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('unreadOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('notifications/unread-count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)('notifications/:notificationId/read'),
    __param(0, (0, common_1.Param)('notificationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markNotificationRead", null);
__decorate([
    (0, common_1.Post)('notifications/mark-all-read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markAllNotificationsRead", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('dateFrom')),
    __param(3, (0, common_1.Query)('dateTo')),
    __param(4, (0, common_1.Query)('vendorId')),
    __param(5, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPaymentLog", null);
__decorate([
    (0, common_1.Post)('payments/refund'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [initiate_refund_dto_1.InitiateRefundDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "initiateRefund", null);
__decorate([
    (0, common_1.Get)('payments/reconciliation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReconciliation", null);
__decorate([
    (0, common_1.Post)('commission-rates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manage_commission_dto_1.CreateCommissionRateDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCommissionRate", null);
__decorate([
    (0, common_1.Patch)('commission-rates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, manage_commission_dto_1.UpdateCommissionRateDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCommissionRate", null);
__decorate([
    (0, common_1.Get)('commission-rates'),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('vendorRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listCommissionRates", null);
__decorate([
    (0, common_1.Delete)('commission-rates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCommissionRate", null);
__decorate([
    (0, common_1.Get)('analytics/dashboard'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnalyticsDashboard", null);
__decorate([
    (0, common_1.Get)('leads/:leadId/routing-trace'),
    __param(0, (0, common_1.Param)('leadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getLeadRoutingTrace", null);
__decorate([
    (0, common_1.Patch)('leads/:leadId/routing-override'),
    __param(0, (0, common_1.Param)('leadId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, routing_override_dto_1.RoutingOverrideDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "overrideRouting", null);
__decorate([
    (0, common_1.Get)('markets'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listMarkets", null);
__decorate([
    (0, common_1.Patch)('markets/:marketId/status'),
    __param(0, (0, common_1.Param)('marketId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, market_status_dto_1.MarketStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateMarketStatus", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map