import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useAvatar } from '@/shared/hooks/useAvatar';
import { Button } from '@/shared/ui';
import { Icon } from '@/shared/ui/Icon';
import styles from './AvatarUpload.module.css';

export interface AvatarUploadProps {
  email: string;
  gender?: 'male' | 'female' | 'other';
  onChange: (seed: string | null) => void;
  value?: string | null;
  variant?: 'default' | 'iconOnly';
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
  const [prevGender, setPrevGender] = useState(gender);
  const previewSize = avatarSize ?? (variant === 'iconOnly' ? 244 : 120);

  // При смене пола — генерируем новый seed
  useEffect(() => {
    if (gender !== prevGender) {
      setPrevGender(gender);
      const newSeed = `avatar-${email}-${Date.now()}`;
      onChange(newSeed);
    }
  }, [gender, prevGender, email, onChange]);
  
  const effectiveSeed = value || `avatar-${email}`;

  const avatarUrl = useAvatar({
    email,
    avatarSeed: effectiveSeed,
    gender,
    size: previewSize,
  });

  const handleRefresh = () => {
    const newKey = refreshKey + 1;
    setRefreshKey(newKey);
    onChange(`avatar-${email}-${Date.now()}-${newKey}`);
  };

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