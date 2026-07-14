import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { GetSkillsDto } from './dto/get-skills.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  create() {
    return this.skillsService.create();
  }

  //заглушка
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Get()
  async findAll(@Query() query: GetSkillsDto) {
    return this.skillsService.findAll(query);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.skillsService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(+id);
  }
}
