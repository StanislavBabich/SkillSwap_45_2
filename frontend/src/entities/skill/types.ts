import type { EntityId } from '@/entities/base.ts';

export type SkillType = 'all' | 'learn' | 'teach';

export interface Skill {
  id: EntityId;
  userId: EntityId;
  name: string;
  subcategoryId: EntityId;
  description: string;
  images: string[];
  likes: EntityId[];
}

export type SkillsResponse = Skill[];
export type CreateSkillDto = Omit<Skill, 'id'>;
export type UpdateSkillDto = Partial<Omit<Skill, 'id'>>;
