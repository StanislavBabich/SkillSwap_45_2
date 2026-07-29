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
exports.SimilarUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_enums_1 = require("../../users/user.enums");
class SimilarUserSkillDto {
    id;
    title;
    description;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], SimilarUserSkillDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NestJS development' }),
    __metadata("design:type", String)
], SimilarUserSkillDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Backend development', nullable: true }),
    __metadata("design:type", Object)
], SimilarUserSkillDto.prototype, "description", void 0);
class SimilarUserDto {
    id;
    name;
    email;
    avatar;
    city;
    birthdate;
    about;
    gender;
    commonSkillsCount;
    skills;
}
exports.SimilarUserDto = SimilarUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], SimilarUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Alex Smith' }),
    __metadata("design:type", String)
], SimilarUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'alex@example.com', format: 'email' }),
    __metadata("design:type", String)
], SimilarUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/avatar.jpg', nullable: true }),
    __metadata("design:type", Object)
], SimilarUserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Moscow', nullable: true }),
    __metadata("design:type", Object)
], SimilarUserDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1995-05-20', format: 'date', nullable: true }),
    __metadata("design:type", Object)
], SimilarUserDto.prototype, "birthdate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Backend developer', nullable: true }),
    __metadata("design:type", Object)
], SimilarUserDto.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_enums_1.UserGender, nullable: true }),
    __metadata("design:type", Object)
], SimilarUserDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, minimum: 1 }),
    __metadata("design:type", Number)
], SimilarUserDto.prototype, "commonSkillsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SimilarUserSkillDto, isArray: true }),
    __metadata("design:type", Array)
], SimilarUserDto.prototype, "skills", void 0);
//# sourceMappingURL=similar-users-response.dto.js.map