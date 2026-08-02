import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useState,
} from 'react';
import clsx from 'clsx';

import styles from './CheckboxGroup.module.css';

import type { ReactNode, ReactElement, ChangeEvent } from 'react';
import type { CheckboxProps } from '@/shared/ui/Checkbox';

type Orientation = 'vertical' | 'horizontal' | 'grid';

interface BaseProps {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  children?: ReactNode;
  orientation?: Orientation;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
  showCounter?: boolean;
  maxSelections?: number;
}

export type CheckboxGroupProps = BaseProps &
  (
    | { value: string[]; defaultValue?: never }
    | { value?: string[]; defaultValue: string[] }
  ) & {
    name: string;
    onChange?: (
      values: string[],
      event: ChangeEvent<HTMLInputElement>
    ) => void;
  };

export const CheckboxGroup = (props: CheckboxGroupProps) => {
  const {
    label,
    description,
    error,
    className,
    children,
    required = false,
    disabled = false,
    orientation = 'vertical',
    columns = 2,
    showCounter = false,
    maxSelections,
    value: controlledValue,
    defaultValue,
    onChange,
    name,
    ...rest
  } = props;

  const errorId = useId();
  const descriptionId = useId();
  const labelId = useId();

  const isControlled = controlledValue !== undefined;

  const [internalValue, setInternalValue] = useState<string[]>(
    defaultValue ?? []
  );

  const selectedValues = isControlled
    ? controlledValue ?? []
    : internalValue;

  const handleChange = (
    childValue: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    let newValues = selectedValues.includes(childValue)
      ? selectedValues.filter((v) => v !== childValue)
      : [...selectedValues, childValue];

    if (maxSelections && newValues.length > maxSelections) {
      return;
    }

    if (!isControlled) {
      setInternalValue(newValues);
    }

    onChange?.(newValues, event);
  };

  function isCheckboxElement(
    child: ReactNode
  ): child is ReactElement<CheckboxProps> {
    if (!isValidElement(child)) return false;

    const props = child.props as Record<string, unknown>;
    return typeof props.value === 'string';
  }

  const childrenWithProps = Children.map(children, (child) => {
    if (isCheckboxElement(child)) {
      const childValue = child.props.value as string;

      return cloneElement(child, {
        name,
        checked: selectedValues.includes(childValue),
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          handleChange(childValue, e),
        disabled: disabled || child.props.disabled,
      });
    }

    return child;
  });

  const describedByIds =
    [
      error ? errorId : null,
      description ? descriptionId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <fieldset
      aria-required={required}
      aria-disabled={disabled}
      aria-invalid={!!error}
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={describedByIds}
      className={clsx(styles.root, styles[orientation], className)}
      {...rest}
    >
      {label && (
        <legend id={labelId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
          {showCounter && maxSelections && (
            <span className={styles.counter}>
              ({selectedValues.length}/{maxSelections})
            </span>
          )}
        </legend>
      )}

      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}

      <div
        className={styles.options}
        style={
          orientation === 'grid'
            ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
            : undefined
        }
      >
        {childrenWithProps}
      </div>

      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </fieldset>
  );
};