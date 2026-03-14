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
exports.QuoteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const vendor_owner_guard_1 = require("../vendor/guards/vendor-owner.guard");
const create_quote_dto_1 = require("./dto/create-quote.dto");
const quote_service_1 = require("./quote.service");
let QuoteController = class QuoteController {
    constructor(quoteService) {
        this.quoteService = quoteService;
    }
    createOrUpdateQuote(leadId, req, dto) {
        return this.quoteService.createOrUpdateQuote(leadId, req.vendorId, dto);
    }
    submitQuote(quoteId, req) {
        return this.quoteService.submitQuote(quoteId, req.vendorId);
    }
    getQuotesForLead(leadId, req) {
        const user = req.user;
        return this.quoteService.getQuotesForLead(leadId, user.userId);
    }
    acceptQuote(quoteId, req) {
        const user = req.user;
        return this.quoteService.acceptQuote(quoteId, user.userId);
    }
};
exports.QuoteController = QuoteController;
__decorate([
    (0, common_1.Post)('leads/:leadId/quotes'),
    (0, roles_decorator_1.Roles)('PLANNER', 'SUPPLIER'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('leadId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_quote_dto_1.CreateQuoteDto]),
    __metadata("design:returntype", void 0)
], QuoteController.prototype, "createOrUpdateQuote", null);
__decorate([
    (0, common_1.Patch)('quotes/:id/submit'),
    (0, roles_decorator_1.Roles)('PLANNER', 'SUPPLIER'),
    (0, common_1.UseGuards)(vendor_owner_guard_1.VendorOwnerGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuoteController.prototype, "submitQuote", null);
__decorate([
    (0, common_1.Get)('leads/:leadId/quotes'),
    (0, roles_decorator_1.Roles)('CUSTOMER'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('leadId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuoteController.prototype, "getQuotesForLead", null);
__decorate([
    (0, common_1.Post)('quotes/:id/accept'),
    (0, roles_decorator_1.Roles)('CUSTOMER'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuoteController.prototype, "acceptQuote", null);
exports.QuoteController = QuoteController = __decorate([
    (0, swagger_1.ApiTags)('Quotes'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [quote_service_1.QuoteService])
], QuoteController);
//# sourceMappingURL=quote.controller.js.map