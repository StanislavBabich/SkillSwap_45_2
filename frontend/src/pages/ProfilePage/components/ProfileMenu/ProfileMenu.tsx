import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@/shared/ui/Icon';
import styles from './ProfileMenu.module.css';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(styles.item, isActive && styles.itemActive);

export const ProfileMenu = () => {
  return (
    <nav className={styles.menu} aria-label="Profile menu">
      <ul className={styles.list}>
        <li>
          <NavLink to="/requests" className={navLinkClass}>
            <Icon name="requests" size={24} className={styles.icon} aria-hidden="true" />
            <span>Requests</span>
          </NavLink>
        </li>

        <li>
          <button type="button" className={clsx(styles.item, styles.itemDisabled)} disabled>
            <Icon name="exchanges" size={24} className={styles.icon} aria-hidden="true" />
            <span>My swaps</span>
          </button>
        </li>

        <li>
          <NavLink to="/favorites" className={navLinkClass}>
            <Icon name="like" size={24} className={styles.icon} aria-hidden="true" />
            <span>Favorites</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/my-skills" className={navLinkClass}>
            <Icon name="skills" size={24} className={styles.icon} aria-hidden="true" />
            <span>My skills</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile" className={navLinkClass} end>
            <Icon name="user" size={24} className={styles.icon} aria-hidden="true" />
            <span>Profile</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
