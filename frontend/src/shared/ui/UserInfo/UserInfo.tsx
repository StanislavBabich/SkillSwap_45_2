import { useMemo } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import { selectUserWithDetails } from '@/features/users/selectors';
import { useAvatar } from '@/shared/hooks/useAvatar';
import styles from './UserInfo.module.css';

export interface UserInfoProps {
  userId: EntityId;
  size?: 'sm' | 'md' | 'lg';
  showCity?: boolean;
  showAge?: boolean;
  orientation?: 'horizontal' | 'vertical';
  nameClassName?: string;
  className?: string;
}

const SIZE_TO_PIXELS = {
  sm: 40,
  md: 56,
  lg: 80,
} as const;

export const UserInfo = ({
  userId,
  size = 'md',
  showCity = true,
  showAge = false,
  orientation = 'horizontal',
  nameClassName,
  className = '',
}: UserInfoProps) => {
  const selector = useMemo(() => selectUserWithDetails(userId), [userId]);
  const user = useAppSelector(selector);

  const avatarUrl = useAvatar({
    email: user?.email || `user-${userId}@example.com`,
    gender: user?.gender,
    size: SIZE_TO_PIXELS[size],
  });

  if (!user) return null;

  const metadata: string[] = [];
  if (showCity && user.city) metadata.push(user.city);

  return (
    <div className={clsx(styles.root, styles[`size_${size}`], styles[`orientation_${orientation}`], className)}>
      <img 
        className={styles.avatar} 
        src={avatarUrl} 
        alt={`Аватар ${user.name}`}
        loading="lazy"
      />
      <div className={styles.content}>
        <p className={clsx(styles.name, nameClassName)}>
          {user.name}
        </p>
        {metadata.length > 0 && (
          <p className={styles.meta}>{metadata.join(', ')}</p>
        )}
      </div>
    </div>
  );
};

UserInfo.displayName = 'UserInfo';