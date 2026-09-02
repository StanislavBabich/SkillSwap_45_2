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
      <img src={Error500} className={style.img} alt="Server error 500" />

      <div className={style.errorTitle}>
        <h1 className={style.title}>A server error occurred</h1>
        <p className={style.text}>Please try again later or go back to the homepage</p>
      </div>
      <div className={style.buttons}>
        <Button variant="secondary">Report an error</Button>
        <Button variant="primary" onClick={handleGoHome}>
          Go to homepage
        </Button>
      </div>
    </main>
  );
};
