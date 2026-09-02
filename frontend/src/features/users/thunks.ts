import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { CreateSkillDto, Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import { authService } from '@/features/users/authService';
import { storageService } from '@/shared/api/storage';
import { storage } from '@/shared/lib/storage';
import type { RegistrationData } from '@/pages/RegisterPage/types';

const MOCK_TOKEN = 'skillswap-auth-token';

const getNextUserId = (items: User[]): number =>
  items.length ? Math.max(...items.map((u) => u.id)) + 1 : 1;

const getNextSkillId = (items: Skill[]): number =>
  items.length ? Math.max(...items.map((s) => s.id)) + 1 : 1;

// Хелпер для преобразования категорий и подкатегорий в skillInterests
const convertToSkillInterests = (
  selectedCategories: number[],
  selectedSubcategories: number[]
): number[] => {
  if (!selectedCategories.length || !selectedSubcategories.length) return [];
  
  // Возвращаем все выбранные подкатегории (они уже привязаны к категориям)
  return selectedSubcategories;
};

/**
 * Асинхронный thunk: создание пользователя и его навыка.
 * Последовательность: хеш пароля → проверка email → создание пользователя (без изображений) →
 * загрузка изображений в Storage → создание навыка с URL → сохранение в Redux (через extraReducers) и localStorage → автовход.
 *
 * Использует authService для работы с пользователями и storageService для загрузки изображений.
 * Вход: RegistrationData (включая File[] в teachSkill.images).
 * Выход: { user, skill }. При ошибке - откат и понятные сообщения.
 */
export const createUserWithSkill = createAsyncThunk<
  { user: User; skill: Skill },
  RegistrationData,
  { state: RootState; rejectValue: string }
>(
  'users/createUserWithSkill',
  async (data, { getState, rejectWithValue }) => {

    const state = getState();
    const users = state.users.items;
    const skills = state.skills.items;

    const persistedUsers =
      users.length > 0
        ? users
        : storage.loadUsers().map((storedUser) => ({
            id: storedUser.id,
            name: storedUser.name,
            email: storedUser.email,
            about: storedUser.about ?? '',
            cityId: storedUser.cityId ?? 0,
            dateOfBirth:
              (storedUser.dateOfBirth ?? new Date().toISOString().slice(0, 10)) as User['dateOfBirth'],
            gender: (storedUser.gender ?? 'other') as User['gender'],
            registrationDate:
              (storedUser.registrationDate ?? new Date().toISOString().slice(0, 10)) as User['registrationDate'],
            skillInterests: storedUser.skillInterests ?? [],
            passwordHash: storedUser.passwordHash,
            avatarSeed: storedUser.avatarSeed ?? null,
          }));
    const persistedSkills = skills.length > 0 ? skills : (storage.loadSkills() as Skill[]);

    if (!authService.checkEmailUnique(persistedUsers, data.email)) {
      return rejectWithValue('This email is already taken');
    }

    const skillInterests = convertToSkillInterests(
      data.selectedCategories || [],
      data.selectedSubcategories || []
    );

    // Создаём объект с интересами для передачи в authService
    const userDataForAuth = {
      ...data,
      skillInterests,
    };

    const userDto = await authService.buildCreateUserDto(userDataForAuth);

    const userId = getNextUserId(persistedUsers);
    const newUser: User = {
      id: userId,
      ...userDto,
    };

    let imageUrls: string[] = [];
    const files = data.teachSkill?.images ?? [];
    if (files.length > 0) {
      try {
        imageUrls = await storageService.uploadSkillImagesWithRollback(files);
      } catch (err) {
        return rejectWithValue(err instanceof Error ? err.message : 'Failed to upload images');
      }
    }

    const skillDto: CreateSkillDto = {
      userId,
      name: data.teachSkill.name,
      subcategoryId: data.teachSkill.subcategoryId,
      description: data.teachSkill.description ?? '',
      images: imageUrls,
      likes: [],
    };
    const skillId = getNextSkillId(persistedSkills);
    const newSkill: Skill = {
      id: skillId,
      ...skillDto,
    };

    try {
      storage.setCurrentUser({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: null,
      });
      storage.setToken(MOCK_TOKEN);
    } catch {
       // Игнорируем ошибки localStorage
    }

    return { user: newUser, skill: newSkill };
  }
);