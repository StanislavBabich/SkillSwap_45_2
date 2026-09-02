import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';
import { selectUnreadCount } from '@/features/notifications';
import { selectUserById } from '@/features/users/slice';
import { useAvatar } from '@/shared/hooks/useAvatar';
import { storage, AUTH_SESSION_EVENT } from '@/shared/lib/storage';
import { Icon } from '@/shared/ui/Icon';
import { NotificationModal } from '@/widgets/Notifications';
import { UserDropdown } from './components/UserDropdown/UserDropdown';
import styles from './UserMenu.module.css';

interface UserMenuProps {
  user: {
    id: string;
    email: string;
    gender?: 'male' | 'female' | 'other';
    name?: string;
  };
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const persistedUser = useAppSelector((state) => selectUserById(state, user.id));
  const unreadCount = useAppSelector((state) => selectUnreadCount(state, user.id));
  const hasUnread = unreadCount > 0;

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener(AUTH_SESSION_EVENT, handler);
    return () => window.removeEventListener(AUTH_SESSION_EVENT, handler);
  }, []);

  const handleNotificationsOpen = useCallback(() => {
    setIsNotificationsOpen(true);
  }, []);
  const handleNotificationsClose = useCallback(() => {
    setIsNotificationsOpen(false);
  }, []);

  const storedUser = storage.getCurrentUser();
  const effectiveEmail = persistedUser?.email ?? storedUser?.email ?? user.email;
  const effectiveGender = (storedUser?.gender as 'male' | 'female' | 'other') ?? user.gender ?? 'other';
  const effectiveName = persistedUser?.name ?? storedUser?.name ?? user.name;
  const avatarSeed = storedUser?.avatarSeed ?? null;

  const avatarUrl = useAvatar({
    email: effectiveEmail || '',
    gender: effectiveGender,
    size: 244,
    avatarSeed,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (!isNotificationsOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !bellRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        handleNotificationsClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen, handleNotificationsClose]);

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const getUserName = () => {
    if (effectiveName) return effectiveName;
    if (effectiveEmail) return effectiveEmail.split('@')[0];
    return 'User';
  };

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <div className={styles.bellPanelAnchor}>
        <div className={styles.bellWrapper}>
          <button
            ref={bellRef}
            type="button"
            className={styles.iconButton}
            onClick={
              isNotificationsOpen
                ? handleNotificationsClose
                : handleNotificationsOpen
            }
            aria-expanded={isNotificationsOpen}
            aria-haspopup="true"
            aria-label={
              hasUnread
                ? `Notifications: ${unreadCount} unread`
                : 'Notifications'
            }
            title="Notifications"
          >
            <Icon
              name="notification"
              size={24}
              className={styles.icon}
              aria-hidden="true"
            />
            {hasUnread && <span className={styles.notificationDot} aria-hidden />}
          </button>
        </div>
        <NotificationModal
          ref={panelRef}
          isOpen={isNotificationsOpen}
          onClose={handleNotificationsClose}
        />
      </div>

      <button
        className={styles.iconButton}
        onClick={handleFavoritesClick}
        aria-label="Favorites"
        title="Favorites"
      >
        <Icon
          name="like"
          size={24}
          className={styles.icon}
          aria-hidden="true"
        />
      </button>

      <div className={styles.userInfo}>
        <button
          className={styles.userButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="User menu"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          title="User menu"
        >
          <span className={styles.userName}>{getUserName()}</span>

          <img
            src={avatarUrl}
            alt={`Avatar ${getUserName()}`}
            className={styles.avatar}
            width={48}
            height={48}
          />
        </button>

        {isDropdownOpen && (
          <UserDropdown onClose={() => setIsDropdownOpen(false)} />
        )}
      </div>
    </div>
  );
};