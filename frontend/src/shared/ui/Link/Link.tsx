import type React from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Link.module.css';

type LinkVariant = 'primary' | 'secondary' | 'text';
type LinkSize = 'sm' | 'md' | 'lg';
type LinkUnderline = 'always' | 'hover' | 'never';
type LinkTarget = '_self' | '_blank';

type CommonProps = {
  children: React.ReactNode;
  to: string;

  variant?: LinkVariant;
  size?: LinkSize;
  underline?: LinkUnderline;

  // target — только для внешних ссылок (когда to = https/mailto/tel)
  target?: LinkTarget;

  className?: string;
  activeClassName?: string;
  ariaLabel?: string;
};

type RouterExtraProps = Omit<
  React.ComponentPropsWithoutRef<typeof RouterLink>,
  'to' | 'className' | 'children' | 'aria-label'
>;

type AnchorExtraProps = Omit<
  React.ComponentPropsWithoutRef<'a'>,
  'href' | 'className' | 'children' | 'target' | 'aria-label'
>;

export type LinkProps = CommonProps & RouterExtraProps & AnchorExtraProps;

const isExternalHref = (to: string) => /^(https?:\/\/|mailto:|tel:)/i.test(to);

export const Link: React.FC<LinkProps> = ({
  to,
  variant = 'primary',
  size = 'md',
  underline,
  target = '_self',
  className = '',
  activeClassName = '',
  ariaLabel,
  children,
  rel,
  ...rest
}) => {
  const underlineStyle: LinkUnderline = underline ?? (variant === 'text' ? 'never' : 'hover');

  const baseClasses = clsx(
    styles.link,
    styles[variant],
    styles[size],
    styles[`underline-${underlineStyle}`],
    className
  );

  // Внешняя ссылка (<a>)
  if (isExternalHref(to)) {
    const safeRel = target === '_blank' ? clsx(rel, 'noopener', 'noreferrer') : rel;

    return (
      <a
        href={to}
        className={baseClasses}
        target={target}
        rel={safeRel}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // Внутренняя ссылка с activeClassName -> NavLink
  if (activeClassName) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          clsx(baseClasses, isActive && styles.active, isActive && activeClassName)
        }
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </NavLink>
    );
  }

  // Обычная внутренняя ссылка -> RouterLink
  return (
    <RouterLink to={to} className={baseClasses} aria-label={ariaLabel} {...rest}>
      {children}
    </RouterLink>
  );
};
