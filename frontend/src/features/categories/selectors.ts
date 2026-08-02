import { createSelector } from '@reduxjs/toolkit';
import { selectCategories, selectSubcategories } from './slice';

export const selectCategoriesWithSubcategories = createSelector(
  [selectCategories, selectSubcategories],
  (categories, subcategories) => {
    return categories.map(category => ({
      ...category,
      subcategories: subcategories.filter(sub => sub.categoryId === category.id),
    }));
  }
);