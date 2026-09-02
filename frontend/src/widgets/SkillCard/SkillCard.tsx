import { useMemo } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import { Button, Headline, Tag, UserInfo } from '@/shared/ui';
import { selectSkillWithDetails } from '@/features/skills/selectors';
import { selectUserById } from '@/features/users/slice';
import { LikeButton } from '@/widgets/SkillCard/components/LikeButton';
import styles from './SkillCard.module.css';

export interface SkillCardProps {
  skillId: EntityId;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  onClick?: (skillId: EntityId) => void;
}

export const SkillCard = ({
  skillId,
  variant = 'default',
  className = '',
  onClick,
}: SkillCardProps) => {
  const skillSelector = useMemo(() => selectSkillWithDetails(skillId), [skillId]);
  const skill = useAppSelector(skillSelector);
  const user = useAppSelector((state) =>
    skill?.user ? selectUserById(state, skill.user.id) : null
  );

  if (!skill || !skill.user) {
    return null;
  }

  const handleOpenDetails = () => {
    onClick?.(skillId);
  };

  const wantToLearn = user?.wantToLearn ?? [];
  const visibleWantToLearn = wantToLearn.slice(0, 3);
  const overflowCount = wantToLearn.length - 3;

  return (
    <article className={clsx(styles.card, styles[`variant_${variant}`], className)}>
      <div className={styles.like}>
        <LikeButton skillId={skillId} size={variant === 'compact' ? 'sm' : 'md'} />
      </div>

      <UserInfo
        userId={skill.user.id}
        size={variant === 'compact' ? 'sm' : 'md'}
        orientation="horizontal"
        className={styles.userInfo}
      />

      <div className={styles.skillsSections}>
        <div className={styles.section}>
          <Headline level={4} className={styles.sectionTitle}>
            Can teach:
          </Headline>
          <div className={styles.tags}>
            <Tag categoryName={skill.category?.name}>{skill.title}</Tag>
          </div>
        </div>

        {wantToLearn.length > 0 && (
          <div className={styles.section}>
            <Headline level={4} className={styles.sectionTitle}>
              Wants to learn:
            </Headline>
            <div className={styles.tags}>
              {visibleWantToLearn.map((cat) => (
                <Tag key={cat.id} categoryName={cat.name}>
                  {cat.name}
                </Tag>
              ))}
              {overflowCount > 0 && <Tag overflow={overflowCount}>+{overflowCount}</Tag>}
            </div>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="primary"
        size="medium"
        fullWidth
        className={styles.actions}
        onClick={handleOpenDetails}
      >
        More details
      </Button>
    </article>
  );
};