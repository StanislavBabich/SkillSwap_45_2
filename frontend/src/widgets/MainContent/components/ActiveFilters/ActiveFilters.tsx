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
  toggleCityFilter
} from '@/features/filters/slice';
import { selectSkillType } from '@/features/filters/slice';
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
  
  const categories = useAppSelector((state) => state.categories.categories);
  const subcategories = useAppSelector((state) => state.categories.subcategories);
  const cities = useAppSelector((state) => state.cities.items);

  // Маппинг для отображения названий фильтров
  const activeFilters = useMemo(() => {
    const filters: Array<{
      id: string;
      label: string;
      onRemove: () => void;
    }> = [];

    // Фильтр типа навыка
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

    // Фильтры категорий и подкатегорий
    selectedCategoryIds.forEach(id => {
      // Проверяем, является ли ID категорией
      const category = categories.find(c => c.id === id);
      if (category) {
        filters.push({
          id: `category-${id}`,
          label: category.name,
          onRemove: () => {
            // Для категории нужно убрать все её подкатегории
            const categorySubs = subcategories
              .filter(s => s.categoryId === id)
              .map(s => s.id);
            dispatch(toggleCategorySelection({
              categoryId: id,
              subcategoryIds: categorySubs,
              isDeselecting: true,
            }));
          },
        });
        return;
      }

      // Если не категория, значит подкатегория
      const subcategory = subcategories.find(s => s.id === id);
      if (subcategory) {
        filters.push({
          id: `subcategory-${id}`,
          label: subcategory.name,
          onRemove: () => dispatch(toggleSubcategorySelection(id)),
        });
      }
    });

    // Фильтр пола
    if (gender !== 'any') {
      const labels: Record<Gender, string> = {
        male: 'Мужской',
        female: 'Женский',
        other: 'Другое'
      };
      filters.push({
        id: 'gender',
        label: labels[gender],
        onRemove: () => dispatch(setGenderFilter('any')),
      });
    }

    // Фильтры городов
    selectedCityIds.forEach(id => {
      const city = cities.find(c => c.id === id);
      if (city) {
        filters.push({
          id: `city-${id}`,
          label: city.name,
          onRemove: () => dispatch(toggleCityFilter(id)),
        });
      }
    });

    return filters;
  }, [
    skillType,
    selectedCategoryIds,
    gender,
    selectedCityIds,
    categories,
    subcategories,
    cities,
    dispatch,
  ]);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={clsx(styles.container, className)}> 
      <div className={styles.filtersList}>
        {activeFilters.map(filter => (
          <Button
            key={filter.id}
            variant="tertiary"
            onClick={filter.onRemove}
            endIcon={<Icon name="close" size={14} />}
          >
            {filter.label}
          </Button>
        ))}
        
      </div>
    </div>
  );
};