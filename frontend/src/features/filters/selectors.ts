import { createSelector } from '@reduxjs/toolkit';
import {
  selectSearch,
  selectSkillType,
  selectGender,
  selectSelectedCategoryIds,
  selectSelectedCityIds,
  selectHasActiveFilters,
  selectActiveFiltersCount,
  selectFiltersState,
} from './slice';

// ========== РЕЭКСПОРТ БАЗОВЫХ СЕЛЕКТОРОВ ==========
export {
  selectSearch,
  selectSkillType,
  selectGender,
  selectSelectedCategoryIds,
  selectSelectedCityIds,
  selectHasActiveFilters,
  selectActiveFiltersCount,
  selectFiltersState,
};

// ========== ДОПОЛНИТЕЛЬНЫЕ СЕЛЕКТОРЫ ==========

/**
 * Проверяет, есть ли поисковый запрос (непустой и не только пробелы)
 */
export const selectHasSearchQuery = createSelector(
  [selectSearch],
  (search) => search.trim().length > 0
);

/**
 * Проверяет, есть ли ЛЮБЫЕ активные фильтры (включая поиск)
 */
export const selectHasAnyFilters = createSelector(
  [selectHasSearchQuery, selectHasActiveFilters],
  (hasSearch, hasActiveFilters) => hasSearch || hasActiveFilters
);

/**
 * Возвращает количество активных фильтров (включая поиск)
 */
export const selectTotalActiveFiltersCount = createSelector(
  [selectSearch, selectActiveFiltersCount],
  (search, activeFiltersCount) => {
    const searchCount = search.trim().length > 0 ? 1 : 0;
    return activeFiltersCount + searchCount;
  }
);

/**
 * Проверяет, выбран ли режим "Хочу научиться"
 */
export const selectIsLearnMode = createSelector(
  [selectSkillType],
  (skillType) => skillType === 'learn'
);

/**
 * Проверяет, выбран ли режим "Могу научить"
 */
export const selectIsTeachMode = createSelector(
  [selectSkillType],
  (skillType) => skillType === 'teach'
);

/**
 * Проверяет, выбран ли режим "Все"
 */
export const selectIsAllMode = createSelector(
  [selectSkillType],
  (skillType) => skillType === 'all'
);

/**
 * Проверяет, выбраны ли какие-то категории
 */
export const selectHasSelectedCategories = createSelector(
  [selectSelectedCategoryIds],
  (ids) => ids.length > 0
);

/**
 * Проверяет, выбраны ли какие-то города
 */
export const selectHasSelectedCities = createSelector(
  [selectSelectedCityIds],
  (ids) => ids.length > 0
);

/**
 * Проверяет, выбран ли конкретный пол (не 'any')
 */
export const selectHasSelectedGender = createSelector(
  [selectGender],
  (gender) => gender !== 'any'
);

/**
 * Возвращает человекочитаемое описание активных фильтров
 * (для отладки или UI)
 */
export const selectFiltersDescription = createSelector(
  [selectFiltersState],
  (filters) => {
    const parts: string[] = [];
    
    if (filters.search.trim()) {
      parts.push(`поиск: "${filters.search}"`);
    }
    
    if (filters.skillType !== 'all') {
      parts.push(`режим: ${filters.skillType === 'learn' ? 'хочу научиться' : 'могу научить'}`);
    }
    
    if (filters.gender !== 'any') {
      parts.push(`пол: ${filters.gender}`);
    }
    
    if (filters.selectedCategoryIds.length > 0) {
      parts.push(`категории: ${filters.selectedCategoryIds.length} выбрано`);
    }
    
    if (filters.selectedCityIds.length > 0) {
      parts.push(`города: ${filters.selectedCityIds.length} выбрано`);
    }
    
    return parts.join(', ') || 'нет активных фильтров';
  }
);