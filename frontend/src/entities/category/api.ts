import type { EntityId } from '@/entities/base.ts';
import { getDbJsonUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import memoizeRequest from '@shared/api/memoizeRequest.ts';
import type { CategoriesResponse, Category, Subcategory } from './types';

const CATEGORIES_DB_URL = getDbJsonUrl('categories');

async function fetchCategoriesInternal(): Promise<CategoriesResponse> {
  return fetchJson<CategoriesResponse>(CATEGORIES_DB_URL, {
    cache: 'no-store',
  });
}

const getCachedCategories = memoizeRequest(fetchCategoriesInternal);

const categoriesApi = {
  getAll: getCachedCategories,
  getCategories: async (): Promise<Category[]> => (await getCachedCategories()).categories,
  getSubcategories: async (): Promise<Subcategory[]> => (await getCachedCategories()).subcategories,
  getCategoryById: async (categoryId: EntityId): Promise<Category | null> => {
    const categories = await categoriesApi.getCategories();
    return categories.find((category) => category.id === categoryId) ?? null;
  },
  getSubcategoryById: async (subcategoryId: EntityId): Promise<Subcategory | null> => {
    const subcategories = await categoriesApi.getSubcategories();
    return subcategories.find((subcategory) => subcategory.id === subcategoryId) ?? null;
  },
};

export const getCategoriesData = categoriesApi.getAll;
export const getCategories = categoriesApi.getCategories;
export const getSubcategories = categoriesApi.getSubcategories;
export const getCategoryById = categoriesApi.getCategoryById;
export const getSubcategoryById = categoriesApi.getSubcategoryById;

export default categoriesApi;
