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
  ApiAddSkillToFavorites,
  ApiCreateSkill,
  ApiDeleteSkill,
  ApiGetSimilarSkillUsers,
  ApiGetSkill,
  ApiGetSkills,
  ApiRemoveSkillFromFavorites,
  ApiSkillsController,
  ApiUpdateSkill,
} from './skills.swagger';
import { AuthRequest } from '../auth/auth.types';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateSkillDto } from './dto/create-skill.dto';
import { GetSkillsDto } from './dto/get-skills.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';

@ApiSkillsController()
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiCreateSkill()
  create(@Body() dto: CreateSkillDto, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.create(dto, userId);
  }

  @Get()
  @ApiGetSkills()
  async findAll(@Query() query: GetSkillsDto) {
    return this.skillsService.findAll(query);
  }

  @Post(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiAddSkillToFavorites()
  addToFavorites(@Param('id') skillId: string, @Req() req: AuthRequest) {
    return this.skillsService.addToFavorites(skillId, req.user.sub);
  }

  @Delete(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiRemoveSkillFromFavorites()
  removeFromFavorites(@Param('id') skillId: string, @Req() req: AuthRequest) {
    return this.skillsService.removeFromFavorites(skillId, req.user.sub);
  }

  @Get(':id')
  @ApiGetSkill()
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Get(':id/similar')
  @ApiGetSimilarSkillUsers()
  async findSimilarUsers(@Param('id') id: string) {
    return this.skillsService.findSimilarUsers(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  @ApiUpdateSkill()
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
  @ApiDeleteSkill()
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.remove(id, userId);
  }
}
