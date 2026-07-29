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
exports.RequestResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const request_status_enums_1 = require("../request-status.enums");
const user_preview_dto_1 = require("../../users/dto/user-preview.dto");
const skill_preview_dto_1 = require("../../skills/dto/skill-preview.dto");
class RequestResponseDto {
    id;
    createdAt;
    status;
    isRead;
    sender;
    receiver;
    offeredSkill;
    requestedSkill;
}
exports.RequestResponseDto = RequestResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequestResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RequestResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: request_status_enums_1.RequestStatus }),
    __metadata("design:type", String)
], RequestResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], RequestResponseDto.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => user_preview_dto_1.UserPreviewDto }),
    __metadata("design:type", user_preview_dto_1.UserPreviewDto)
], RequestResponseDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => user_preview_dto_1.UserPreviewDto }),
    __metadata("design:type", user_preview_dto_1.UserPreviewDto)
], RequestResponseDto.prototype, "receiver", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => skill_preview_dto_1.SkillPreviewDto }),
    __metadata("design:type", skill_preview_dto_1.SkillPreviewDto)
], RequestResponseDto.prototype, "offeredSkill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => skill_preview_dto_1.SkillPreviewDto }),
    __metadata("design:type", skill_preview_dto_1.SkillPreviewDto)
], RequestResponseDto.prototype, "requestedSkill", void 0);
//# sourceMappingURL=request-response.dto.js.map