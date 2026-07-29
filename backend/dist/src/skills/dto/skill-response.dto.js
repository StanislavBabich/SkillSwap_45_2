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
exports.SkillResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_preview_dto_1 = require("../../users/dto/user-preview.dto");
class SkillCategoryDto {
    id;
    name;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], SkillCategoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Backend development' }),
    __metadata("design:type", String)
], SkillCategoryDto.prototype, "name", void 0);
class SkillResponseDto {
    id;
    title;
    description;
    images;
    category;
    owner;
    createdAt;
    updatedAt;
}
exports.SkillResponseDto = SkillResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], SkillResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NestJS development' }),
    __metadata("design:type", String)
], SkillResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'I can teach backend development with NestJS',
        nullable: true,
    }),
    __metadata("design:type", Object)
], SkillResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        example: ['/uploads/skill-example.png'],
        nullable: true,
    }),
    __metadata("design:type", Object)
], SkillResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: SkillCategoryDto,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SkillResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: user_preview_dto_1.UserPreviewDto }),
    __metadata("design:type", user_preview_dto_1.UserPreviewDto)
], SkillResponseDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-07-23T12:00:00.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], SkillResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-07-23T12:00:00.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], SkillResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=skill-response.dto.js.map