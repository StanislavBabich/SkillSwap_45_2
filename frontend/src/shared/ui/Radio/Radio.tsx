import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Содержимое (текст рядом с радио) */
  children?: React.ReactNode;
  /** Дополнительное описание */
  description?: string;
  /** Отключен ли радио */
  disabled?: boolean;
  /** Класс для обертки */
  className?: string;
  /** Показывать ли ошибку */
  error?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  children,
  description,
  disabled = false,
  className,
  error = false,
  id,
  ...props
}, ref) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx(styles.root, disabled && styles.disabled, className)}>
      <label htmlFor={radioId} className={styles.label}>
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={clsx(styles.input, error && styles.error)}
          disabled={disabled}
          {...props}
        />
        <span className={styles.radio} aria-hidden="true" />
        {children && <span className={styles.content}>{children}</span>}
      </label>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
});

Radio.displayName = 'Radio';