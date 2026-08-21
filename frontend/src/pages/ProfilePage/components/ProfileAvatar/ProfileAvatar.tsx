import type { Gender } from '@/entities/base';
import { AvatarUpload } from '@/pages/RegisterPage/components/Step2Profile/components/AvatarUpload';
import styles from './ProfileAvatar.module.css';

interface ProfileAvatarProps {
  email: string;
  gender: Gender;
  avatarSeed: string | null;
  onChange: (seed: string | null) => void;
}

export const ProfileAvatar = ({ email, gender, avatarSeed, onChange }: ProfileAvatarProps) => {
  return (
    <aside className={styles.root}>
      <AvatarUpload
        email={email}
        gender={gender}
        value={avatarSeed}
        onChange={onChange}
        variant="iconOnly"
        avatarSize={244}
      />
    </aside>
  );
};
