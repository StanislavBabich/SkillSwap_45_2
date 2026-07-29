import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SimilarUserDto } from './dto/similar-users-response.dto';
import { SkillResponseDto } from './dto/skill-response.dto';
import { SkillsResponseDto } from './dto/skills-response.dto';

const skillIdParam = () =>
  ApiParam({
    name: 'id',
    description: 'Skill identifier',
    format: 'uuid',
  });

export function ApiSkillsController() {
  return applyDecorators(ApiTags('Skills'));
}

export function ApiCreateSkill() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a skill' }),
    ApiCreatedResponse({
      description: 'Skill created successfully',
      type: SkillResponseDto,
    }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
  );
}

export function ApiGetSkills() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a paginated list of skills' }),
    ApiOkResponse({
      description: 'Paginated skill list',
      type: SkillsResponseDto,
    }),
    ApiBadRequestResponse({ description: 'Invalid query parameters' }),
    ApiNotFoundResponse({ description: 'Requested page not found' }),
  );
}

export function ApiAddSkillToFavorites() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add a skill to favorites' }),
    skillIdParam(),
    ApiCreatedResponse({ description: 'Skill added to favorites' }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiNotFoundResponse({ description: 'Skill or user not found' }),
    ApiConflictResponse({ description: 'Skill is already in favorites' }),
  );
}

export function ApiRemoveSkillFromFavorites() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove a skill from favorites' }),
    skillIdParam(),
    ApiOkResponse({ description: 'Skill removed from favorites' }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiNotFoundResponse({
      description: 'Skill, user, or favorite entry not found',
    }),
  );
}

export function ApiGetSkill() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a skill by ID' }),
    skillIdParam(),
    ApiOkResponse({ description: 'Skill found', type: SkillResponseDto }),
    ApiNotFoundResponse({ description: 'Skill not found' }),
  );
}

export function ApiGetSimilarSkillUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Find users with similar skills' }),
    skillIdParam(),
    ApiOkResponse({
      description: 'Users ranked by the number of skills in the same category',
      type: SimilarUserDto,
      isArray: true,
    }),
    ApiNotFoundResponse({ description: 'Skill not found' }),
  );
}

export function ApiUpdateSkill() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update the current user skill' }),
    skillIdParam(),
    ApiOkResponse({
      description: 'Skill updated successfully',
      type: SkillResponseDto,
    }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiForbiddenResponse({ description: 'Only the skill owner can update it' }),
    ApiNotFoundResponse({ description: 'Skill not found' }),
  );
}

export function ApiDeleteSkill() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete the current user skill' }),
    skillIdParam(),
    ApiOkResponse({ description: 'Skill deleted successfully' }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiForbiddenResponse({ description: 'Only the skill owner can delete it' }),
    ApiNotFoundResponse({ description: 'Skill not found' }),
  );
}
