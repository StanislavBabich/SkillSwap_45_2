import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import type { UpdateUserDto, User } from '@/entities/user/types';
import { useAuth, AuthService } from '@/features/auth';
import { selectCities } from '@/features/cities/slice';
import { selectAllSkills } from '@/features/skills/slice';
import { selectAllUsers, updateUser } from '@/features/users/slice';
import { storage } from '@/shared/lib/storage';
import { ProfileAvatar } from './components/ProfileAvatar/ProfileAvatar';
import {
  ProfileForm,
  type ProfileFormErrors,
  type ProfileFormState,
} from './components/ProfileForm/ProfileForm';
import { ProfileMenu } from './components/ProfileMenu/ProfileMenu';
import styles from './ProfilePage.module.css';

type ComparableProfileState = Omit<ProfileFormState, 'password'>;

const toFormState = (user: User): ProfileFormState => ({
  email: user.email,
  name: user.name,
  password: '',
  dateOfBirth: user.dateOfBirth || '',
  gender: user.gender || 'other',
  cityId: user.cityId || 0,
  about: user.about || '',
  avatarSeed: user.avatarSeed ?? null,
});

const toComparableState = (state: ProfileFormState): ComparableProfileState => ({
  email: state.email,
  name: state.name,
  dateOfBirth: state.dateOfBirth,
  gender: state.gender,
  cityId: state.cityId,
  about: state.about,
  avatarSeed: state.avatarSeed,
});

const getValidationErrors = (state: ProfileFormState): ProfileFormErrors => {
  const nextErrors: ProfileFormErrors = {};

  if (!state.name.trim()) {
    nextErrors.name = 'Введите имя';
  }

  if (state.password && state.password.length < 8) {
    nextErrors.password = 'Пароль должен содержать минимум 8 символов';
  }

  return nextErrors;
};

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user: authUser } = useAuth();

  const users = useAppSelector(selectAllUsers);
  const cities = useAppSelector(selectCities);
  const skills = useAppSelector(selectAllSkills);

  const currentUser = useMemo(() => {
    if (!authUser) {
      return null;
    }

    return users.find((item) => item.id === authUser.id) ?? null;
  }, [authUser, users]);

  const userSkillId = useMemo(() => {
    if (!authUser) {
      return null;
    }

    return skills.find((skill) => skill.userId === authUser.id)?.id ?? null;
  }, [authUser, skills]);

  const [formData, setFormData] = useState<ProfileFormState | null>(null);
  const [savedData, setSavedData] = useState<ComparableProfileState | null>(null);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setFormData(null);
      setSavedData(null);
      return;
    }

    const nextState = toFormState(currentUser);
    setFormData(nextState);
    setSavedData(toComparableState(nextState));
    setErrors({});
    setSaveError(null);
  }, [currentUser]);

  const handleChange = useCallback((patch: Partial<ProfileFormState>) => {
    setFormData((previous) => {
      if (!previous) {
        return previous;
      }
      return {
        ...previous,
        ...patch,
      };
    });

    setSaveError(null);

    setErrors((previous) => {
      const next = { ...previous };

      if ('name' in patch && typeof patch.name === 'string' && patch.name.trim()) {
        delete next.name;
      }

      if ('password' in patch && typeof patch.password === 'string') {
        if (!patch.password || patch.password.length >= 8) {
          delete next.password;
        }
      }

      return next;
    });
  }, []);

  const isSaveDisabled = useMemo(() => {
    if (!formData || !savedData || isSaving) {
      return true;
    }

    const comparableState = toComparableState(formData);
    const hasStateChanges = JSON.stringify(comparableState) !== JSON.stringify(savedData);
    const hasNewPassword = formData.password.trim().length > 0;

    return !hasStateChanges && !hasNewPassword;
  }, [formData, isSaving, savedData]);

  const handleSave = useCallback(async () => {
    if (!authUser || !currentUser || !formData) {
      return;
    }

    const validationErrors = getValidationErrors(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const dto: UpdateUserDto = {
        name: formData.name.trim(),
        about: formData.about.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        cityId: formData.cityId,
        avatarSeed: formData.avatarSeed,
      };

      if (formData.password.trim()) {
        dto.passwordHash = await AuthService.hashPassword(formData.password.trim());
      }

      dispatch(
        updateUser({
          userId: currentUser.id,
          dto,
        })
      );

      storage.setCurrentUser({
        id: authUser.id,
        email: authUser.email,
        name: dto.name ?? authUser.name,
        avatar: authUser.avatar ?? null,
      });

      const nextFormState: ProfileFormState = {
        ...formData,
        name: dto.name ?? formData.name,
        about: dto.about ?? formData.about,
        password: '',
      };

      setFormData(nextFormState);
      setSavedData(toComparableState(nextFormState));
    } catch {
      setSaveError('Не удалось сохранить изменения. Повторите попытку.');
    } finally {
      setIsSaving(false);
    }
  }, [authUser, currentUser, dispatch, formData]);

  if (authUser && !currentUser && users.length > 0) {
    return (
      <section className={styles.page}>
        <div className={styles.state}>Пользователь не найден.</div>
      </section>
    );
  }

  if (!formData) {
    return (
      <section className={styles.page}>
        <div className={styles.state}>Загрузка профиля...</div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <aside className={styles.menuCard}>
        <ProfileMenu userSkillId={userSkillId} />
      </aside>

      <section className={styles.contentCard}>
        <ProfileForm
          data={formData}
          cities={cities}
          errors={errors}
          isSaveDisabled={isSaveDisabled}
          isSaving={isSaving}
          saveError={saveError}
          onChange={handleChange}
          onSave={handleSave}
        />

        <ProfileAvatar
          email={formData.email}
          gender={formData.gender}
          avatarSeed={formData.avatarSeed}
          onChange={(seed) => handleChange({ avatarSeed: seed })}
        />
      </section>
    </section>
  );
};
