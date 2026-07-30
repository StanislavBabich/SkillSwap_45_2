import { useMemo } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import type { TagVariant } from '@/shared/ui/Tag';
import { Button, Headline, Tag, UserInfo } from '@/shared/ui';
import { selectSkillWithDetails } from '@/features/skills/selectors';
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

  if (!skill || !skill.user) {
    return null;
  }

  const handleOpenDetails = () => {
    onClick?.(skillId);
  };

  return (
    <article className={clsx(styles.card, styles[`variant_${variant}`], className)}>
      <div className={styles.like}>
        <LikeButton
          skillId={skillId}
          size={variant === 'compact' ? 'sm' : 'md'}
        />
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
            Навык:
          </Headline>
          <div className={styles.tags}>
            <Tag variant="default">
              {skill.title}
            </Tag>
          </div>
        </div>

        <div className={styles.section}>
          <Headline level={4} className={styles.sectionTitle}>
            Категория:
          </Headline>
          <div className={styles.tags}>
            <Tag variant="default">
              {skill.category?.name ?? 'Без категории'}
            </Tag>
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