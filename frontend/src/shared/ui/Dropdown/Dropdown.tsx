import clsx from 'clsx';
import React, { useEffect, useId, useRef, useState } from 'react';
import { Checkbox, Radio } from '@/shared/ui';
import { Icon } from '@/shared/ui/Icon';
import styles from './Dropdown.module.css';

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type DropdownMode = 'multiple' | 'single';

export interface DropdownProps {
  value?: string[];
  defaultValue?: string[];
  options: DropdownOption[];
  mode?: DropdownMode;
  onChange?: (values: string[]) => void;
  title?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean | string;
  helperText?: string;
  label?: string;
  name?: string;
  required?: boolean;
  className?: string;
  /** Показывать счетчик выбранных элементов (для mode="multiple") */
  showCounter?: boolean;
  /** Текст для счетчика, например "Выбрано: {count}" */
  counterText?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  defaultValue,
  options,
  mode = 'multiple',
  onChange,
  title,
  placeholder = 'Выберите опцию',
  disabled = false,
  error,
  helperText,
  label,
  name,
  required,
  className,
  showCounter = true,
  counterText = 'Выбрано: {count}',
}) => {
  const getSafeArray = (input: unknown): string[] => {
    if (Array.isArray(input)) {
      return input;
    }
    return [];
  };

  const selectedValues = getSafeArray(value ?? defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  
  const generatedId = useId();
  const dropdownId = name || `dropdown-${generatedId}`;
  const listboxId = `${dropdownId}-listbox`;
  const errorId = `${dropdownId}-error`;

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
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Сброс focusedIndex при открытии
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  const toggleValue = (optionValue: string) => {
    if (mode === 'single') {
      onChange?.([optionValue]);
      setIsOpen(false);
      triggerRef.current?.focus();
    } else {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValues);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return title || placeholder;
    }

    // Для single режима показываем название выбранной опции
    if (mode === 'single') {
      const selectedOption = options.find(opt => opt.value === selectedValues[0]);
      return selectedOption?.label || selectedValues[0];
    }

    // Для multiple режима показываем счетчик
    if (showCounter) {
      return counterText.replace('{count}', String(selectedValues.length));
    }

    // Если счетчик отключен, показываем список выбранных (как было)
    return selectedValues
      .map((val) => options.find((opt) => opt.value === val)?.label || val)
      .join(', ');
  };

  const errorText = typeof error === 'string' ? error : '';
  const hasError = !!error || !!errorText;

  return (
    <div 
      ref={rootRef} 
      className={clsx(styles.root, className, isOpen && styles.rootOpen)}
    >
      {label && (
        <label 
          htmlFor={dropdownId} 
          className={styles.label}
        >
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <div className={styles.field}>
        <button
          ref={triggerRef}
          id={dropdownId}
          type="button"
          className={clsx(
            styles.trigger,
            isOpen && styles.triggerOpen,
            disabled && styles.triggerDisabled,
            hasError && styles.triggerError
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-labelledby={label ? dropdownId : undefined}
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
        >
          <span className={clsx(
            styles.value,
            !selectedValues.length && styles.valuePlaceholder
          )}>
            {getDisplayText()}
          </span>
          <span className={clsx(
            styles.chevron,
            isOpen && styles.chevronOpen
          )}>
            <Icon name="chevron-down" size={20} className={styles.chevronIcon} />
          </span>
        </button>

        {isOpen && (
          <div
            ref={listboxRef}
            id={listboxId}
            className={styles.listbox}
            role="listbox"
            aria-multiselectable={mode === 'multiple'}
            aria-labelledby={dropdownId}
          >
            {options.map((option, index) => {
              const isSelected = selectedValues.includes(option.value);
              const isFocused = focusedIndex === index;

              return (
                <div
                  key={option.value}
                  className={clsx(
                    styles.option,
                    isSelected && styles.optionSelected,
                    isFocused && styles.optionFocused,
                    option.disabled && styles.optionDisabled
                  )}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onMouseLeave={() => setFocusedIndex(-1)}
                >
                  {mode === 'single' ? (
                     <Radio
                      checked={isSelected}
                      onChange={() => toggleValue(option.value)}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </Radio>
                  ) : (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleValue(option.value)}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </Checkbox>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(errorText || helperText) && (
        <div
          id={errorId}
          className={clsx(styles.helperText, hasError && styles.errorText)}
          role={hasError ? 'alert' : undefined}
        >
          {errorText || helperText}
        </div>
      )}
    </div>
  );
};