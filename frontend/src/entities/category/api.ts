import { getApiUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import memoizeRequest from '@shared/api/memoizeRequest.ts';
import type { CategoriesResponse } from './types';

async function fetchCategoriesInternal(): Promise<CategoriesResponse> {
  return fetchJson<CategoriesResponse>(getApiUrl('/categories'));
}

const categoriesApi = {
  getAll: memoizeRequest(fetchCategoriesInternal),
};

export const getCategoriesData = categoriesApi.getAll;
export const getCategories = categoriesApi.getAll;

export default categoriesApi;