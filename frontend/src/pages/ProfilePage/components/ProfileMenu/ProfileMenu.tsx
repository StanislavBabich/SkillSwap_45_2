import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/Icon';
import styles from './ProfileMenu.module.css';

interface ProfileMenuProps {
  userSkillId: string | null;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(styles.item, isActive && styles.itemActive);

export const ProfileMenu = ({ userSkillId }: ProfileMenuProps) => {
  return (
    <nav className={styles.menu} aria-label="Меню профиля">
      <ul className={styles.list}>
        <li>
          <button type="button" className={clsx(styles.item, styles.itemDisabled)} disabled>
            <Icon name="requests" size={24} className={styles.icon} aria-hidden="true" />
            <span>Заявки</span>
          </button>
        </li>

        <li>
          <button type="button" className={clsx(styles.item, styles.itemDisabled)} disabled>
            <Icon name="exchanges" size={24} className={styles.icon} aria-hidden="true" />
            <span>Мои обмены</span>
          </button>
        </li>

        <li>
          <NavLink to="/favorites" className={navLinkClass}>
            <Icon name="like" size={24} className={styles.icon} aria-hidden="true" />
            <span>Избранное</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/my-skills" className={navLinkClass}>
            <Icon name="skills" size={24} className={styles.icon} aria-hidden="true" />
            <span>Мои навыки</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile" className={navLinkClass} end>
            <Icon name="user" size={24} className={styles.icon} aria-hidden="true" />
            <span>Личные данные</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};