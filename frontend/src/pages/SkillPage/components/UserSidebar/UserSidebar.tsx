import type { EntityId } from '@/entities/base';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import clsx from 'clsx';
import { Tag, UserInfo } from '@/shared/ui';
import styles from './UserSidebar.module.css';

export interface UserSidebarProps {
  skillId: EntityId;
  skill: Skill;
  user: User | null;
  className?: string;
}

export const UserSidebar = ({ skillId, skill, user, className }: UserSidebarProps) => {
  if (!user) return null;

  const wantToLearn = user.wantToLearn ?? [];
  const visibleWantToLearn = wantToLearn.slice(0, 5);
  const overflowCount = wantToLearn.length - 5;

  return (
    <div className={clsx(styles.root, className)}>
      <UserInfo
        userId={user.id}
        size="md"
        showCity
        orientation="horizontal"
        nameClassName={styles.name}
        className={styles.userInfo}
      />
      {user.about && (
        <p className={styles.about}>{user.about}</p>
      )}
      <div className={styles.categories}>
        <section className={styles.section}>
          <h4 className={styles.categoryTitle}>Может научить</h4>
          <div className={styles.tags}>
            <Tag categoryName={skill.category?.name}>{skill.title}</Tag>
          </div>
        </section>
        {wantToLearn.length > 0 && (
          <section className={styles.section}>
            <h4 className={styles.categoryTitle}>Хочет научиться</h4>
            <div className={styles.tags}>
              {visibleWantToLearn.map((cat) => (
                <Tag key={cat.id} categoryName={cat.name}>
                  {cat.name}
                </Tag>
              ))}
              {overflowCount > 0 && <Tag overflow={overflowCount}>+{overflowCount}</Tag>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};