import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { GetSkillsDto } from './dto/get-skills.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
    async findAll(@Query() query: GetSkillsDto) {
    return this.skillsService.findAll(query);
  }

}
