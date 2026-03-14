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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const vendor_owner_guard_1 = require("../vendor/guards/vendor-owner.guard");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const transition_order_status_dto_1 = require("./dto/transition-order-status.dto");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    createOrder(dto, user) {
        return this.orderService.createOrder(user.userId, dto);
    }
    getMyOrders(user, page = '1', limit = '20') {
        return this.orderService.getMyOrders(user.userId, parseInt(page, 10), parseInt(limit, 10));
    }
    getVendorOrders(req, page = '1', limit = '20', status) {
        return this.orderService.getVendorOrders(req.vendorId, parseInt(page, 10), parseInt(limit, 10), status);
    }
    getOrderById(id) {
        return this.orderService.getOrderById(id);
    }
    cancelOrder(id, user) {
        return this.orderService.cancelOrder(id, user.userId, user.activeRole);
    }
    transitionStatus(id, dto, user) {
        return this.orderService.transitionOrderStatus(id, dto, user.userId, user.activeRole);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)('orders'),
    (0, roles_decorator_1.Roles)('PLANNER', 'CUSTOMER'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('orders/mine'),
    (0, roles_decorator_1.Roles)('PLANNER', 'CUSTOMER'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)('orders/vendor'),
    (0, roles_decorator_1.Roles)('SUPPLIER'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getVendorOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, roles_decorator_1.Roles)('PLANNER', 'CUSTOMER', 'SUPPLIER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Post)('orders/:id/cancel'),
    (0, roles_decorator_1.Roles)('PLANNER', 'CUSTOMER', 'SUPPLIER', 'ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    (0, roles_decorator_1.Roles)('SUPPLIER', 'PLANNER', 'CUSTOMER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transition_order_status_dto_1.TransitionOrderStatusDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "transitionStatus", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map