import { useMemo } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '@/app/store/hooks';
import type { EntityId } from '@/entities/base';
import { selectUserWithDetails } from '@/features/users/selectors';
import { useAvatar } from '@/shared/hooks/useAvatar';
import { storage } from '@/shared/lib/storage';
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

const getAge = (birthdate: string): number | null => {
  if (!birthdate) return null;
  const birth = new Date(birthdate);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

const formatAge = (age: number): string => {
  const mod10 = age % 10;
  const mod100 = age % 100;
  if (mod10 === 1 && mod100 !== 11) return `${age} год`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${age} года`;
  return `${age} лет`;
};

const SIZE_TO_PIXELS = {
  sm: 40,
  md: 56,
  lg: 80,
} as const;

export const UserInfo = ({
  userId,
  size = 'md',
  showCity = true,
  showAge = true,
  orientation = 'horizontal',
  nameClassName,
  className = '',
}: UserInfoProps) => {
  const selector = useMemo(() => selectUserWithDetails(userId), [userId]);
  const user = useAppSelector(selector);

  // Пробуем получить сохранённый avatarSeed из localStorage
  const storedUser = storage.getCurrentUser();
  const avatarSeed =
    user?.id === storedUser?.id ? (storedUser as any)?.avatarSeed ?? null : null;

  const avatarUrl = useAvatar({
    email: user?.email || `user-${userId}@example.com`,
    gender: user?.gender,
    size: SIZE_TO_PIXELS[size],
    avatarSeed,
  });

  if (!user) return null;

  const age = user.birthdate ? getAge(user.birthdate) : null;
  const metadata: string[] = [];
  if (showCity && user.city) metadata.push(user.city);
  if (showAge && age !== null) metadata.push(formatAge(age));

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