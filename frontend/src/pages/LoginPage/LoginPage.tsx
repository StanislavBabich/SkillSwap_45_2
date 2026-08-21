import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import styles from './LoginPage.module.css';
import illustration from './assets/login-illustration.svg';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

import googleIcon from '../../assets/Google.svg';
import appleIcon from '../../assets/Apple.svg';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { login, isAuthenticated, error, isLoading } = useAuth();

  const from = location.state?.from || '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true }); 
    }
  }, [isAuthenticated, navigate, from]);

  const validateField = useCallback((field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      if (!value.trim()) {
        return 'Email обязателен';
      }
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        return 'Некорректный email';
      }
    }
    
    if (field === 'password') {
      if (!value.trim()) {
        return 'Пароль обязателен';
      }
      if (value.length < 8) {
        return 'Минимум 8 символов';
      }
    }
    
    return undefined;
  }, []);

  const validateAll = useCallback(() => {
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    
    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  }, [email, password, validateField]);

  const handleBlur = useCallback((field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const fieldError = validateField(field, field === 'email' ? email : password);
    setErrors(prev => ({ ...prev, [field]: fieldError }));
  }, [email, password, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ email: true, password: true });
    
    if (!validateAll()) return;

    const success = await login({ email, password });

    if (success) {
      navigate(from, { replace: true }); 
    }
  }, [email, password, login, navigate, validateAll, from]);

  const handleGoogleLogin = () => {
    // TODO: Реализовать вход через Google
  };

  const handleAppleLogin = () => {
    // TODO: Реализовать вход через Apple
  };

  return (
    <div className={styles.wrapper}>
      {/* Левая колонка — форма */}
      <div className={styles.left}>
        {/* Кнопки входа через соцсети */}
        <div className={styles.socialButtons}>
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onClick={handleGoogleLogin}
            startIcon={<img src={googleIcon} alt="" />}
          >
            Продолжить с Google
          </Button>

          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onClick={handleAppleLogin}
            startIcon={<img src={appleIcon} alt="" />}
          >
            Продолжить с Apple
          </Button>
        </div>

        {/* Разделитель */}
        <div className={styles.divider}>
          <span>или</span>
        </div>

        {/* Форма входа по email */}
        <form onSubmit={handleSubmit} noValidate>
          <Input
            type="email"
            label="Email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            error={touched.email ? errors.email : false}
            fullWidth
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Пароль"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => {
              setIsPasswordFocused(false);
              handleBlur('password');
            }}
            error={touched.password ? errors.password : false}
            helperText={
              isPasswordFocused && !errors.password
                ? "Пароль должен содержать не менее 8 символов"
                : undefined
            }
            fullWidth
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {/* Иконка глаза */}
              </button>
            }
          />

          {error && <div className={styles.authError}>Неверный email или пароль</div>}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <p className={styles.registerLink}>
          Нет аккаунта? <a href="/register">Зарегистрироваться</a>
        </p>
      </div>

      {/* Правая колонка — картинка и текст */}
      <div className={styles.right}>
        <img src={illustration} alt="Login illustration" />
        <h2 className={styles.welcomeTitle}>Добро пожаловать в SkillSwap!</h2>
        <p className={styles.description}>
        Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми
        </p>
      </div>
    </div>
  );
};