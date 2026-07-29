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
exports.SkillsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const skill_response_dto_1 = require("./skill-response.dto");
class SkillsResponseDto {
    data = [];
    page = 1;
    totalPages = 0;
}
exports.SkillsResponseDto = SkillsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [skill_response_dto_1.SkillResponseDto] }),
    __metadata("design:type", Array)
], SkillsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, minimum: 1 }),
    __metadata("design:type", Number)
], SkillsResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, minimum: 0 }),
    __metadata("design:type", Number)
], SkillsResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=skills-response.dto.js.map