import type { ChangeEvent, ReactElement, ReactNode } from 'react';
import { Children, Fragment, cloneElement, isValidElement, useId, useState } from 'react';
import clsx from 'clsx';

import styles from './RadioGroup.module.css';

type RadioChildProps = {
  value: string;
  name?: string;
  checked?: boolean;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  children?: ReactNode;
};

type RadioGroupBaseProps = {
  name: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  className?: string;
  children?: ReactNode;
  orientation?: 'vertical' | 'horizontal';
  required?: boolean;
  disabled?: boolean;
};

export type RadioGroupProps =
  RadioGroupBaseProps &
    (
      | { value: string; defaultValue?: never }
      | { value?: never; defaultValue: string }
    );

export const RadioGroup = ({
  name,
  value: valueProp,
  defaultValue,
  onChange,
  label,
  error,
  className,
  children,
  orientation = 'vertical',
  required = false,
  disabled = false,
}: RadioGroupProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const errorId = useId();

  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : internalValue;

  const handleChange = (childValue: string, event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // Не даем изменять если группа отключена
    
    if (!isControlled) setInternalValue(childValue);
    onChange?.(childValue, event);
  };

  const mapChild = (child: ReactNode): ReactNode => {
    if (!isValidElement(child)) return child;

    if (child.type === Fragment) {
      return Children.map(
        (child as ReactElement<{ children?: ReactNode }>).props.children,
        mapChild
      );
    }

    const element = child as ReactElement<RadioChildProps>;
    if (element.props.value === undefined) return child;

    const childValue = element.props.value;

    return cloneElement(element, {
      name,
      checked: selectedValue === childValue,
      disabled: disabled || element.props.disabled, // Наследуем disabled от группы
      onChange: (_value: string, event: ChangeEvent<HTMLInputElement>) =>
        handleChange(childValue, event),
    });
  };

  const childrenWithProps = Children.map(children, mapChild);

  return (
    <fieldset
      className={clsx(styles.root, styles[orientation], className)}
      role="radiogroup"
      aria-required={required}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
      disabled={disabled} // HTML-атрибут для fieldset
    >
      {label && (
        <legend className={styles.legend}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </legend>
      )}

      <div className={styles.options}>
        {childrenWithProps}
      </div>

      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </fieldset>
  );
};