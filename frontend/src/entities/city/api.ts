import { getApiUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import memoizeRequest from '@shared/api/memoizeRequest.ts';
import type { CitiesResponse } from './types';

async function fetchCitiesInternal(): Promise<CitiesResponse> {
  return fetchJson<CitiesResponse>(getApiUrl('/cities'));
}

const citiesApi = {
  getAll: memoizeRequest(fetchCitiesInternal),
};

export const getCities = citiesApi.getAll;

export default citiesApi;