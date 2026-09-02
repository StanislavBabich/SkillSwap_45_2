import { Logo } from '@/shared/ui/Logo';
import { Button } from '@/shared/ui/Button';
import { SearchInput } from './components/SearchInput';
import { Link } from '@/shared/ui/Link';
import { SkillsDropdownMenu } from './components/SkillsDropdownMenu';
import { UserMenu } from './components/UserMenu/UserMenu';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Icon } from '@/shared/ui/Icon';
import styles from './Header.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/shared/hooks/useTheme';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Logo isLink={true} />
        
        <ul className={styles.navList}>
          <li>
            <Link to="/about" className={styles.navLink}>
              About
            </Link>
          </li>
          <li>
            <SkillsDropdownMenu />
          </li>
        </ul>

        <div className={styles.input}>
          <SearchInput />
        </div>
        
        {/* Кнопка смены темы */}
        <button
          className={styles.themeButton}
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          <Icon
            name={theme === 'light' ? 'moon' : 'sun'}
            size={24}
            className={styles.themeIcon}
          />
        </button>

        {/* Динамическая часть: кнопки входа или меню пользователя */}
        <div className={styles.authSection}>
          {isAuthenticated() && user ? (
            <UserMenu user={user} />
          ) : (
            <div className={styles.authButtons}>
              <Button 
                variant="secondary" 
                onClick={handleLoginClick} 
              >
                Log in
              </Button>
              <Button 
                variant="primary" 
                onClick={handleRegisterClick}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};