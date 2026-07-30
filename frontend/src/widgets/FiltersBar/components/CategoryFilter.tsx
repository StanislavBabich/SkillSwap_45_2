import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Checkbox, Button } from '@/shared/ui';
import { CheckboxGroup } from '@/shared/ui/CheckboxGroup';
import { Icon } from '@/shared/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { initializeCategories } from '@/features/categories/slice';
import {
  toggleCategorySelection,
  toggleSubcategorySelection,
} from '@/features/filters/slice';
import type { Category, Subcategory } from '@/entities/category/types';
import styles from './CategoryFilter.module.css';

const VISIBLE_CATEGORIES_COUNT = 6;

export const CategoryFilter = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories?.categories ?? []);
  const subcategories = useAppSelector((state) => state.categories?.subcategories ?? []);
  const selectedIds = useAppSelector((state) => state.filters?.selectedCategoryIds ?? []);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<number>>(
    () => new Set()
  );

  useEffect(() => {
    dispatch(initializeCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length <= VISIBLE_CATEGORIES_COUNT) {
      setShowAllCategories(false);
    }
  }, [categories.length]);

  // СБРАСЫВАЕМ РАСКРЫТЫЕ КАТЕГОРИИ, КОГДА НЕТ ВЫБРАННЫХ ID
  useEffect(() => {
    if (selectedIds.length === 0) {
      setExpandedCategoryIds(new Set());
    }
  }, [selectedIds]);

  // УПРАВЛЕНИЕ РАСКРЫТИЕМ КАТЕГОРИЙ НА ОСНОВЕ ВЫБРАННЫХ ПОДКАТЕГОРИЙ
  useEffect(() => {
    // Находим все категории, у которых есть выбранные подкатегории
    const categoriesWithSelectedSubs = new Set<number>();
    
    selectedIds.forEach(id => {
      const sub = subcategories.find(s => s.id === id);
      if (sub) {
        categoriesWithSelectedSubs.add(sub.categoryId);
      }
    });

    // Обновляем раскрытые категории
    setExpandedCategoryIds(prev => {
      const next = new Set(prev);
      
      // Добавляем все категории с выбранными подкатегориями
      categoriesWithSelectedSubs.forEach(id => {
        next.add(id);
      });
      
      // Удаляем категории, в которых нет выбранных подкатегорий
      const toDelete: number[] = [];
      for (const catId of next) {
        // Проверяем, есть ли у этой категории выбранные подкатегории
        const hasSelectedSub = selectedIds.some(id => {
          const sub = subcategories.find(s => s.id === id);
          return sub?.categoryId === catId;
        });
        
        // Если нет выбранных подкатегорий - помечаем на удаление
        if (!hasSelectedSub) {
          toDelete.push(catId);
        }
      }
      
      // Удаляем все помеченные категории
      toDelete.forEach(id => next.delete(id));
      
      return next;
    });
  }, [selectedIds, subcategories]);

  const initialCategories = categories.slice(0, VISIBLE_CATEGORIES_COUNT);
  const extraCategories = categories.slice(VISIBLE_CATEGORIES_COUNT);

  const subcategoriesByCategory = useMemo(() => {
    const map = new Map<number, Subcategory[]>();
    subcategories.forEach((sub) => {
      const arr = map.get(sub.categoryId) || [];
      arr.push(sub);
      map.set(sub.categoryId, arr);
    });
    return map;
  }, [subcategories]);

  const effectiveSelectedIds = useMemo(() => {
    const result = new Set(selectedIds);
    categories.forEach((cat) => {
      const subs = subcategoriesByCategory.get(cat.id) || [];
      if (subs.length > 0 && subs.every((s) => selectedIds.includes(s.id))) {
        result.add(cat.id);
      }
    });
    return Array.from(result);
  }, [selectedIds, categories, subcategoriesByCategory]);

  const handleCategoryToggle = (categoryId: number) => {
    const categorySubs = subcategoriesByCategory.get(categoryId) || [];
    const subIds = categorySubs.map((s) => s.id);
    const allSubsSelected =
      categorySubs.length > 0 &&
      categorySubs.every((sub) => selectedIds.includes(sub.id));
    const categoryOrSubsSelected =
      categorySubs.length > 0
        ? allSubsSelected
        : selectedIds.includes(categoryId);

    dispatch(
      toggleCategorySelection({
        categoryId,
        subcategoryIds: subIds,
        isDeselecting: categoryOrSubsSelected,
      })
    );
  };

  const handleSubcategoryToggle = (subcategoryId: number) => {
    dispatch(toggleSubcategorySelection(subcategoryId));
  };

  const toggleExpand = (categoryId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    setExpandedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderCategoryRow = (category: Category) => {
    const categorySubs = subcategoriesByCategory.get(category.id) || [];
    const hasSubcategories = categorySubs.length > 0;
    const allSubsSelected =
      hasSubcategories &&
      categorySubs.every((sub) => selectedIds.includes(sub.id));
    const isCategoryChecked = hasSubcategories
      ? allSubsSelected
      : selectedIds.includes(category.id);
    const isIndeterminate =
      hasSubcategories &&
      expandedCategoryIds.has(category.id) &&
      !allSubsSelected;
    const isExpanded = expandedCategoryIds.has(category.id);

    return (
      <div
        key={category.id}
        className={clsx(hasSubcategories && styles.categoryRow)}
      >
        {hasSubcategories && (

          <Icon
            name="chevron-down"
            size={20}
            className={clsx(styles.chevronIcon, isExpanded && styles.chevronExpanded)}
            aria-hidden="true"
          />
        )}
        
        <Checkbox
          className={clsx(
            styles.categoryCheckbox,
            isIndeterminate && styles.categoryIndeterminate,
            isExpanded && !isCategoryChecked && styles.categoryOpen
          )}
          name={`category-${category.id}`}
          value={String(category.id)}
          checked={isCategoryChecked}
          indeterminate={isIndeterminate}
          onChange={() => handleCategoryToggle(category.id)}
        />

        {/* Текст категории - отдельный кликабельный элемент для раскрытия */}
        {hasSubcategories ? (
          <button
            type="button"
            className={styles.categoryNameButton}
            onClick={(e) => toggleExpand(category.id, e)}
          >
            {category.name}
          </button>
        ) : (
          <span className={styles.categoryNameText}>
            {category.name}
          </span>
        )}

        {hasSubcategories && (
          <div
            className={clsx(styles.subcategoriesWrapper, isExpanded && styles.expanded)}
          >
            <div className={styles.subcategoriesInner}>
              <div className={styles.subcategoriesList}>
                {categorySubs.map((sub) => (
                  <Checkbox
                    key={sub.id}
                    name={`subcategory-${sub.id}`}
                    value={String(sub.id)}
                    checked={selectedIds.includes(sub.id)}
                    onChange={() => handleSubcategoryToggle(sub.id)}
                  >
                    <span>{sub.name}</span>
                  </Checkbox>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Функция для обработки изменений в CheckboxGroup
  const handleGroupChange = (values: string[]) => {
    const numberValues = values.map(Number);
    
    const prevSet = new Set(effectiveSelectedIds);
    const newSet = new Set(numberValues);
    
    const removed = effectiveSelectedIds.filter(id => !newSet.has(id));
    const added = numberValues.filter(id => !prevSet.has(id));
    
    added.forEach(id => {
      const isCategory = categories.some(c => c.id === id);
      if (isCategory) {
        handleCategoryToggle(id);
      } else {
        handleSubcategoryToggle(id);
      }
    });
    
    removed.forEach(id => {
      const isCategory = categories.some(c => c.id === id);
      if (isCategory) {
        handleCategoryToggle(id);
      } else {
        handleSubcategoryToggle(id);
      }
    });
  };

  return (
    <div>
      <CheckboxGroup
        name="categories"
        label="Навыки"
        value={effectiveSelectedIds.map(String)}
        onChange={handleGroupChange}
        orientation="vertical"
      >
        {initialCategories.map(renderCategoryRow)}
        {extraCategories.length > 0 && (
          <div
            className={clsx(styles.extraCategoriesWrapper, showAllCategories && styles.expanded)}
          >
            <div className={styles.extraCategoriesInner}>
              {extraCategories.map(renderCategoryRow)}
            </div>
          </div>
        )}
      </CheckboxGroup>
      {categories.length > VISIBLE_CATEGORIES_COUNT && (
        <Button
          variant="text"
          size="medium"
          className={styles.showAllButton}
          onClick={() => setShowAllCategories(!showAllCategories)}
          endIcon={

            <Icon
              name="chevron-down"
              size={20}
              className={clsx(styles.showAllChevron, showAllCategories && styles.showAllChevronExpanded)}
              aria-hidden="true"
            />
          }
        >
          <span className={styles.showAllButtonText}>
            {showAllCategories ? 'Свернуть' : 'Все категории'}
          </span>
        </Button>
      )}
    </div>
  );
};