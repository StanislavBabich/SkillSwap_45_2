import React from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  as?: 'button' | 'a';
  children: React.ReactNode;
  className?: string;
};

type ButtonAsButton = ButtonOwnProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    href?: never;
  };

type ButtonAsAnchor = ButtonOwnProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export const Button = (props: ButtonProps) => {
  const {
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    isLoading = false,
    startIcon,
    endIcon,
    as = 'button',
    href,
    children,
    className,
    ...rest
  } = props;

  const isDisabled = disabled || isLoading;
  const classes = clsx(
    styles.root,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    className
  );

  if (as === 'a') {
    const { onClick, onKeyDown, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLAnchorElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        (event.currentTarget as HTMLAnchorElement).click();
      }
      onKeyDown?.(event);
    };

    return (
      <a
        {...anchorRest}
        className={classes}
        href={isDisabled ? undefined : href}
        aria-disabled={disabled || undefined}
        aria-busy={isLoading || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isDisabled ? -1 : anchorRest.tabIndex}
      >
        {startIcon ? <span className={styles.icon}>{startIcon}</span> : null}
        <span className={styles.content}>{children}</span>
        {endIcon ? <span className={styles.icon}>{endIcon}</span> : null}
      </a>
    );
  }

  const { onClick, onKeyDown, ...buttonRest } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      {...buttonRest}
      className={classes}
      type={buttonRest.type ?? 'button'}
      disabled={isDisabled}
      aria-disabled={disabled || undefined}
      aria-busy={isLoading || undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {startIcon ? <span className={styles.icon}>{startIcon}</span> : null}
      <span className={styles.content}>{children}</span>
      {endIcon ? <span className={styles.icon}>{endIcon}</span> : null}
    </button>
  );
};
