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
exports.SkillsController = void 0;
const common_1 = require("@nestjs/common");
const skills_swagger_1 = require("./skills.swagger");
const access_token_guard_1 = require("../auth/guards/access-token.guard");
const create_skill_dto_1 = require("./dto/create-skill.dto");
const get_skills_dto_1 = require("./dto/get-skills.dto");
const update_skill_dto_1 = require("./dto/update-skill.dto");
const skills_service_1 = require("./skills.service");
let SkillsController = class SkillsController {
    skillsService;
    constructor(skillsService) {
        this.skillsService = skillsService;
    }
    create(dto, req) {
        const userId = req.user.sub;
        return this.skillsService.create(dto, userId);
    }
    async findAll(query) {
        return this.skillsService.findAll(query);
    }
    addToFavorites(skillId, req) {
        return this.skillsService.addToFavorites(skillId, req.user.sub);
    }
    removeFromFavorites(skillId, req) {
        return this.skillsService.removeFromFavorites(skillId, req.user.sub);
    }
    findOne(id) {
        return this.skillsService.findOne(id);
    }
    async findSimilarUsers(id) {
        return this.skillsService.findSimilarUsers(id);
    }
    update(id, dto, req) {
        const userId = req.user.sub;
        return this.skillsService.update(id, dto, userId);
    }
    remove(id, req) {
        const userId = req.user.sub;
        return this.skillsService.remove(id, userId);
    }
};
exports.SkillsController = SkillsController;
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, common_1.Post)(),
    (0, skills_swagger_1.ApiCreateSkill)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_skill_dto_1.CreateSkillDto, Object]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, skills_swagger_1.ApiGetSkills)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_skills_dto_1.GetSkillsDto]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/favorite'),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, skills_swagger_1.ApiAddSkillToFavorites)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "addToFavorites", null);
__decorate([
    (0, common_1.Delete)(':id/favorite'),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, skills_swagger_1.ApiRemoveSkillFromFavorites)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "removeFromFavorites", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, skills_swagger_1.ApiGetSkill)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/similar'),
    (0, skills_swagger_1.ApiGetSimilarSkillUsers)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "findSimilarUsers", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, common_1.Patch)(':id'),
    (0, skills_swagger_1.ApiUpdateSkill)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_skill_dto_1.UpdateSkillDto, Object]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, common_1.Delete)(':id'),
    (0, skills_swagger_1.ApiDeleteSkill)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SkillsController.prototype, "remove", null);
exports.SkillsController = SkillsController = __decorate([
    (0, skills_swagger_1.ApiSkillsController)(),
    (0, common_1.Controller)('skills'),
    __metadata("design:paramtypes", [skills_service_1.SkillsService])
], SkillsController);
//# sourceMappingURL=skills.controller.js.map