import { useState, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Input } from '@/shared/ui/Input';
import { useDebounce } from '@/shared/hooks';

import {
  setSearchFilter,
  selectSearch,
} from '@/features/filters/slice';

import SearchIcon from '@/assets/search.svg';
import styles from './SearchInput.module.css';

export const SearchInput = () => {
  const dispatch = useAppDispatch();
  const searchFromRedux = useAppSelector(selectSearch);

  const [localValue, setLocalValue] = useState(searchFromRedux);
  const debouncedValue = useDebounce(localValue, 400);

  // Debounce-обновление Redux
  useEffect(() => {
    if (debouncedValue !== searchFromRedux) {
      dispatch(setSearchFilter(debouncedValue));
    }
  }, [debouncedValue, searchFromRedux, dispatch]);

  // Синхронизация при resetFilters
  useEffect(() => {
    setLocalValue(searchFromRedux);
  }, [searchFromRedux]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setLocalValue('');
      return;
    }

    if (e.key === 'Enter' && localValue !== searchFromRedux) {
      dispatch(setSearchFilter(localValue));
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <Input
        placeholder="Search for a skill"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        startAdornment={
          <img
            src={SearchIcon}
            alt=""
            className={styles.searchIcon}
          />
        }
        className={styles.searchInput}
        fullWidth={false}
        hideHelper={true} 
      />
    </div>
  );
};
