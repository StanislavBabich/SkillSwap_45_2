import { useMemo } from 'react';
import clsx from 'clsx';

import { useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import { Tag, UserInfo } from '@/shared/ui';
import { selectSkillWithDetails } from '@/features/skills/selectors';

import styles from './UserSidebar.module.css';

export interface UserSidebarProps {
  skillId: EntityId;
  className?: string;
}

export const UserSidebar = ({ skillId, className }: UserSidebarProps) => {
  const skillSelector = useMemo(() => selectSkillWithDetails(skillId), [skillId]);
  const data = useAppSelector(skillSelector);

  if (!data || !data.user) {
    return null;
  }

  return (
    <div className={clsx(styles.root, className)}>
      <UserInfo
        userId={data.user.id}
        size="md"
        showCity
        orientation="horizontal"
        nameClassName={styles.name}
        className={styles.userInfo}
      />
      {data.user.about && (
        <p className={styles.about}>{data.user.about}</p>
      )}
      <div className={styles.categories}>
        <section className={styles.section}>
          <h4 className={styles.categoryTitle}>Навык</h4>
          <div className={styles.tags}>
            <Tag variant="default">
              {data.title}
            </Tag>
          </div>
        </section>
        {data.category && (
          <section className={styles.section}>
            <h4 className={styles.categoryTitle}>Категория</h4>
            <div className={styles.tags}>
              <Tag variant="default">
                {data.category.name}
              </Tag>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};