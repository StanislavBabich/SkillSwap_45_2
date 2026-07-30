import { useCallback, useMemo, useState } from 'react';
import lightbulb from '@/assets/lightbulb.svg';
import userInfoIllustration from '@/assets/user-info.svg';
import schoolBoardIllustration from '@/assets/school-board.svg';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  selectCategories,
  selectSubcategories,
} from '@/features/categories/slice';
import { createUserWithSkill } from '@/features/users/thunks';
import { storage } from '@/shared/lib/storage';
import { Step1Account } from './components/Step1Account';
import { Step2Profile } from './components/Step2Profile/Step2Profile';
import { Step3Skill } from './components/Step3Skill/Step3Skill';
import { StepIndicator } from './components/StepIndicator/StepIndicator';
import { ConfirmModal } from './components/Modals/ConfirmModal';
import { SuccessModal } from './components/Modals/SuccessModal';
import { useRegistration } from './hooks/useRegistration';
import type { RegistrationData } from './types';
import styles from './RegisterPage.module.css';
import clsx from 'clsx';

type StepId = 1 | 2 | 3;

const STEP_CONTENT: Record<StepId, { image: string; title: string; subtitle: string }> = {
  1: {
    image: lightbulb,
    title: 'Добро пожаловать в SkillSwap!',
    subtitle: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  2: {
    image: userInfoIllustration,
    title: 'Расскажите немного о себе',
    subtitle:
      'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  3: {
    image: schoolBoardIllustration,
    title: 'Укажите, чем вы готовы поделиться',
    subtitle:
      'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
};

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const {
    currentStep,
    data,
    nextStep,
    prevStep,
    updateData,
    resetData,
  } = useRegistration();

  const users = useAppSelector((state) => state.users.items);
  const usersLoading = useAppSelector((state) => state.users.isLoading);
  const categories = useAppSelector(selectCategories);
  const subcategories = useAppSelector(selectSubcategories);

  const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [createdSkillId, setCreatedSkillId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepTyped = currentStep as StepId;
  const stepContent = STEP_CONTENT[currentStepTyped];

  const handleUpdate = useCallback(
    (patch: Partial<RegistrationData>) => {
      if (typeof patch.email === 'string') {
        setEmailAlreadyUsed(false);
      }

      if (patch.teachSkill) {
        setSubmitError(null);
      }

      updateData(patch);
    },
    [updateData]
  );

  const isEmailTaken = useCallback(
    (email: string) => {
      const normalized = normalizeEmail(email);
      if (!normalized) return false;

      const existsInStore = users.some((user) => normalizeEmail(user.email) === normalized);
      if (existsInStore) return true;

      return storage
        .loadUsers()
        .some((user) => normalizeEmail(user.email) === normalized);
    },
    [users]
  );

  const handleStep1Next = useCallback(() => {
    if (isEmailTaken(data.email)) {
      setEmailAlreadyUsed(true);
      return;
    }

    setEmailAlreadyUsed(false);
    nextStep();
  }, [data.email, isEmailTaken, nextStep]);

  const handleStep3Next = useCallback(() => {
    setSubmitError(null);
    setIsConfirmOpen(true);
  }, []);

  const confirmData = useMemo(() => {
    const category = categories.find((item) => item.id === data.teachSkill.categoryId);
    const subcategory = subcategories.find((item) => item.id === data.teachSkill.subcategoryId);

    return {
      name: data.teachSkill.name,
      categoryName: category?.name ?? 'Категория не выбрана',
      subcategoryName: subcategory?.name ?? 'Подкатегория не выбрана',
      description: data.teachSkill.description || 'Описание не указано',
      images: data.teachSkill.images ?? [],
    };
  }, [categories, data.teachSkill, subcategories]);

  const handleConfirmRegistration = useCallback(async () => {
    if (isSubmitting) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await dispatch(createUserWithSkill(data)).unwrap();
      setCreatedSkillId(result.skill.id);
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      if (typeof error === 'string') {
        setSubmitError(error);
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Не удалось завершить регистрацию');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [data, dispatch, isSubmitting]);

  const handleSuccessClose = useCallback(() => {
    setIsSuccessOpen(false);
    setCreatedSkillId(null);
    setSubmitError(null);
    setEmailAlreadyUsed(false);
    resetData();
  }, [resetData]);

  const renderStep = () => {
    switch (currentStepTyped) {
      case 1:
        return (
          <div className={styles.stepCard}>
            <Step1Account
              data={data}
              onUpdate={handleUpdate}
              onNext={handleStep1Next}
              onBack={prevStep}
              emailAlreadyUsed={emailAlreadyUsed}
            />
            {usersLoading && (
              <p className={styles.hint}>Загружаем пользователей для проверки email…</p>
            )}
          </div>
        );
      case 2:
        return (
          <Step2Profile
            data={data}
            onUpdate={handleUpdate}
            onNext={nextStep}
            onBack={prevStep}
            embedded
          />
        );
      case 3:
        return (
          <Step3Skill
            data={data}
            onUpdate={handleUpdate}
            onNext={handleStep3Next}
            onBack={prevStep}
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
          <StepIndicator currentStep={currentStepTyped} />
        </div>
        <div className={clsx(styles.leftColumn, styles.section)}>
          {submitError && !isConfirmOpen && (
            <p className={styles.errorBanner} role="alert">
              {submitError}
            </p>
          )}

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

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsConfirmOpen(false);
          }
        }}
        data={confirmData}
        onEdit={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmRegistration}
        isConfirming={isSubmitting}
        errorMessage={submitError}
      />

      <SuccessModal
        isOpen={isSuccessOpen && createdSkillId !== null}
        onClose={handleSuccessClose}
        skillId={createdSkillId ?? 0}
      />
    </>
  );
};

export default RegisterPage;