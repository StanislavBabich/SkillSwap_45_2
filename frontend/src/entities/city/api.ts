import type { EntityId } from '@/entities/base.ts';
import { getDbJsonUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import memoizeRequest from '@shared/api/memoizeRequest.ts';
import type { CitiesResponse, City } from './types';

const CITIES_DB_URL = getDbJsonUrl('cities');

async function fetchCitiesInternal(): Promise<CitiesResponse> {
  return fetchJson<CitiesResponse>(CITIES_DB_URL);
}

const citiesApi = {
  getCities: memoizeRequest(fetchCitiesInternal),
  getCityById: async (cityId: EntityId): Promise<City | null> => {
    const cities = await citiesApi.getCities();
    return cities.find((city) => city.id === cityId) ?? null;
  },
};

export const getCities = citiesApi.getCities;
export const getCityById = citiesApi.getCityById;

export default citiesApi;
