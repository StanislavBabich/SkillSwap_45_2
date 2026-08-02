import { useMemo } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import {
  setSkillTypeFilter,
  toggleCategorySelection,
  toggleSubcategorySelection,
  setGenderFilter,
  toggleCityFilter,
} from '@/features/filters/slice';
import { selectSkillType } from '@/features/filters/slice';
import { selectCategories } from '@/features/categories/slice';
import type { SkillType } from '@/entities/skill/types';
import type { Gender } from '@/entities/base';
import styles from './ActiveFilters.module.css';

interface ActiveFiltersProps {
  className?: string;
}

export const ActiveFilters = ({ className }: ActiveFiltersProps) => {
  const dispatch = useAppDispatch();

  const skillType = useAppSelector(selectSkillType);
  const selectedCategoryIds = useAppSelector((state) => state.filters.selectedCategoryIds);
  const gender = useAppSelector((state) => state.filters.gender);
  const selectedCityIds = useAppSelector((state) => state.filters.selectedCityIds);

  const categories = useAppSelector(selectCategories);

  // Собираем все подкатегории из дерева
  const allSubcategories = useMemo(() => {
    return categories.flatMap((cat) => cat.children ?? []);
  }, [categories]);

  const activeFilters = useMemo(() => {
    const filters: Array<{
      id: string;
      label: string;
      onRemove: () => void;
    }> = [];

    if (skillType !== 'all') {
      const labels: Record<SkillType, string> = {
        all: 'Все',
        learn: 'Хочу научиться',
        teach: 'Могу научить',
      };
      filters.push({
        id: 'skill-type',
        label: labels[skillType],
        onRemove: () => dispatch(setSkillTypeFilter('all')),
      });
    }

    selectedCategoryIds.forEach((id) => {
      const category = categories.find((c) => c.id === id);
      if (category) {
        const subIds = (category.children ?? []).map((s) => s.id);
        filters.push({
          id: `category-${id}`,
          label: category.name,
          onRemove: () =>
            dispatch(
              toggleCategorySelection({
                categoryId: id,
                subcategoryIds: subIds,
                isDeselecting: true,
              }),
            ),
        });
        return;
      }

      const subcategory = allSubcategories.find((s) => s.id === id);
      if (subcategory) {
        filters.push({
          id: `subcategory-${id}`,
          label: subcategory.name,
          onRemove: () => dispatch(toggleSubcategorySelection(id)),
        });
      }
    });

    if (gender !== 'any') {
      const labels: Record<Gender, string> = {
        male: 'Мужской',
        female: 'Женский',
        other: 'Другое',
      };
      filters.push({
        id: 'gender',
        label: labels[gender],
        onRemove: () => dispatch(setGenderFilter('any')),
      });
    }

    selectedCityIds.forEach((id) => {
      // Города пока не работают, но оставим структуру
      filters.push({
        id: `city-${id}`,
        label: `Город ${id}`,
        onRemove: () => dispatch(toggleCityFilter(id)),
      });
    });

    return filters;
  }, [skillType, selectedCategoryIds, gender, selectedCityIds, categories, allSubcategories, dispatch]);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.filtersList}>
        {activeFilters.map((filter) => (
          <Button key={filter.id} variant="tertiary" onClick={filter.onRemove} endIcon={<Icon name="close" size={14} />}>
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
};