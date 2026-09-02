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
        return 'Email is required';
      }
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        return 'Invalid email';
      }
    }
    
    if (field === 'password') {
      if (!value.trim()) {
        return 'Password is required';
      }
      if (value.length < 8) {
        return 'Minimum 8 characters';
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
            Continue with Google
          </Button>

          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onClick={handleAppleLogin}
            startIcon={<img src={appleIcon} alt="" />}
          >
            Continue with Apple
          </Button>
        </div>

        {/* Разделитель */}
        <div className={styles.divider}>
          <span>or</span>
        </div>

        {/* Форма входа по email */}
        <form onSubmit={handleSubmit} noValidate>
          <Input
            type="email"
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            error={touched.email ? errors.email : false}
            fullWidth
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter password"
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
                ? "Password must be at least 8 characters"
                : undefined
            }
            fullWidth
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {/* Иконка глаза */}
              </button>
            }
          />

          {error && <div className={styles.authError}>Invalid email or password</div>}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <p className={styles.registerLink}>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>

      {/* Правая колонка — картинка и текст */}
      <div className={styles.right}>
        <img src={illustration} alt="Login illustration" />
        <h2 className={styles.welcomeTitle}>Welcome to SkillSwap!</h2>
        <p className={styles.description}>
        Join SkillSwap and exchange knowledge and skills with other people
        </p>
      </div>
    </div>
  );
};