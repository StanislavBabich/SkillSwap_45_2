import React from 'react';
import clsx from 'clsx';
import styles from './Headline.module.css';

type HeadlineLevel = 1 | 2 | 3 | 4 | 5 | 6;

const LEVEL_TO_TAG = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const;

export interface HeadlineProps extends React.ComponentPropsWithoutRef<'h1'> {
  level?: HeadlineLevel;
}

export const Headline = ({
  level = 2,
  className,
  children,
  ...rest
}: HeadlineProps) => {
  const Tag = LEVEL_TO_TAG[level];

  return (
    <Tag
      className={clsx(styles.headline, styles[`level-${level}`], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};
