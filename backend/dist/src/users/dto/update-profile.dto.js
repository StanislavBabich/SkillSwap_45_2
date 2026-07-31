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
exports.UpdateProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_enums_1 = require("../user.enums");
class UpdateProfileDto {
    name;
    about;
    birthdate;
    city;
    gender;
    avatar;
    wantToLearn;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Alex Smith' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Backend developer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1995-05-20', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "birthdate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Moscow' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: user_enums_1.UserGender, example: user_enums_1.UserGender.OTHER }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_enums_1.UserGender),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://example.com/avatar.jpg',
        format: 'uri',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID категорий, которым пользователь хочет научиться',
        type: [String],
        example: ['550e8400-e29b-41d4-a716-446655440000'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "wantToLearn", void 0);
//# sourceMappingURL=update-profile.dto.js.map