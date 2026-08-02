import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsyncStatus, EntityId } from '@/entities/base.ts';
import categoriesApi from '@/entities/category/api';
import type { Category } from '@/entities/category/types';

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  status: AsyncStatus;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  status: 'idle',
  error: null,
};

export const initializeCategories = createAsyncThunk<Category[], void>(
  'categories/initialize',
  async () => categoriesApi.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { categories: CategoriesState }).categories;
      if (state.isLoading) return false;
      return state.status !== 'succeeded';
    },
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoriesData: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.status = action.payload ? 'loading' : state.status;
    },
    setCategoriesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCategories.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initializeCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(initializeCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.error.message ?? 'Ошибка при загрузке категорий';
      });
  },
  selectors: {
    selectCategories: (state) => state.categories,
    selectCategoryById: (state, categoryId: EntityId) =>
      state.categories.find((category) => category.id === categoryId),
    selectCategoriesLoading: (state) => state.isLoading,
    selectCategoriesStatus: (state) => state.status,
    selectCategoriesError: (state) => state.error,
  },
});

export const { setCategoriesData, setCategoriesLoading, setCategoriesError } = categoriesSlice.actions;
export const {
  selectCategories,
  selectCategoryById,
  selectCategoriesLoading,
  selectCategoriesStatus,
  selectCategoriesError,
} = categoriesSlice.selectors;

export const categoriesReducer = categoriesSlice.reducer;