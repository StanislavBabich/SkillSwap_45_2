import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Checkbox, Button } from '@/shared/ui';
import { CheckboxGroup } from '@/shared/ui/CheckboxGroup';
import { Icon } from '@/shared/ui/Icon';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { initializeCities, selectCities } from '@/features/cities/slice';
import { toggleCityFilter } from '@/features/filters/slice';
import type { City } from '@/entities/city/types';
import styles from './CityFilter.module.css';

const VISIBLE_CITIES_COUNT = 5;

export const CityFilter = () => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(selectCities);
  const selectedCityIds = useAppSelector((state) => state.filters?.selectedCityIds ?? []);
  const [showAllCities, setShowAllCities] = useState(false);

  useEffect(() => {
    dispatch(initializeCities());
  }, [dispatch]);

  useEffect(() => {
    if (cities.length <= VISIBLE_CITIES_COUNT) {
      setShowAllCities(false);
    }
  }, [cities.length]);

  const initialCities = cities.slice(0, VISIBLE_CITIES_COUNT);
  const extraCities = cities.slice(VISIBLE_CITIES_COUNT);

  const handleCityToggle = (cityId: number) => {
    dispatch(toggleCityFilter(cityId));
  };

  const renderCityRow = (city: City) => (
    <div key={city.id} className={styles.cityRow}>
      <Checkbox
        name={`city-${city.id}`}
        value={String(city.id)}
        checked={selectedCityIds.includes(city.id)}
        onChange={() => handleCityToggle(city.id)}
      >
        {city.name}
      </Checkbox>
    </div>
  );

  // Обработчик для CheckboxGroup (можно оставить пустым, так как управление через отдельные чекбоксы)
  const handleGroupChange = () => {
    // Группа управляется через отдельные чекбоксы, поэтому ничего не делаем
  };

  return (
    <div>
      <CheckboxGroup
        name="cities"
        label="Город"
        value={selectedCityIds.map(String)}
        onChange={handleGroupChange}
        orientation="vertical"
      >
        {initialCities.map(renderCityRow)}
        
        {extraCities.length > 0 && (
          <div
            className={clsx(styles.extraCitiesWrapper, showAllCities && styles.expanded)}
          >
            <div className={styles.extraCitiesInner}>
              {extraCities.map(renderCityRow)}
            </div>
          </div>
        )}
      </CheckboxGroup>

      {cities.length > VISIBLE_CITIES_COUNT && (
        <Button
          variant="text"
          size="medium"
          className={styles.showAllButton}
          onClick={() => setShowAllCities(!showAllCities)}
          endIcon={

            <Icon
              name="chevron-down"
              size={20}
              className={clsx(styles.showAllChevron, showAllCities && styles.showAllChevronExpanded)}
              aria-hidden="true"
            />
          }
        >
          <span className={styles.showAllButtonText}>
            {showAllCities ? 'Свернуть' : 'Все города'}
          </span>
        </Button>
      )}
    </div>
  );
};