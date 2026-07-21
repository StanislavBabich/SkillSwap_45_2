import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { GetSkillsDto } from './dto/get-skills.dto';
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { GetSkillsDto } from './dto/get-skills.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AuthRequest } from '../auth/auth.types';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() dto: CreateSkillDto, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.create(dto, userId);
  }

  @Get()
  async findAll(@Query() query: GetSkillsDto) {
    return this.skillsService.findAll(query);
  }

  @Post(':id/favorite')
  @UseGuards(AccessTokenGuard)
  addToFavorites(@Param('id') skillId: string, @Req() req: AuthRequest) {
    return this.skillsService.addToFavorites(skillId, req.user.sub);
  }

  @Delete(':id/favorite')
  @UseGuards(AccessTokenGuard)
  removeFromFavorites(@Param('id') skillId: string, @Req() req: AuthRequest) {
    return this.skillsService.removeFromFavorites(skillId, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @Get(':id/similar')
  async findSimilarUsers(@Param('id') id: string) {
    return this.skillsService.findSimilarUsers(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
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
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.skillsService.remove(id, userId);
  }
}
