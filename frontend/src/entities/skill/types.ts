import type { EntityId } from '@/entities/base.ts';

export type SkillType = 'all' | 'learn' | 'teach';

export interface Skill {
  id: EntityId;
  title: string;                   // было name
  description: string;
  images: string[];
  category: {                      // было subcategoryId: EntityId
    id: EntityId;
    name: string;
  } | null;
  owner: {                         // было userId: EntityId
    id: EntityId;
    name: string;
    email: string;
  };
  createdAt: string;               // новое поле
  updatedAt: string;               // новое поле
}

export interface SkillsListResponse {
  data: Skill[];
  page: number;
  totalPages: number;
}

export type CreateSkillDto = {
  title: string;
  description?: string;
  images?: string[];
  categoryId?: string;
};

export type UpdateSkillDto = Partial<CreateSkillDto>;