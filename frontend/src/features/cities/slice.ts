import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsyncStatus, EntityId } from '@/entities/base.ts';
import citiesApi from '@/entities/city/api';
import type { City } from '@/entities/city/types';

export interface CitiesState {
  items: City[];
  isLoading: boolean;
  status: AsyncStatus;
  error: string | null;
}

const initialState: CitiesState = {
  items: [],
  isLoading: false,
  status: 'idle',
  error: null,
};

export const initializeCities = createAsyncThunk<City[], void>('cities/initialize', async () => citiesApi.getCities(), {
  condition: (_, { getState }) => {
    const state = (getState() as { cities: CitiesState }).cities;

    if (state.isLoading) {
      return false;
    }

    // Keep cities in memory after first successful fetch.
    return state.status !== 'succeeded';
  },
});

export const searchCities = createAsyncThunk<City[], string>(
  'cities/search',
  async (search) => citiesApi.search(search)
);

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setCities: (state, action: PayloadAction<City[]>) => {
      state.items = action.payload;
    },
    setCitiesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.status = action.payload ? 'loading' : state.status;
    },
    setCitiesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCities.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initializeCities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(initializeCities.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load cities';
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        const knownIds = new Set(state.items.map((city) => city.id));
        state.items.push(...action.payload.filter((city) => !knownIds.has(city.id)));
      });
  },
  selectors: {
    selectCities: (state) => state.items,
    selectCityById: (state, cityId: EntityId) => state.items.find((city) => city.id === cityId),
    selectCitiesLoading: (state) => state.isLoading,
    selectCitiesStatus: (state) => state.status,
    selectCitiesError: (state) => state.error,
  },
});

export const { setCities, setCitiesLoading, setCitiesError } = citiesSlice.actions;
export const { selectCities, selectCityById, selectCitiesLoading, selectCitiesStatus, selectCitiesError } =
  citiesSlice.selectors;

export const citiesReducer = citiesSlice.reducer;
