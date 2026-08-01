import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lightbulb from '@/assets/lightbulb.svg';
import userInfoIllustration from '@/assets/user-info.svg';
import { useAppSelector } from '@/app/store/hooks';
import { selectCategories } from '@/features/categories/slice';
import { storage } from '@/shared/lib/storage';
import { AuthService } from '@/features/auth';
import { Step1Account } from './components/Step1Account';
import { Step2Profile } from './components/Step2Profile/Step2Profile';
import { StepIndicator } from './components/StepIndicator/StepIndicator';
import { SuccessModal } from './components/Modals/SuccessModal';
import { useRegistration } from './hooks/useRegistration';
import styles from './RegisterPage.module.css';
import clsx from 'clsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function updateProfile(token: string, data: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${API_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Ошибка обновления профиля');
}

type StepId = 1 | 2;

const STEP_CONTENT: Record<StepId, { image: string; title: string; subtitle: string }> = {
  1: {
    image: lightbulb,
    title: 'Добро пожаловать в SkillSwap!',
    subtitle: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  2: {
    image: userInfoIllustration,
    title: 'Расскажите немного о себе',
    subtitle: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { currentStep, data, nextStep, prevStep, updateData, resetData } = useRegistration();
  const categories = useAppSelector(selectCategories);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const currentStepTyped = currentStep as StepId;
  const stepContent = STEP_CONTENT[currentStepTyped];

  const handleUpdate = useCallback(
    (patch: Partial<typeof data>) => updateData(patch),
    [updateData]
  );

  const handleStep1Next = useCallback(async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const result = await AuthService.registerViaApi(data.email, data.password, data.name || data.email.split('@')[0]);
      setAuthToken(result.accessToken);

      storage.setToken(result.accessToken);
      storage.setCurrentUser(result.user);

      nextStep();
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Не удалось зарегистрироваться');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [data.email, data.password, data.name, nextStep]);

  const handleStep2Submit = useCallback(async () => {
    if (!authToken) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await updateProfile(authToken, {
        name: data.name,
        about: data.about,
        birthdate: data.dateOfBirth,
        gender: data.gender?.toUpperCase(),
        city: data.city,
        wantToLearn: data.selectedCategoryIds,
      });

      const stored = storage.getCurrentUser();
      const finalSeed = data.avatarSeed || `avatar-${data.email}-${Date.now()}`;

      storage.setCurrentUser({
        ...stored,
        name: data.name || stored?.name || '',
        email: stored?.email || data.email,
        id: stored?.id || '',
        gender: data.gender || stored?.gender || 'other',
        avatarSeed: finalSeed,
      });

      setIsSuccessOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Не удалось обновить профиль');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [authToken, data]);

  const handleSuccessClose = useCallback(() => {
    setIsSuccessOpen(false);
    resetData();
    navigate('/profile');
  }, [resetData, navigate]);

  const renderStep = () => {
    switch (currentStepTyped) {
      case 1:
        return (
          <div className={styles.stepCard}>
            <Step1Account data={data} onUpdate={handleUpdate} onNext={handleStep1Next} onBack={prevStep} />
            {isSubmitting && <p className={styles.hint}>Регистрация...</p>}
          </div>
        );
      case 2:
        return (
          <Step2Profile
            data={data}
            onUpdate={handleUpdate}
            onNext={handleStep2Submit}
            onBack={prevStep}
            isSubmitting={isSubmitting}
            embedded
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <section className={styles.page}>
        <div className={styles.headerBlock}>
          <StepIndicator currentStep={currentStepTyped} totalSteps={2} />
        </div>
        <div className={clsx(styles.leftColumn, styles.section)}>
          {submitError && <p className={styles.errorBanner} role="alert">{submitError}</p>}
          <div className={styles.stepWrap}>{renderStep()}</div>
        </div>
        <aside className={clsx(styles.rightColumn, styles.section)}>
          <img src={stepContent.image} alt="" className={styles.illustration} />
          <div className={styles.copy}>
            <h2 className={styles.copyTitle}>{stepContent.title}</h2>
            <p className={styles.copyText}>{stepContent.subtitle}</p>
          </div>
        </aside>
      </section>
      <SuccessModal isOpen={isSuccessOpen} onClose={handleSuccessClose} />
    </>
  );
};

export default RegisterPage;