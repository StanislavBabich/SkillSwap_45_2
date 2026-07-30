import { Button } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import Error500 from './assets/Error500.svg';
import style from './ServerErrorPage.module.css';

export const ServerErrorPage = () => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };
  return (
    <main className={style.content}>
      <img src={Error500} className={style.img} alt="Ошибка сервера 500" />

      <div className={style.errorTitle}>
        <h1 className={style.title}>На сервере произошла ошибка</h1>
        <p className={style.text}>Попробуйте позже или вернитесь на главную страницу</p>
      </div>
      <div className={style.buttons}>
        <Button variant="secondary">Сообщить об ошибке</Button>
        <Button variant="primary" onClick={handleGoHome}>
          На главную
        </Button>
      </div>
    </main>
  );
};
