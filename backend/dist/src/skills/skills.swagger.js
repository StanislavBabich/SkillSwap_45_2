"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSkillsController = ApiSkillsController;
exports.ApiCreateSkill = ApiCreateSkill;
exports.ApiGetSkills = ApiGetSkills;
exports.ApiAddSkillToFavorites = ApiAddSkillToFavorites;
exports.ApiRemoveSkillFromFavorites = ApiRemoveSkillFromFavorites;
exports.ApiGetSkill = ApiGetSkill;
exports.ApiGetSimilarSkillUsers = ApiGetSimilarSkillUsers;
exports.ApiUpdateSkill = ApiUpdateSkill;
exports.ApiDeleteSkill = ApiDeleteSkill;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const similar_users_response_dto_1 = require("./dto/similar-users-response.dto");
const skill_response_dto_1 = require("./dto/skill-response.dto");
const skills_response_dto_1 = require("./dto/skills-response.dto");
const skillIdParam = () => (0, swagger_1.ApiParam)({
    name: 'id',
    description: 'Skill identifier',
    format: 'uuid',
});
function ApiSkillsController() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('Skills'));
}
function ApiCreateSkill() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Create a skill' }), (0, swagger_1.ApiCreatedResponse)({
        description: 'Skill created successfully',
        type: skill_response_dto_1.SkillResponseDto,
    }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Authentication required' }));
}
function ApiGetSkills() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get a paginated list of skills' }), (0, swagger_1.ApiOkResponse)({
        description: 'Paginated skill list',
        type: skills_response_dto_1.SkillsResponseDto,
    }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid query parameters' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Requested page not found' }));
}
function ApiAddSkillToFavorites() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Add a skill to favorites' }), skillIdParam(), (0, swagger_1.ApiCreatedResponse)({ description: 'Skill added to favorites' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Authentication required' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Skill or user not found' }), (0, swagger_1.ApiConflictResponse)({ description: 'Skill is already in favorites' }));
}
function ApiRemoveSkillFromFavorites() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Remove a skill from favorites' }), skillIdParam(), (0, swagger_1.ApiOkResponse)({ description: 'Skill removed from favorites' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Authentication required' }), (0, swagger_1.ApiNotFoundResponse)({
        description: 'Skill, user, or favorite entry not found',
    }));
}
function ApiGetSkill() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get a skill by ID' }), skillIdParam(), (0, swagger_1.ApiOkResponse)({ description: 'Skill found', type: skill_response_dto_1.SkillResponseDto }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Skill not found' }));
}
function ApiGetSimilarSkillUsers() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Find users with similar skills' }), skillIdParam(), (0, swagger_1.ApiOkResponse)({
        description: 'Users ranked by the number of skills in the same category',
        type: similar_users_response_dto_1.SimilarUserDto,
        isArray: true,
    }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Skill not found' }));
}
function ApiUpdateSkill() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update the current user skill' }), skillIdParam(), (0, swagger_1.ApiOkResponse)({
        description: 'Skill updated successfully',
        type: skill_response_dto_1.SkillResponseDto,
    }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Authentication required' }), (0, swagger_1.ApiForbiddenResponse)({ description: 'Only the skill owner can update it' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Skill not found' }));
}
function ApiDeleteSkill() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Delete the current user skill' }), skillIdParam(), (0, swagger_1.ApiOkResponse)({ description: 'Skill deleted successfully' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Authentication required' }), (0, swagger_1.ApiForbiddenResponse)({ description: 'Only the skill owner can delete it' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Skill not found' }));
}
//# sourceMappingURL=skills.swagger.js.map