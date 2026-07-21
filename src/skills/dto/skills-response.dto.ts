import { Skill } from '../entities/skill.entity';

export class SkillsResponseDto {
  data: Skill[] = [];
  page: number = 1;
  totalPages: number = 0;
}
