import { Logo } from '@shared/ui/Logo';
import styles from './Footer.module.css';
import { Link } from '@shared/ui/Link';
import { useAppDispatch } from '@/app/store/hooks';
import { openSkillsMenu } from '@/features/ui/slice';

interface FooterProps {
  copyrightText?: string; 
  showLogo?: boolean;     
}
interface NavItem {
  id: string;           
  label: string;
  to: string;
  external?: boolean;
}

// Данные для колонок ссылок
const navColumns: { 
  title: string; 
  items: NavItem[];
}[] = [
  {
    title: 'Column 1',
    items: [
      { id: 'about', label: 'About', to: '/about' },
      { id: 'all-skills', label: 'All skills', to: '/skills' },
    ],
  },
  {
    title: 'Column 2',
    items: [
      { id: 'contacts', label: 'Contacts', to: '/' },
      { id: 'blog', label: 'Blog', to: '/' },
    ],
  },
  {
    title: 'Column 3',
    items: [
      { id: 'privacy', label: 'Privacy policy', to: '/'},
      { id: 'terms', label: 'Terms of use', to: '/'},
    ],
  },
];

export const Footer = ({
  copyrightText = `Skillswap – ${new Date().getFullYear()}`,
  showLogo = true,
}: FooterProps) => {
  const dispatch = useAppDispatch();

  const handleSkillsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(openSkillsMenu());
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Блок с лого и копирайтом */}
        <div className={styles.logoSection}>
          {showLogo && <Logo isLink={true} />}
          <span
            className={styles.copyright}
            aria-label={`© ${copyrightText}`}
          >
            {copyrightText}
          </span>
        </div>

        {/* Блок с навигацией */}
        <nav aria-label="Footer navigation" className={styles.navSection}>
          {navColumns.map((column, colIndex) => (
            <ul key={colIndex} className={styles.column}>
              {column.items.map((item) => (
                <li key={item.id}>
                  {item.label === 'All skills' ? (
                    <a
                      href="/"
                      onClick={handleSkillsClick}
                      className={styles.navLink}
                      aria-label={item.label}
                    >
                      {item.label}
                    </a>
                  ) : item.external ? (
                    <a
                      href={item.to}
                      className={styles.navLink}
                      aria-label={item.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      className={styles.navLink}
                      aria-label={item.label}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </nav>
      </div>
    </footer>
  );
};