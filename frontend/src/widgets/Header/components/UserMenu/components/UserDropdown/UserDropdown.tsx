import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Icon } from '@/shared/ui/Icon';
import styles from './UserDropdown.module.css';

interface UserDropdownProps {
  onClose: () => void;
}

export const UserDropdown = ({ onClose }: UserDropdownProps) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  // Фокус на первый элемент при открытии
  useEffect(() => {
    const firstMenuItem = dropdownRef.current?.querySelector('button');
    firstMenuItem?.focus();
  }, []);

  // Переход в личный кабинет
  const handleProfileClick = () => {
    navigate('/profile');
    onClose();
  };

  // Выход из аккаунта
  const handleLogout = () => {
    logout(); // очищает сессию и редиректит на главную
    onClose();
  };

  // Управление с клавиатуры (стрелки вверх/вниз)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const menuItems = dropdownRef.current?.querySelectorAll('button');
    if (!menuItems?.length) return;

    const currentIndex = Array.from(menuItems).findIndex(
      item => item === document.activeElement
    );

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % menuItems.length;
      (menuItems[nextIndex] as HTMLElement).focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
      (menuItems[prevIndex] as HTMLElement).focus();
    }
  };

  return (
    <div 
      className={styles.dropdown}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      role="menu"
      aria-label="User menu"
    >
      {/* Пункт "Личный кабинет" */}
      <button
        className={styles.menuItem}
        onClick={handleProfileClick}
        role="menuitem"
        tabIndex={0}
        title="Go to profile"
      >
        Profile
      </button>
      
      {/* Пункт "Выйти" */}
      <button
        className={styles.menuItem}
        onClick={handleLogout}
        role="menuitem"
        tabIndex={0}
        title="Log out"
      >
        <span>Log out</span>
        <Icon 
          name="logout" 
          size={24} 
          className={styles.icon}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};