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
        alt="Страница не найдена"
        className={styles.image}
      />
      
      <h1 className={styles.title}>На сервере произошла ошибка</h1>
      <p className={styles.text}>К сожалению, эта страница недоступна.
      Вернитесь на главную или попробуйте позже</p>
    
      <div className={styles.actions}>
        <Button variant="secondary">Сообщить об ошибке</Button>
        <Button variant="primary" onClick={handleGoHome}>
          На главную
        </Button>
      </div>
    </main>
  );
};
