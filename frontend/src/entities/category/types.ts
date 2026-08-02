import type { EntityId } from '@/entities/base.ts';

export interface Category {
  id: EntityId;
  name: string;
  parent: Category | null;         // было color, icon
  children: Category[];            // новое — вложенные подкатегории
  createdAt: string;
  updatedAt: string;
}

export type CategoriesResponse = Category[];  // было { categories, subcategories }