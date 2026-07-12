import { Skill } from '../entities/skill.entity';

export class SkillsResponseDto {
  data: Skill[] = []; // ← Пустой массив по умолчанию
  page: number = 1;
  totalPages: number = 0;
}
