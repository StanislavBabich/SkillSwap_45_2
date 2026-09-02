import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Checkbox, Button } from '@/shared/ui';
import { CheckboxGroup } from '@/shared/ui/CheckboxGroup';
import { Icon } from '@/shared/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { initializeCategories, selectCategories } from '@/features/categories/slice';
import {
  toggleCategorySelection,
  toggleSubcategorySelection,
} from '@/features/filters/slice';
import type { Category } from '@/entities/category/types';
import styles from './CategoryFilter.module.css';

const VISIBLE_CATEGORIES_COUNT = 6;

export const CategoryFilter = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const selectedIds = useAppSelector((state) => state.filters?.selectedCategoryIds ?? []);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(initializeCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length <= VISIBLE_CATEGORIES_COUNT) {
      setShowAllCategories(false);
    }
  }, [categories.length]);

  const initialCategories = categories.slice(0, VISIBLE_CATEGORIES_COUNT);
  const extraCategories = categories.slice(VISIBLE_CATEGORIES_COUNT);

  const toggleExpand = (categoryId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const subIds = (category?.children ?? []).map((s) => s.id);
    const allSelected = subIds.length > 0 && subIds.every((id) => selectedIds.includes(id));
    const isDeselecting = allSelected || selectedIds.includes(categoryId);

    if (isDeselecting) {
      // Снимаем выбор — сворачиваем категорию
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
    } else {
      // Выбираем — разворачиваем
      setExpandedIds((prev) => new Set(prev).add(categoryId));
    }

    dispatch(
      toggleCategorySelection({
        categoryId,
        subcategoryIds: subIds,
        isDeselecting,
      })
    );
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    const parentCategory = categories.find((cat) =>
      (cat.children ?? []).some((child) => child.id === subcategoryId)
    );

    if (selectedIds.includes(subcategoryId)) {
      // Снимаем выбор — проверяем, остались ли другие выбранные подкатегории
      if (parentCategory) {
        const otherSelected = (parentCategory.children ?? []).some(
          (child) => child.id !== subcategoryId && selectedIds.includes(child.id)
        );
        if (!otherSelected) {
          // Если это была последняя выбранная подкатегория — сворачиваем
          setExpandedIds((prev) => {
            const next = new Set(prev);
            next.delete(parentCategory.id);
            return next;
          });
        }
      }
    } else {
      // Выбираем — разворачиваем родительскую категорию
      if (parentCategory) {
        setExpandedIds((prev) => new Set(prev).add(parentCategory.id));
      }
    }

    dispatch(toggleSubcategorySelection(subcategoryId));
  };

  const renderCategoryRow = (category: Category) => {
  const hasChildren = (category.children ?? []).length > 0;
  const allChildrenSelected = hasChildren && (category.children ?? []).every((c) => selectedIds.includes(c.id));
  const isChecked = hasChildren ? allChildrenSelected : selectedIds.includes(category.id);
  const isExpanded = expandedIds.has(category.id);

  return (
    <div key={category.id}>
      <div className={clsx(styles.categoryRow, hasChildren && styles.categoryRowInner)}>
        {hasChildren && (
          <Icon
            name="chevron-down"
            size={20}
            className={clsx(styles.chevronIcon, isExpanded && styles.chevronExpanded)}
            aria-hidden="true"
            onClick={() => toggleExpand(category.id)}
          />
        )}
        <Checkbox
          className={styles.categoryCheckbox}
          name={`category-${category.id}`}
          value={String(category.id)}
          checked={isChecked}
          onChange={() => handleCategoryToggle(category.id)}
        />
        <span
          className={clsx(styles.categoryNameText, hasChildren && styles.categoryNameButton)}
          onClick={hasChildren ? () => toggleExpand(category.id) : undefined}
        >
          {category.name}
        </span>
      </div>
      {hasChildren && (
        <div className={clsx(styles.subcategoriesWrapper, isExpanded && styles.expanded)}>
          <div className={styles.subcategoriesInner}>
            <div className={styles.subcategoriesList}>
              {(category.children ?? []).map((child) => (
                <Checkbox
                  key={child.id}
                  name={`subcategory-${child.id}`}
                  value={String(child.id)}
                  checked={selectedIds.includes(child.id)}
                  onChange={() => handleSubcategoryToggle(child.id)}
                >
                  <span>{child.name}</span>
                </Checkbox>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  return (
    <div>
      <CheckboxGroup
        name="categories"
        label="Skills"
        value={selectedIds.map(String)}
        onChange={() => {}}
        orientation="vertical"
      >
        {initialCategories.map(renderCategoryRow)}
        {extraCategories.length > 0 && (
          <div className={clsx(styles.extraCategoriesWrapper, showAllCategories && styles.expanded)}>
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
            <Icon name="chevron-down" size={20} className={clsx(styles.showAllChevron, showAllCategories && styles.showAllChevronExpanded)} aria-hidden="true" />
          }
        >
          <span className={styles.showAllButtonText}>
            {showAllCategories ? 'Collapse' : 'All categories'}
          </span>
        </Button>
      )}
    </div>
  );
};