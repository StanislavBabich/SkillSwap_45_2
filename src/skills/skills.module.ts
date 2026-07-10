import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsController } from './skills.controller';
import { Skill } from './entities/skill.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, Category])],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}
