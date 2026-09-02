import React, {
  forwardRef,
  useId,
  useState,
  InputHTMLAttributes,
} from 'react';
import clsx from 'clsx';

import styles from './Input.module.css';
import EyeIcon from '../../../assets/eye.svg';
import EyeSlashIcon from '../../../assets/eye-slash.svg';
import CrossIcon from '../../../assets/cross.svg';

export type InputVariant = 'default';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  error?: boolean | string;
  success?: boolean;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  isLoading?: boolean;
  wrapperClassName?: string;
  hideHelper?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    variant = 'default',
    error = false,
    success = false,
    disabled = false,
    fullWidth = true,
    label,
    helperText,
    startAdornment,
    endAdornment,
    isLoading = false,
    className,
    wrapperClassName,
    type = 'text',
    readOnly = false,
    value,
    onChange,
    id,
    hideHelper = false,
    ...rest
  } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [showPassword, setShowPassword] = useState(false);

  const isError = Boolean(error);
  const isSuccess = !isError && success;

  const helper = typeof error === 'string' ? error : (helperText ?? '');

  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  const showClearBtn =
    !disabled &&
    !isLoading &&
    endAdornment == null &&
    value != null &&
    value !== '';

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();

    if (onChange) {
      const event = {
        target: { value: '', name: rest.name },
        currentTarget: { value: '', name: rest.name },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(event);
    }
  };

  const wrapperClasses = clsx(styles.inputWrapper, fullWidth && styles.fullWidth, wrapperClassName);

  const containerClasses = clsx(
    styles.inputContainer,
    styles[`variant_${variant}`],
    isError && styles.inputError,
    isSuccess && styles.inputSuccess,
    disabled && styles.inputDisabled,
    isLoading && styles.inputLoading,
    className
  );

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.inputLabel}>
          {label}
        </label>
      )}

      <div className={containerClasses}>
        {startAdornment && (
          <div className={styles.inputAdornmentStart}>
            {startAdornment}
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          type={actualType}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          className={styles.inputField}
          aria-invalid={isError || undefined}
          aria-busy={isLoading || undefined}
          aria-describedby={
            helper ? `${inputId}-helper` : undefined
          }
          {...rest}
        />

        <div className={styles.inputAdornmentEnd}>
          {/* Лоадер */}
          {isLoading && (
            <div className={styles.inputSpinner} />
          )}

          {/* Очистка */}
          {showClearBtn && (
            <button
              type="button"
              className={styles.inputIconButton}
              onClick={handleClear}
              aria-label="Clear field"
            >
              <img
                src={CrossIcon}
                alt=""
                className={styles.inputIcon}
              />
            </button>
          )}

          {/* Переключение пароля */}
          {isPassword && !disabled && (
            <button
              type="button"
              className={styles.inputIconButton}
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              <img
                src={
                  showPassword
                    ? EyeSlashIcon
                    : EyeIcon
                }
                alt=""
                className={styles.inputIcon}
              />
            </button>
          )}

          {endAdornment}
        </div>
      </div>

      {!hideHelper && (
        <p
          id={helper ? `${inputId}-helper` : undefined}
          className={clsx(styles.inputHelper, isError && styles.helperError, isSuccess && styles.helperSuccess)}
        >
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
