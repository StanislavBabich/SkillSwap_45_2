import { Button } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import illustration from './assets/error 404.svg';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };
  return (
    <main className={styles.page}>
      <img
        src={illustration}
        alt="Page not found"
        className={styles.image}
      />
      
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>Unfortunately, this page is unavailable.
      Go back to the homepage or try again later</p>
    
      <div className={styles.actions}>
        <Button variant="secondary">Report an error</Button>
        <Button variant="primary" onClick={handleGoHome}>
          Go to homepage
        </Button>
      </div>
    </main>
  );
};
