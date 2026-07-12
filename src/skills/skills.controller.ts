import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SkillsService } from './skills.service';
import { GetSkillsDto } from './dto/get-skills.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

// Временный тип для запроса (позже заменим на полноценный тип из гарды)
interface AuthRequest extends Request {
  user?: { sub: string; email: string; role: string };
}

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create(@Body() dto: CreateSkillDto, @Req() req: AuthRequest) {
    // Когда гарда будет готова, раскомментировать строку ниже и удалить временную заглушку
    // const userId = req.user?.sub;
    const userId = req.user?.sub || '295b2053-c137-4f45-8687-9d1a0656d189'; // реальный ID пользователя для тестов
    return this.skillsService.create(dto, userId);
  }

  @Get()
  async findAll(@Query() query: GetSkillsDto) {
    return this.skillsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSkillDto,
    @Req() req: AuthRequest,
  ) {
    // Когда гарда будет готова, раскомментировать строку ниже и удалить временную заглушку
    // const userId = req.user?.sub;
    const userId = req.user?.sub || '295b2053-c137-4f45-8687-9d1a0656d189'; // реальный ID пользователя для тестов
    return this.skillsService.update(id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    // Когда гарда будет готова, раскомментировать строку ниже и удалить временную заглушку
    // const userId = req.user?.sub;
    const userId = req.user?.sub || '295b2053-c137-4f45-8687-9d1a0656d189'; // реальный ID пользователя для тестов
    return this.skillsService.remove(id, userId);
  }
}
