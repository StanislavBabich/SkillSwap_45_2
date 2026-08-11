import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import type { User } from '@/entities/user/types';
import type { Gender } from '@/entities/base';
import { selectAllSkills } from '@/features/skills/slice';
import { setUsers } from '@/features/users/slice';
import { initializeCities, searchCities, selectCities } from '@/features/cities/slice';
import usersApi from '@/entities/user/api';
import { storage } from '@/shared/lib/storage';
import { ProfileAvatar } from './components/ProfileAvatar/ProfileAvatar';
import {
  ProfileForm,
  type ProfileFormErrors,
  type ProfileFormState,
} from './components/ProfileForm/ProfileForm';
import { ProfileMenu } from './components/ProfileMenu/ProfileMenu';
import styles from './ProfilePage.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

type ComparableProfileState = Omit<ProfileFormState, 'password'>;

const toFormState = (user: User): ProfileFormState => {
  console.log('[ProfilePage] toFormState - localStorage avatarSeed:', (storage.getCurrentUser() as any)?.avatarSeed);
  return {
    email: user.email,
    name: user.name,
    password: '',
    dateOfBirth: user.birthdate || '',
    gender: (user.gender?.toLowerCase() as Gender) || 'other',
    city: user.city || '',
    about: user.about || '',
    avatarSeed: (storage.getCurrentUser() as any)?.avatarSeed ?? null,
  };
};

const toComparableState = (state: ProfileFormState): ComparableProfileState => ({
  email: state.email,
  name: state.name,
  dateOfBirth: state.dateOfBirth,
  gender: state.gender,
  city: state.city,
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

  const skills = useAppSelector(selectAllSkills);
  const cities = useAppSelector(selectCities);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем текущего пользователя через /api/users/me
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = storage.getToken();
        if (!token) {
          setIsLoading(false);
          return;
        }
        const res = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Загружаем список всех пользователей для Redux
  useEffect(() => {
    usersApi.getAll().then((data) => dispatch(setUsers(data))).catch(() => {});
    dispatch(initializeCities());
  }, [dispatch]);

  const userSkillId = useMemo(() => {
    if (!currentUser) return null;
    return skills.find((skill) => skill.owner?.id === currentUser.id)?.id ?? null;
  }, [currentUser, skills]);

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
      if (!previous) return previous;
      return { ...previous, ...patch };
    });

    setSaveError(null);

    // Сохраняем avatarSeed в localStorage при изменении
    if (patch.avatarSeed !== undefined) {
      const stored = storage.getCurrentUser();
      if (stored) {
        (stored as any).avatarSeed = patch.avatarSeed;
        storage.setCurrentUser(stored);
      }
    }

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

  const handleCitySearch = useCallback(
    (search: string) => {
      void dispatch(searchCities(search));
    },
    [dispatch]
  );

  const isSaveDisabled = useMemo(() => {
    if (!formData || !savedData || isSaving) return true;
    const comparableState = toComparableState(formData);
    const hasStateChanges = JSON.stringify(comparableState) !== JSON.stringify(savedData);
    const hasNewPassword = formData.password.trim().length > 0;
    return !hasStateChanges && !hasNewPassword;
  }, [formData, isSaving, savedData]);

  const handleSave = useCallback(async () => {
    if (!currentUser || !formData) return;

    const validationErrors = getValidationErrors(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const body: Record<string, unknown> = {
        name: formData.name.trim(),
        about: formData.about.trim(),
        birthdate: formData.dateOfBirth,
        gender: formData.gender?.toUpperCase(),
        city: formData.city,
      };

      const token = storage.getToken();
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Ошибка сохранения');

      const updatedUser = await res.json();
      setCurrentUser(updatedUser);

      // Сохраняем в localStorage, включая avatarSeed
      const stored = storage.getCurrentUser();
      storage.setCurrentUser({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar ?? null,
        avatarSeed: (stored as any)?.avatarSeed ?? formData.avatarSeed,
      } as any);

      const nextFormState: ProfileFormState = {
        ...formData,
        name: updatedUser.name ?? formData.name,
        about: updatedUser.about ?? formData.about,
        password: '',
      };

      setFormData(nextFormState);
      setSavedData(toComparableState(nextFormState));
    } catch {
      setSaveError('Не удалось сохранить изменения. Повторите попытку.');
    } finally {
      setIsSaving(false);
    }
  }, [currentUser, formData]);

  if (isLoading || !formData) {
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
          onCitySearch={handleCitySearch}
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
