import type { ReactNode } from 'react';

import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({
  title = 'Nothing found',
  description = 'Try changing the filters or query.',
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className={styles.root} role="status" aria-live="polite">
      {icon && <div className={styles.icon}>{icon}</div>}

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
};
