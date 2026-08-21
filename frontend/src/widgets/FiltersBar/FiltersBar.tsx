import { SkillTypeFilter } from '@widgets/FiltersBar/components/SkillTypeFilter.tsx';
import { CategoryFilter } from '@widgets/FiltersBar/components/CategoryFilter.tsx';
import { GenderFilter } from '@widgets/FiltersBar/components/GenderFilter.tsx';
import { CityFilter } from '@widgets/FiltersBar/components/CityFilter.tsx';
import styles from './FiltersBar.module.css';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks.ts';
import { selectActiveFiltersCount } from '@/features/filters/selectors.ts';
import { Button } from '@shared/ui';
import { resetFilters } from '@/features/filters/slice.ts';
import crossGreen from '@/assets/cross-green.svg'

function FiltersBar() {
  const dispatch = useAppDispatch();
  const selectedFiltersCount = useAppSelector(selectActiveFiltersCount);
  const hasActiveFilters = selectedFiltersCount > 0;

  return (
    <div className={styles.sidebar}>
      <div className={styles.top}>
        <h2 className={styles.title}>
          Фильтры {hasActiveFilters && <span>({selectedFiltersCount})</span>}
        </h2>
        
        {hasActiveFilters && (
          <Button
            className={styles.clean}
            endIcon={<img src={crossGreen} alt="" aria-hidden="true" />}
            variant="text"
            onClick={() => dispatch(resetFilters())}
          >
            Сбросить
          </Button>
        )}
      </div>

      <div className={styles.filters}>
        <SkillTypeFilter />
        <CategoryFilter />
        <GenderFilter />
        <CityFilter />
      </div>
    </div>
  );
}

export default FiltersBar;