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
exports.ReviewReportDto = exports.CreateReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateReportDto {
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['VENDOR', 'FEED_POST', 'MESSAGE', 'USER'] }),
    (0, class_validator_1.IsIn)(['VENDOR', 'FEED_POST', 'MESSAGE', 'USER']),
    __metadata("design:type", String)
], CreateReportDto.prototype, "targetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-target' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "targetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SPAM' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateReportDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'This vendor is posting spam content...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "description", void 0);
class ReviewReportDto {
}
exports.ReviewReportDto = ReviewReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['REVIEWED', 'ACTIONED', 'DISMISSED'] }),
    (0, class_validator_1.IsIn)(['REVIEWED', 'ACTIONED', 'DISMISSED']),
    __metadata("design:type", String)
], ReviewReportDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Warned the vendor about the content' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReviewReportDto.prototype, "adminNote", void 0);
//# sourceMappingURL=create-report.dto.js.map