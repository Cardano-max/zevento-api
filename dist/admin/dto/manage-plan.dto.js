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
exports.UpdatePlanDto = exports.CreatePlanDto = exports.PlanTier = exports.VendorRole = void 0;
const class_validator_1 = require("class-validator");
var VendorRole;
(function (VendorRole) {
    VendorRole["PLANNER"] = "PLANNER";
    VendorRole["SUPPLIER"] = "SUPPLIER";
})(VendorRole || (exports.VendorRole = VendorRole = {}));
var PlanTier;
(function (PlanTier) {
    PlanTier["BASIC"] = "BASIC";
    PlanTier["PREMIUM"] = "PREMIUM";
})(PlanTier || (exports.PlanTier = PlanTier = {}));
class CreatePlanDto {
}
exports.CreatePlanDto = CreatePlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VendorRole, {
        message: 'vendorRole must be one of: PLANNER, SUPPLIER',
    }),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "vendorRole", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PlanTier, {
        message: 'tier must be one of: BASIC, PREMIUM',
    }),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "tier", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(100, { message: 'amountPaise must be at least 100 (1 rupee)' }),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "amountPaise", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "periodMonths", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePlanDto.prototype, "features", void 0);
class UpdatePlanDto {
}
exports.UpdatePlanDto = UpdatePlanDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(100, { message: 'amountPaise must be at least 100 (1 rupee)' }),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "amountPaise", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePlanDto.prototype, "features", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlanDto.prototype, "isActive", void 0);
//# sourceMappingURL=manage-plan.dto.js.map