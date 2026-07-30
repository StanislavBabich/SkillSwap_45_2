import {
  filtersReducer,
  setSearchFilter,
  clearSearchFilter,
  setSkillTypeFilter,
  setGenderFilter,
  toggleCategoryFilter,
  toggleSubcategorySelection,
  toggleCategorySelection,
  toggleCityFilter,
  setCategoryFilters,
  setCityFilters,
  resetFilters,
} from './slice';

import type { FiltersState } from './slice';

const initialState: FiltersState = {
  search: '',
  skillType: 'all',
  gender: 'any',
  selectedCategoryIds: [],
  selectedCityIds: [],
};

describe('filters slice', () => {
  test('should return initial state', () => {
    const result = filtersReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  // SEARCH

  test('setSearchFilter updates search', () => {
    const state = filtersReducer(initialState, setSearchFilter('hello'));
    expect(state.search).toBe('hello');
  });

  test('clearSearchFilter resets search', () => {
    const modified: FiltersState = {
      ...initialState,
      search: 'hello',
    };
    const state = filtersReducer(modified, clearSearchFilter());
    expect(state.search).toBe('');
  });

  // SKILL TYPE

  test('setSkillTypeFilter updates skillType', () => {
    const state = filtersReducer(initialState, setSkillTypeFilter('learn'));
    expect(state.skillType).toBe('learn');
  });

  // GENDER

  test('setGenderFilter updates gender', () => {
    const state = filtersReducer(initialState, setGenderFilter('male'));
    expect(state.gender).toBe('male');
  });

  // CATEGORY & SUBCATEGORY TOGGLES

  test('toggleCategoryFilter toggles category id', () => {
    let state = filtersReducer(initialState, toggleCategoryFilter(1));
    expect(state.selectedCategoryIds).toEqual([1]);

    state = filtersReducer(state, toggleCategoryFilter(1));
    expect(state.selectedCategoryIds).toEqual([]);
  });

  test('toggleSubcategorySelection toggles subcategory id', () => {
    let state = filtersReducer(initialState, toggleSubcategorySelection(3));
    expect(state.selectedCategoryIds).toEqual([3]);

    state = filtersReducer(state, toggleSubcategorySelection(3));
    expect(state.selectedCategoryIds).toEqual([]);
  });

  // toggleCategorySelection

  test('toggleCategorySelection adds subcategories when selecting', () => {
    const state = filtersReducer(
      initialState,
      toggleCategorySelection({
        categoryId: 10,
        subcategoryIds: [1, 2, 3],
        isDeselecting: false,
      })
    );

    expect(state.selectedCategoryIds).toEqual([1, 2, 3]);
  });

  test('toggleCategorySelection removes subcategories when deselecting', () => {
    const startState: FiltersState = {
      ...initialState,
      selectedCategoryIds: [1, 2, 3],
    };

    const state = filtersReducer(
      startState,
      toggleCategorySelection({
        categoryId: 10,
        subcategoryIds: [2, 3],
        isDeselecting: true,
      })
    );

    expect(state.selectedCategoryIds).toEqual([1]);
  });

  test('toggleCategorySelection toggles whole category when no subcategories provided', () => {
    // Add category
    let state = filtersReducer(
      initialState,
      toggleCategorySelection({
        categoryId: 99,
        subcategoryIds: [],
        isDeselecting: false,
      })
    );

    expect(state.selectedCategoryIds).toEqual([99]);

    // Remove category
    state = filtersReducer(
      state,
      toggleCategorySelection({
        categoryId: 99,
        subcategoryIds: [],
        isDeselecting: true,
      })
    );

    expect(state.selectedCategoryIds).toEqual([]);
  });

  // CITY TOGGLES

  test('toggleCityFilter toggles city id', () => {
    let state = filtersReducer(initialState, toggleCityFilter(10));
    expect(state.selectedCityIds).toEqual([10]);

    state = filtersReducer(state, toggleCityFilter(10));
    expect(state.selectedCityIds).toEqual([]);
  });

  // MASS SETTERS

  test('setCategoryFilters assigns unique values', () => {
    const state = filtersReducer(initialState, setCategoryFilters([1, 2, 1]));
    expect(state.selectedCategoryIds).toEqual([1, 2]);
  });

  test('setCityFilters assigns unique values', () => {
    const state = filtersReducer(initialState, setCityFilters([5, 5, 6]));
    expect(state.selectedCityIds).toEqual([5, 6]);
  });

  // RESET

  test('resetFilters restores initial state', () => {
    const modified: FiltersState = {
      search: 'abc',
      skillType: 'learn',
      gender: 'female',
      selectedCategoryIds: [1],
      selectedCityIds: [2],
    };

    const state = filtersReducer(modified, resetFilters());
    expect(state).toEqual(initialState);
  });
});
