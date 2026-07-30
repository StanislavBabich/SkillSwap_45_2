import { useState, useEffect, useRef, useId } from 'react';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/Icon';
import styles from './DropDownCity.module.css';

export type CityOption = {
  value: string;
  label: string;
};

export interface DropDownCityProps {
  value?: string;
  onChange?: (value: string) => void;
  options: CityOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  /** Минимальное количество символов для поиска */
  minSearchLength?: number;
  /** Максимальное количество результатов */
  maxResults?: number;
}

export const DropDownCity = ({
  value,
  onChange,
  options,
  placeholder = 'Выберите город',
  label,
  error,
  disabled = false,
  required = false,
  className,
  minSearchLength = 1,
  maxResults = 50,
}: DropDownCityProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<CityOption[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  
  const generatedId = useId();
  const searchId = `city-search-${generatedId}`;
  const listboxId = `${searchId}-listbox`;

  // Находим выбранный город
  const selectedOption = options.find(opt => opt.value === value);

  // Фильтрация городов при вводе
  useEffect(() => {
    if (searchTerm.length < minSearchLength) {
      setFilteredOptions([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = options
      .filter(opt => opt.label.toLowerCase().includes(searchLower))
      .slice(0, maxResults);

    setFilteredOptions(filtered);
    setHighlightedIndex(filtered.length > 0 ? 0 : -1);
  }, [searchTerm, options, minSearchLength, maxResults]);

  // Закрытие при клике вне
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // Открываем список только если есть что искать
    if (newValue.length >= minSearchLength) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    
    // Если поле пустое, сбрасываем выбранное значение
    if (newValue === '') {
      onChange?.('');
    }
  };

  const handleSelectCity = (city: CityOption) => {
    onChange?.(city.value);
    setSearchTerm(city.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelectCity(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // НЕ открываем список при фокусе
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChevronClick = () => {
    if (disabled) return;
    
    // При клике на шеврон открываем список и показываем все города
    setSearchTerm(''); // Очищаем поиск
    setFilteredOptions(options.slice(0, maxResults)); // Показываем первые maxResults городов
    setIsOpen(!isOpen);
    inputRef.current?.focus();
  };

  return (
    <div 
      ref={rootRef} 
      className={clsx(styles.root, className, isOpen && styles.rootOpen)}
    >
      {label && (
        <label htmlFor={searchId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <div className={styles.field}>
        <div 
          className={clsx(
            styles.inputWrapper,
            disabled && styles.disabled,
            error && styles.error,
            isFocused && !isOpen && styles.inputWrapperFocused,
            isOpen && styles.inputWrapperOpen
          )}
        >
          <input
            ref={inputRef}
            id={searchId}
            type="text"
            className={styles.input}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={selectedOption ? selectedOption.label : placeholder}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-activedescendant={highlightedIndex >= 0 ? `${listboxId}-${highlightedIndex}` : undefined}
          />
          <span 
            className={clsx(styles.chevron, isOpen && styles.chevronOpen)}
            onClick={handleChevronClick}
          >
            <Icon name="chevron-down" size={24} />
          </span>
        </div>

        {isOpen && (
          <div className={styles.dropdownContainer}>
            {filteredOptions.length > 0 ? (
              <div
                ref={listboxRef}
                id={listboxId}
                className={styles.listbox}
                role="listbox"
              >
                {filteredOptions.map((city, index) => (
                  <button
                    key={city.value}
                    id={`${listboxId}-${index}`}
                    type="button"
                    className={clsx(
                      styles.option,
                      highlightedIndex === index && styles.optionHighlighted,
                      city.value === value && styles.optionSelected
                    )}
                    role="option"
                    aria-selected={city.value === value}
                    onClick={() => handleSelectCity(city)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            ) : (
              searchTerm.length >= minSearchLength && (
                <div className={styles.noResults}>
                  Городов не найдено
                </div>
              )
            )}
          </div>
        )}
      </div>

      {error && (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};