import { useMemo } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import type { TagVariant } from '@/shared/ui/Tag';
import { Button, Headline, Tag, UserInfo } from '@/shared/ui';
import { selectSkillWithDetails, selectUserWantToLearnSkills } from '@/features/skills/selectors';
import { LikeButton } from '@/widgets/SkillCard/components/LikeButton';

import styles from './SkillCard.module.css';

export interface SkillCardProps {
  skillId: EntityId;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  onClick?: (skillId: EntityId) => void;
}

const MAX_VISIBLE_WANT_TO_LEARN = 2;

const categoryToTagVariant = (categoryId: EntityId | null): TagVariant => {
  if (categoryId === 1) {
    return 'business';
  }
  if (categoryId === 2) {
    return 'art';
  }
  if (categoryId === 3) {
    return 'language';
  }
  if (categoryId === 4) {
    return 'education';
  }
  if (categoryId === 5) {
    return 'health';
  }
  if (categoryId === 6) {
    return 'home';
  }
  if (categoryId === 7) {
    return 'tech';
  }
  if (categoryId === 8) {
    return 'sport';
  }
  return 'default';
};

export const SkillCard = ({
  skillId,
  variant = 'default',
  className = '',
  onClick,
}: SkillCardProps) => {
  const skillSelector = useMemo(() => selectSkillWithDetails(skillId), [skillId]);
  const skill = useAppSelector(skillSelector);

  const wantToLearnSelector = useMemo(
    () => selectUserWantToLearnSkills(skill?.userId ?? -1),
    [skill?.userId]
  );
  const wantToLearnSkills = useAppSelector(wantToLearnSelector);

  if (!skill || !skill.user) {
    return null;
  }

  const visibleSkills = wantToLearnSkills.slice(0, MAX_VISIBLE_WANT_TO_LEARN);
  const overflowCount = wantToLearnSkills.length - MAX_VISIBLE_WANT_TO_LEARN;

  const handleOpenDetails = () => {
    onClick?.(skillId);
  };

  // Определяем вариант тега на основе категории
  const tagVariant = categoryToTagVariant(skill.category?.id ?? null);

  return (
    <article className={clsx(styles.card, styles[`variant_${variant}`], className)}>
      <div className={styles.like}>
        <LikeButton
          skillId={skillId}
          size={variant === 'compact' ? 'sm' : 'md'}
        />
      </div>

      <UserInfo
        userId={skill.userId}
        size={variant === 'compact' ? 'sm' : 'md'}
        orientation="horizontal"
        className={styles.userInfo}
      />

      <div className={styles.skillsSections}>
        <div className={styles.section}>
          <Headline level={4} className={styles.sectionTitle}>
            Может научить:
          </Headline>
          <div className={styles.tags}>
            <Tag variant={tagVariant}>
              {skill.name} 
            </Tag>
          </div>
        </div>

        <div className={styles.section}>
          <Headline level={4} className={styles.sectionTitle}>
            Хочет научиться:
          </Headline>
          <div className={styles.tags}>
            {visibleSkills.map((item) => (
              <Tag key={item.id} variant={categoryToTagVariant(item.categoryId)}>
                {item.name}
              </Tag>
            ))}
            {overflowCount > 0 && <Tag overflow={overflowCount}>+{overflowCount}</Tag>}
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="medium"
        fullWidth
        className={styles.actions}
        onClick={handleOpenDetails}
      >
        Подробнее
      </Button>
    </article>
  );
};