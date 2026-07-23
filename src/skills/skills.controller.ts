import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { AuthRequest } from '../auth/auth.types';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateSkillDto } from './dto/create-skill.dto';
import { GetSkillsDto } from './dto/get-skills.dto';
import { SimilarUserDto } from './dto/similar-users-response.dto';
import { SkillResponseDto } from './dto/skill-response.dto';
import { SkillsResponseDto } from './dto/skills-response.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a skill' })
  @ApiCreatedResponse({
    description: 'Skill created successfully',
    type: SkillResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  create(@Body() dto: CreateSkillDto, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of skills' })
  @ApiOkResponse({
    description: 'Paginated skill list',
    type: SkillsResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiNotFoundResponse({ description: 'Requested page not found' })
  async findAll(@Query() query: GetSkillsDto) {
    return this.skillsService.findAll(query);
  }

  @Post(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a skill to favorites' })
  @ApiParam({ name: 'id', description: 'Skill identifier', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Skill added to favorites' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'Skill or user not found' })
  @ApiConflictResponse({ description: 'Skill is already in favorites' })
  addToFavorites(@Param('id') skillId: string, @Req() req: AuthRequest) {
    return this.skillsService.addToFavorites(skillId, req.user.sub);
  }

  @Delete(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a skill from favorites' })
  @ApiParam({ name: 'id', description: 'Skill identifier', format: 'uuid' })
  @ApiOkResponse({ description: 'Skill removed from favorites' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({
    description: 'Skill, user, or favorite entry not found',
  })
  removeFromFavorites(@Param('id') skillId: string, @Req() req: AuthRequest) {
    return this.skillsService.removeFromFavorites(skillId, req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a skill by ID' })
  @ApiParam({ name: 'id', description: 'Skill identifier', format: 'uuid' })
  @ApiOkResponse({ description: 'Skill found', type: SkillResponseDto })
  @ApiNotFoundResponse({ description: 'Skill not found' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Get(':id/similar')
  @ApiOperation({ summary: 'Find users with similar skills' })
  @ApiParam({ name: 'id', description: 'Skill identifier', format: 'uuid' })
  @ApiOkResponse({
    description: 'Users ranked by the number of skills in the same category',
    type: SimilarUserDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Skill not found' })
  async findSimilarUsers(@Param('id') id: string) {
    return this.skillsService.findSimilarUsers(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the current user skill' })
  @ApiParam({ name: 'id', description: 'Skill identifier', format: 'uuid' })
  @ApiOkResponse({
    description: 'Skill updated successfully',
    type: SkillResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Only the skill owner can update it' })
  @ApiNotFoundResponse({ description: 'Skill not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSkillDto,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.sub;
    return this.skillsService.update(id, dto, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete the current user skill' })
  @ApiParam({ name: 'id', description: 'Skill identifier', format: 'uuid' })
  @ApiOkResponse({ description: 'Skill deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Only the skill owner can delete it' })
  @ApiNotFoundResponse({ description: 'Skill not found' })
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.remove(id, userId);
  }
}
