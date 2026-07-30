import type { EntityId } from '@/entities/base.ts';

export interface Category {
  id: EntityId;
  name: string;
  color: string;
  icon: string;
}

export interface Subcategory {
  id: EntityId;
  name: string;
  categoryId: EntityId;
}

export interface CategoriesResponse {
  categories: Category[];
  subcategories: Subcategory[];
}
