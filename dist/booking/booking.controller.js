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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const vendor_owner_guard_1 = require("../vendor/guards/vendor-owner.guard");
const booking_service_1 = require("./booking.service");
const block_date_dto_1 = require("./dto/block-date.dto");
const transition_status_dto_1 = require("./dto/transition-status.dto");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    getBooking(bookingId, req) {
        const user = req.user;
        return this.bookingService.getBooking(bookingId, user.userId);
    }
    transitionStatus(bookingId, req, dto) {
        const user = req.user;
        return this.bookingService.transitionStatus(bookingId, user.userId, user.activeRole, dto);
    }
    blockDate(req, dto) {
        return this.bookingService.blockDate(req.vendorId, dto);
    }
    unblockDate(req, date) {
        return this.bookingService.unblockDate(req.vendorId, date);
    }
    getVendorCalendar(req, year, month) {
        return this.bookingService.getVendorCalendar(req.vendorId, year, month);
    }
    getVendorEarnings(req) {
        return this.bookingService.getVendorEarnings(req.vendorId);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Get)('bookings/:id'),
    (0, roles_decorator_1.Roles)('CUSTOMER', 'PLANNER', 'SUPPLIER', 'VENDOR', 'ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getBooking", null);
__decorate([
    (0, common_1.Patch)('bookings/:id/status'),
    (0, roles_decorator_1.Roles)('CUSTOMER', 'PLANNER', 'SUPPLIER', 'VENDOR', 'ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, transition_status_dto_1.TransitionStatusDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "transitionStatus", null);
__decorate([
    (0, common_1.Post)('vendor/calendar/block'),
    (0, roles_decorator_1.Roles)('PLANNER', 'SUPPLIER'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, block_date_dto_1.BlockDateDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "blockDate", null);
__decorate([
    (0, common_1.Delete)('vendor/calendar/block'),
    (0, roles_decorator_1.Roles)('PLANNER', 'SUPPLIER'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "unblockDate", null);
__decorate([
    (0, common_1.Get)('vendor/calendar'),
    (0, roles_decorator_1.Roles)('PLANNER', 'SUPPLIER'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('month', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getVendorCalendar", null);
__decorate([
    (0, common_1.Get)('vendor/earnings'),
    (0, roles_decorator_1.Roles)('PLANNER', 'SUPPLIER'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getVendorEarnings", null);
exports.BookingController = BookingController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map