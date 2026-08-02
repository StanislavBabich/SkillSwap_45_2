import { Logo } from '@/shared/ui/Logo';
import { Button } from '@/shared/ui/Button';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const CrossIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6L18 18" />
  </svg>
);

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className={styles.authLayout}>
      <header className={styles.header}>
        <Logo isLink={true} />
          <Button as="a" href="/" variant="tertiary" size="medium" endIcon={<CrossIcon />} className={styles.closeButton}>
            Закрыть
          </Button>
        
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};