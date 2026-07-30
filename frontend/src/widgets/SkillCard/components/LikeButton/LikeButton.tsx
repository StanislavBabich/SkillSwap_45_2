import { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import { selectSkillLikes } from '@/features/skills/selectors';
import { toggleSkillLike } from '@/features/skills/slice';
import { AuthService } from '@/features/auth';

import styles from './LikeButton.module.css';

export interface LikeButtonProps {
  /** ID навыка */
  skillId: EntityId;

  /** Размер */
  size?: 'sm' | 'md';

  /** Обработчик клика */
  onToggle?: (skillId: EntityId, isLiked: boolean) => void;
}

export const LikeButton = ({ skillId, size = 'md', onToggle }: LikeButtonProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const gradientId = useId();
  const [isAnimating, setIsAnimating] = useState(false);
  const currentUserId = AuthService.getCurrentUser()?.id ?? null;

  const likesSelector = useMemo(() => selectSkillLikes(skillId), [skillId]);
  const likes = useAppSelector(likesSelector);
  const isLiked = currentUserId !== null ? likes.includes(currentUserId) : false;
  const displayCount = likes.length;

  const handleToggle = () => {
    if (currentUserId === null) {
      navigate('/login');
      return;
    }

    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 220);

    const nextIsLiked = !isLiked;
    dispatch(toggleSkillLike({ skillId, userId: currentUserId }));
    onToggle?.(skillId, nextIsLiked);
  };

  return (
    <button
      type="button"
      className={clsx(styles.root, styles[`size_${size}`], isLiked && styles.liked, isAnimating && styles.animate)}
      onClick={handleToggle}
      aria-label={`${isLiked ? 'Убрать лайк' : 'Поставить лайк'} (${displayCount})`}
      aria-pressed={isLiked}
    >
      <div className={styles.content}>
        <svg
          className={styles.icon}
          width="24"
          height="24"
          viewBox="-1 -1 22 20"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} gradientTransform="rotate(315)">
              <stop offset="0%" stopColor="#EA8FB0" />
              <stop offset="100%" stopColor="#FC0500" />
            </linearGradient>
          </defs>
          <path
            className={styles.iconOutline}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            d="M10 17.9535C9.71163 17.9535 9.43256 17.9163 9.2 17.8326C5.64651 16.614 0 12.2884 0 5.89767C0 2.64186 2.63256 0 5.86977 0C7.44186 0 8.91163 0.613954 10 1.71163C11.0884 0.613954 12.5581 0 14.1302 0C17.3674 0 20 2.65116 20 5.89767C20 12.2977 14.3535 16.614 10.8 17.8326C10.5674 17.9163 10.2884 17.9535 10 17.9535Z"
          />
          <path
            className={styles.iconOutlineActive}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="1.5"
            d="M10 17.9535C9.71163 17.9535 9.43256 17.9163 9.2 17.8326C5.64651 16.614 0 12.2884 0 5.89767C0 2.64186 2.63256 0 5.86977 0C7.44186 0 8.91163 0.613954 10 1.71163C11.0884 0.613954 12.5581 0 14.1302 0C17.3674 0 20 2.65116 20 5.89767C20 12.2977 14.3535 16.614 10.8 17.8326C10.5674 17.9163 10.2884 17.9535 10 17.9535Z"
          />
          <path
            className={styles.iconFill}
            fill={`url(#${gradientId})`}
            d="M10 17.9535C9.71163 17.9535 9.43256 17.9163 9.2 17.8326C5.64651 16.614 0 12.2884 0 5.89767C0 2.64186 2.63256 0 5.86977 0C7.44186 0 8.91163 0.613954 10 1.71163C11.0884 0.613954 12.5581 0 14.1302 0C17.3674 0 20 2.65116 20 5.89767C20 12.2977 14.3535 16.614 10.8 17.8326C10.5674 17.9163 10.2884 17.9535 10 17.9535Z"
          />
        </svg>

        <span className={styles.count}>{displayCount}</span>
      </div>
    </button>
  );
};
