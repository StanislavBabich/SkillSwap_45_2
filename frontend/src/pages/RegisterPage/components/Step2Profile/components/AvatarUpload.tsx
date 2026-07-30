import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useAvatar } from '@/shared/hooks/useAvatar';
import { Button } from '@/shared/ui';
import { Icon } from '@/shared/ui/Icon';
import styles from './AvatarUpload.module.css';

export interface AvatarUploadProps {
  /** Email пользователя для генерации DiceBear */
  email: string;
  /** Пол пользователя для генерации */
  gender?: 'male' | 'female' | 'other';
  /** Callback при изменении аватара (передаём seed) */
  onChange: (seed: string | null) => void;
  /** Текущий seed (опционально) */
  value?: string | null;
  /** Режим отображения компонента */
  variant?: 'default' | 'iconOnly';
  /** Размер превью аватара (в px) */
  avatarSize?: number;
}

export const AvatarUpload = ({
  email,
  gender = 'other',
  onChange,
  value,
  variant = 'default',
  avatarSize,
}: AvatarUploadProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingSeed, setPendingSeed] = useState<string | null>(null);
  const previewSize = avatarSize ?? (variant === 'iconOnly' ? 244 : 120);
  
  // Если value нет, создаём начальный seed при монтировании
  useEffect(() => {
    if (!value) {
      const initialSeed = `avatar-${email}-${Date.now()}`;
      onChange(initialSeed);
    }
  }, [value, email, onChange]); 

  // Используем value если есть, иначе fallback с refreshKey
  const effectiveSeed = value ?? `avatar-${email}-${refreshKey}`;

  const avatarUrl = useAvatar({
    email,
    avatarSeed: effectiveSeed,
    gender,
    size: previewSize,
  });

  // Обработчик клика — только увеличиваем ключ
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setPendingSeed(`avatar-${email}-${Date.now()}-${refreshKey + 1}`);
  };

  // Отдельный эффект для вызова onChange после рендера
  useEffect(() => {
    if (pendingSeed) {
      onChange(pendingSeed);
      setPendingSeed(null);
    }
  }, [pendingSeed, onChange]);

  if (variant === 'iconOnly') {
    return (
      <div className={clsx(styles.container, styles.containerIconOnly)}>
        <div
          className={styles.iconOnlyAvatarPreview}
          style={{ width: previewSize, height: previewSize }}
        >
          <img src={avatarUrl} alt="Avatar preview" className={styles.avatar} />

          <button
            type="button"
            className={styles.iconOnlyActionButton}
            aria-label="Сменить аватар"
            onClick={handleRefresh}
          >
            <Icon name="avatar-generate" className={styles.iconOnlyActionIcon} aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatarPreview} style={{ width: previewSize, height: previewSize }}>
          <img src={avatarUrl} alt="Avatar preview" className={styles.avatar} />
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="small"
            onClick={handleRefresh}
            className={styles.actionButton}
            startIcon={<Icon name="refresh" size={18} className={styles.icon} />}
          >
            Сгенерировать другой
          </Button>
        </div>
      </div>

      <p className={styles.hint}>
        Аватар генерируется автоматически. Нажимайте «Сгенерировать другой» чтобы изменить.
      </p>
    </div>
  );
};