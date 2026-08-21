import { useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

import styles from './checkbox.module.css';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  indeterminate?: boolean;
};

export const Checkbox = ({
  className,
  indeterminate = false,
  children,
  ...props
}: CheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={clsx(styles.root, className)}>
      <span className={styles.clickArea}>
        <input
          ref={inputRef}
          type="checkbox"
          className={styles.input}
          {...props}
        />
        <span className={styles.box} aria-hidden="true">
          <span className={styles.icon} />
        </span>
      </span>
      {children && <span className={styles.content}>{children}</span>}
    </label>
  );
};