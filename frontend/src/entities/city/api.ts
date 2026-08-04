import { getApiUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import memoizeRequest from '@shared/api/memoizeRequest.ts';
import type { CitiesResponse } from './types';

async function fetchCitiesInternal(): Promise<CitiesResponse> {
  return fetchJson<CitiesResponse>(getApiUrl('/cities'));
}

const getCitiesRequest = memoizeRequest(fetchCitiesInternal);

const citiesApi = { getAll: getCitiesRequest, getCities: getCitiesRequest };

export const getCities = citiesApi.getAll;

export default citiesApi;
