import { getApiUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import memoizeRequest from '@shared/api/memoizeRequest.ts';
import type { CitiesResponse } from './types';

async function fetchCitiesInternal(search?: string): Promise<CitiesResponse> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return fetchJson<CitiesResponse>(getApiUrl(`/cities${query}`));
}

const getCitiesRequest = memoizeRequest(() => fetchCitiesInternal());

const citiesApi = {
  getAll: getCitiesRequest,
  getCities: getCitiesRequest,
  search: fetchCitiesInternal,
};

export const getCities = citiesApi.getAll;

export default citiesApi;
