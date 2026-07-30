import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';
import { selectUnreadCount } from '@/features/notifications';
import { selectUserById } from '@/features/users/slice';
import { useAvatar } from '@/shared/hooks/useAvatar';
import { Icon } from '@/shared/ui/Icon';
import { NotificationModal } from '@/widgets/Notifications';
import { UserDropdown } from './components/UserDropdown/UserDropdown';
import styles from './UserMenu.module.css';

interface UserMenuProps {
  user: {
    id: number;
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

  const handleNotificationsOpen = useCallback(() => {
    setIsNotificationsOpen(true);
  }, []);
  const handleNotificationsClose = useCallback(() => {
    setIsNotificationsOpen(false);
  }, []);

  const effectiveEmail = persistedUser?.email ?? user.email;
  const effectiveGender = persistedUser?.gender ?? user.gender;
  const effectiveName = persistedUser?.name ?? user.name;

  // Генерация аватара через DiceBear
  const avatarUrl = useAvatar({
    email: effectiveEmail || '',
    gender: effectiveGender,
    size: 48,
    avatarSeed: persistedUser?.avatarSeed ?? null,
  });

  // Закрытие по клику вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Закрытие по Escape
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

  // Закрытие панели уведомлений по клику вне
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

  // Переход на избранное
  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  // Получаем имя пользователя
  const getUserName = () => {
    if (effectiveName) return effectiveName;
    if (effectiveEmail) return effectiveEmail.split('@')[0];
    return 'Пользователь';
  };

  return (
    <div className={styles.userMenu} ref={menuRef}>
      {/* Иконка уведомлений (колокольчик + красный кружок) и выпадающая панель */}
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
                ? `Уведомления: ${unreadCount} непрочитанных`
                : 'Уведомления'
            }
            title="Уведомления"
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

      {/* Иконка избранного (сердечко) */}
      <button
        className={styles.iconButton}
        onClick={handleFavoritesClick}
        aria-label="Избранное"
        title="Избранное"
      >
        <Icon
          name="like"
          size={24}
          className={styles.icon}
          aria-hidden="true"
        />
      </button>

      {/* Имя и аватар - открывает выпадающее меню */}
      <div className={styles.userInfo}>
        <button
          className={styles.userButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="Меню пользователя"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          title="Меню пользователя"
        >
          <span className={styles.userName}>{getUserName()}</span>

          <img
            src={avatarUrl}
            alt={`Аватар ${getUserName()}`}
            className={styles.avatar}
            width={48}
            height={48}
          />
        </button>

        {/* Выпадающее меню */}
        {isDropdownOpen && (
          <UserDropdown onClose={() => setIsDropdownOpen(false)} />
        )}
      </div>
    </div>
  );
};