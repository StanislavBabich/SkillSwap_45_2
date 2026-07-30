import {
  selectSearch,
  selectSkillType,
  selectGender,
  selectSelectedCategoryIds,
  selectSelectedCityIds,
  selectHasActiveFilters,
  selectActiveFiltersCount,
  selectFiltersState,

  // Расширенные селекторы
  selectHasSearchQuery,
  selectHasAnyFilters,
  selectTotalActiveFiltersCount,
  selectIsLearnMode,
  selectIsTeachMode,
  selectIsAllMode,
  selectHasSelectedCategories,
  selectHasSelectedCities,
  selectHasSelectedGender,
  selectFiltersDescription,
} from './selectors';

import type { FiltersState } from './slice';

interface RootState {
  filters: FiltersState;
}

describe('filters selectors', () => {
  const baseState: RootState = {
    filters: {
      search: '',
      skillType: 'all',
      gender: 'any',
      selectedCategoryIds: [],
      selectedCityIds: [],
    },
  };

  // BASE SELECTORS

  test('selectSearch', () => {
    expect(selectSearch(baseState)).toBe('');
  });

  test('selectSkillType', () => {
    expect(selectSkillType(baseState)).toBe('all');
  });

  test('selectGender', () => {
    expect(selectGender(baseState)).toBe('any');
  });

  test('selectSelectedCategoryIds', () => {
    expect(selectSelectedCategoryIds(baseState)).toEqual([]);
  });

  test('selectSelectedCityIds', () => {
    expect(selectSelectedCityIds(baseState)).toEqual([]);
  });

  test('selectHasActiveFilters is false for initial state', () => {
    expect(selectHasActiveFilters(baseState)).toBe(false);
  });

  test('selectActiveFiltersCount counts active filters correctly', () => {
    const state: RootState = {
      filters: {
        ...baseState.filters,
        skillType: 'learn',
        gender: 'female',
        selectedCategoryIds: [1],
      },
    };

    expect(selectActiveFiltersCount(state)).toBe(3);
  });

  test('selectActiveFiltersCount counts city filters', () => {
    const state: RootState = {
      filters: {
        ...baseState.filters,
        selectedCityIds: [10],
      },
    };
    expect(selectActiveFiltersCount(state)).toBe(1);
  });

  test('selectFiltersState returns full filter state', () => {
    expect(selectFiltersState(baseState)).toEqual(baseState.filters);
  });

  // EXTENDED SELECTORS

  describe('selectHasSearchQuery', () => {
    test('returns false for empty or whitespace', () => {
      expect(selectHasSearchQuery(baseState)).toBe(false);
      expect(selectHasSearchQuery({ filters: { ...baseState.filters, search: '   ' } })).toBe(false);
    });

    test('returns true for non-empty search string', () => {
      expect(selectHasSearchQuery({ filters: { ...baseState.filters, search: 'hello' } })).toBe(true);
    });
  });

  describe('selectHasAnyFilters', () => {
    test('returns false for initial state', () => {
      expect(selectHasAnyFilters(baseState)).toBe(false);
    });

    test('returns true if search query exists', () => {
      expect(selectHasAnyFilters({
        filters: { ...baseState.filters, search: 'x' }
      })).toBe(true);
    });

    test('returns true if any non-search filter exists', () => {
      expect(selectHasAnyFilters({
        filters: { ...baseState.filters, selectedCategoryIds: [1] }
      })).toBe(true);
    });
  });

  describe('selectTotalActiveFiltersCount', () => {
    test('returns 0 for initial state', () => {
      expect(selectTotalActiveFiltersCount(baseState)).toBe(0);
    });

    test('counts only search if it exists', () => {
      expect(selectTotalActiveFiltersCount({
        filters: { ...baseState.filters, search: 'x' }
      })).toBe(1);
    });

    test('counts search + core filters', () => {
      expect(selectTotalActiveFiltersCount({
        filters: {
          ...baseState.filters,
          search: 'q',
          selectedCategoryIds: [1],
          skillType: 'learn',
        },
      })).toBe(3);
    });
  });

  // MODE SELECTORS

  test('selectIsLearnMode / selectIsTeachMode / selectIsAllMode', () => {
    expect(selectIsAllMode(baseState)).toBe(true);

    expect(selectIsLearnMode({
      filters: { ...baseState.filters, skillType: 'learn' }
    })).toBe(true);

    expect(selectIsTeachMode({
      filters: { ...baseState.filters, skillType: 'teach' }
    })).toBe(true);
  });

  // ENTITY PRESENCE SELECTORS

  test('selectHasSelectedCategories', () => {
    expect(selectHasSelectedCategories(baseState)).toBe(false);
    expect(selectHasSelectedCategories({
      filters: { ...baseState.filters, selectedCategoryIds: [1] }
    })).toBe(true);
  });

  test('selectHasSelectedCities', () => {
    expect(selectHasSelectedCities(baseState)).toBe(false);
    expect(selectHasSelectedCities({
      filters: { ...baseState.filters, selectedCityIds: [10] }
    })).toBe(true);
  });

  test('selectHasSelectedGender', () => {
    expect(selectHasSelectedGender(baseState)).toBe(false);

    expect(selectHasSelectedGender({
      filters: { ...baseState.filters, gender: 'male' }
    })).toBe(true);

    expect(selectHasSelectedGender({
      filters: { ...baseState.filters, gender: 'other' }
    })).toBe(true); // доп. проверка для покрытия Gender = 'other'
  });

  // FILTERS DESCRIPTION

  describe('selectFiltersDescription', () => {
    test('returns fallback if no filters active', () => {
      expect(selectFiltersDescription(baseState)).toBe('нет активных фильтров');
    });

    test('returns description for search filter', () => {
      expect(selectFiltersDescription({
        filters: { ...baseState.filters, search: 'hello' }
      })).toBe('поиск: "hello"');
    });

    test('returns description for skillType', () => {
      expect(selectFiltersDescription({
        filters: { ...baseState.filters, skillType: 'learn' }
      })).toBe('режим: хочу научиться');
    });

    test('returns description for gender', () => {
      expect(selectFiltersDescription({
        filters: { ...baseState.filters, gender: 'male' }
      })).toBe('пол: male');
    });

    test('returns description for categories', () => {
      expect(selectFiltersDescription({
        filters: { ...baseState.filters, selectedCategoryIds: [1, 2] }
      })).toBe('категории: 2 выбрано');
    });

    test('returns combined description for all filters', () => {
      expect(selectFiltersDescription({
        filters: {
          ...baseState.filters,
          search: 'x',
          skillType: 'teach',
          gender: 'female',
          selectedCategoryIds: [1],
          selectedCityIds: [10, 20],
        }
      })).toBe(
        'поиск: "x", режим: могу научить, пол: female, категории: 1 выбрано, города: 2 выбрано'
      );
    });
  });
});
