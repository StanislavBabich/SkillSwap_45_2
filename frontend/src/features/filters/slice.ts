import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EntityId, Gender } from '@/entities/base.ts';
import type { SkillType } from '@/entities/skill/types';

export type GenderFilter = 'any' | Gender;

export interface FiltersState {
  search: string;
  skillType: SkillType;
  gender: GenderFilter;
  selectedCategoryIds: EntityId[];
  selectedCityIds: EntityId[];
}

const initialState: FiltersState = {
  search: '',
  skillType: 'all',
  gender: 'any',
  selectedCategoryIds: [],
  selectedCityIds: [],
};

const toggleEntityId = (ids: EntityId[], id: EntityId): EntityId[] =>
  ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id];

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    clearSearchFilter: (state) => {
      state.search = '';
    },
    setSkillTypeFilter: (state, action: PayloadAction<SkillType>) => {
      state.skillType = action.payload;
    },
    setGenderFilter: (state, action: PayloadAction<GenderFilter>) => {
      state.gender = action.payload;
    },
    toggleCategoryFilter: (state, action: PayloadAction<EntityId>) => {
      state.selectedCategoryIds = toggleEntityId(state.selectedCategoryIds, action.payload);
    },
    toggleSubcategorySelection: (state, action: PayloadAction<EntityId>) => {
      state.selectedCategoryIds = toggleEntityId(state.selectedCategoryIds, action.payload);
    },
    toggleCategorySelection: (
      state,
      action: PayloadAction<{
        categoryId: EntityId;
        subcategoryIds: EntityId[];
        isDeselecting: boolean;
      }>
    ) => {
      const { categoryId, subcategoryIds, isDeselecting } = action.payload;
      const idsToToggle = new Set(subcategoryIds.length > 0 ? subcategoryIds : [categoryId]);
      if (isDeselecting) {
        state.selectedCategoryIds = state.selectedCategoryIds.filter(
          (id) => !idsToToggle.has(id)
        );
      } else {
        state.selectedCategoryIds = Array.from(
          new Set([...state.selectedCategoryIds, ...idsToToggle])
        );
      }
    },
    toggleCityFilter: (state, action: PayloadAction<EntityId>) => {
      state.selectedCityIds = toggleEntityId(state.selectedCityIds, action.payload);
    },
    setCategoryFilters: (state, action: PayloadAction<EntityId[]>) => {
      state.selectedCategoryIds = Array.from(new Set(action.payload));
    },
    setCityFilters: (state, action: PayloadAction<EntityId[]>) => {
      state.selectedCityIds = Array.from(new Set(action.payload));
    },
    resetFilters: () => initialState,
  },
  selectors: {
    // Основные селекторы с понятными именами
    selectSearch: (state) => state.search,
    selectSkillType: (state) => state.skillType,
    selectGender: (state) => state.gender,
    selectSelectedCategoryIds: (state) => state.selectedCategoryIds,
    selectSelectedCityIds: (state) => state.selectedCityIds,
    
    // Вспомогательные селекторы
    selectHasActiveFilters: (state) => {
      return (
        state.skillType !== 'all' ||
        state.selectedCategoryIds.length > 0 ||
        state.selectedCityIds.length > 0 ||
        state.gender !== 'any'
      );
    },
    selectActiveFiltersCount: (state) => {
      let count = 0;
      if (state.skillType !== 'all') count++;
      if (state.selectedCategoryIds.length > 0) count++;
      if (state.selectedCityIds.length > 0) count++;
      if (state.gender !== 'any') count++;
      return count;
    },
    
    // Полное состояние
    selectFiltersState: (state) => state,
  },
});

export const {
  setSearchFilter,
  clearSearchFilter,
  setSkillTypeFilter,
  setGenderFilter,
  toggleCategoryFilter,
  toggleCategorySelection,
  toggleSubcategorySelection,
  toggleCityFilter,
  setCategoryFilters,
  setCityFilters,
  resetFilters,
} = filtersSlice.actions;

export const {
  selectSearch,
  selectSkillType,
  selectGender,
  selectSelectedCategoryIds,
  selectSelectedCityIds,
  selectHasActiveFilters,
  selectActiveFiltersCount,
  selectFiltersState,
} = filtersSlice.selectors;

export const filtersReducer = filtersSlice.reducer;
