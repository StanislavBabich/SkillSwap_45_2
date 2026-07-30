import { useMemo } from 'react';
import clsx from 'clsx';

import { useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import type { TagVariant } from '@/shared/ui/Tag';
import { Tag, UserInfo } from '@/shared/ui';
import { selectSkillWithDetails, selectUserWantToLearnSkills } from '@/features/skills/selectors';

import styles from './UserSidebar.module.css';

const categoryToTagVariant = (categoryId: EntityId | null): TagVariant => {
  if (categoryId === 1) return 'business';
  if (categoryId === 2) return 'art';
  if (categoryId === 3) return 'language';
  if (categoryId === 4) return 'education';
  if (categoryId === 5) return 'health';
  if (categoryId === 6) return 'home';
  if (categoryId === 7) return 'tech';
  if (categoryId === 8) return 'sport';
  return 'default';
};

export interface UserSidebarProps {
  skillId: EntityId;
  className?: string;
}

export const UserSidebar = ({ skillId, className }: UserSidebarProps) => {
  const skillSelector = useMemo(() => selectSkillWithDetails(skillId), [skillId]);
  const data = useAppSelector(skillSelector);

  const wantToLearnSelector = useMemo(
    () => selectUserWantToLearnSkills(data?.userId ?? -1),
    [data?.userId]
  );
  const wantToLearnSkills = useAppSelector(wantToLearnSelector);

  if (!data || !data.user) {
    return null;
  }

  return (
    <div className={clsx(styles.root, className)}>
      <UserInfo
        userId={data.user.id}
        size="md"
        showCity
        showAge
        orientation="horizontal"
        nameClassName={styles.name}
        className={styles.userInfo}
      />
      {data.user.about && (
        <p className={styles.about}>{data.user.about}</p>
      )}
      <div className={styles.categories}>
        <section className={styles.section}>
          <h4 className={styles.categoryTitle}>Может научить</h4>
          <div className={styles.tags}>
            <Tag variant={categoryToTagVariant(data.category?.id ?? null)}>
              {data.subcategory?.name ?? data.name}
            </Tag>
          </div>
        </section>
        {wantToLearnSkills.length > 0 && (
          <section className={styles.section}>
            <h4 className={styles.categoryTitle}>Хочет научиться</h4>
            <div className={styles.tags}>
              {wantToLearnSkills.map((sub) => (
                <Tag
                  key={sub.id}
                  variant={categoryToTagVariant(sub.categoryId)}
                >
                  {sub.name}
                </Tag>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
