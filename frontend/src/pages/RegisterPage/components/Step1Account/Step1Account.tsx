import { useState, useCallback } from 'react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import GoogleIcon from '@/assets/Google.svg';
import AppleIcon from '@/assets/Apple.svg';
import type { RegistrationData } from '../../types';
import styles from './Step1Account.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export interface Step1AccountProps {
   data: Pick<RegistrationData, 'email' | 'password'>;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack?: () => void;
  emailAlreadyUsed?: boolean;
}

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

function isValidPassword(value: string): boolean {
  return value.length >= MIN_PASSWORD_LENGTH;
}

export const Step1Account = ({
  data,
  onUpdate,
  onNext,
  emailAlreadyUsed = false,
}: Step1AccountProps) => {
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const email = data.email ?? '';
  const password = data.password ?? '';

  const emailError =
    (emailTouched || submitted) && !email.trim()
      ? 'Enter email'
      : (emailTouched || submitted) && !isValidEmail(email)
        ? 'Invalid email format'
        : (emailTouched || submitted) && emailAlreadyUsed && isValidEmail(email)
          ? 'Email is already in use'
          : undefined;

  const passwordError =
    (passwordTouched || submitted) && !password
      ? 'Enter password'
      : (passwordTouched || submitted) && !isValidPassword(password)
        ? 'Password must be at least 8 characters'
        : undefined;

  const isFormValid =
    isValidEmail(email) && isValidPassword(password) && !emailAlreadyUsed;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (!isFormValid) return;
      onNext();
    },
    [isFormValid, onNext]
  );

  return (
    <form className={styles.root} onSubmit={handleSubmit} noValidate>
      <div className={styles.social}>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className={styles.socialButton}
          startIcon={<img src={GoogleIcon} alt="" className={styles.socialIcon} />}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className={styles.socialButton}
          startIcon={<img src={AppleIcon} alt="" className={styles.socialIcon} />}
        >
          Continue with Apple
        </Button>
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerText}>or</span>
      </div>

      <div className={styles.fields}>
        <Input
          type="email"
          label="Email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          onBlur={() => setEmailTouched(true)}
          error={emailError ?? false}
          autoComplete="email"
        />
        <Input
          type="password"
          label="Password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => onUpdate({ password: e.target.value })}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => {
            setPasswordTouched(true);
            setPasswordFocused(false);                 
          }}
          error={passwordError ?? false}
          success={!passwordError && !!password && isValidPassword(password)}
          helperText={
            passwordFocused && !passwordError           
              ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
              : !passwordError && password && isValidPassword(password)
                ? 'Strong'
                : undefined
          }
          autoComplete="new-password"
        />
      </div>

      <Button
        className={styles.submitButton}
        type="submit"
        variant="primary"
        fullWidth
        disabled={!isFormValid}
      >
        Continue
      </Button>
    </form>
  );
};
