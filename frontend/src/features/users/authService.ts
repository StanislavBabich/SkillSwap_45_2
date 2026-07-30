import type { CreateUserDto } from '@/entities/user/types';
import type { User } from '@/entities/user/types';
import type { RegistrationData } from '@/pages/RegisterPage/types';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/** Проверка уникальности email среди существующих пользователей. */
export function checkEmailUnique(users: User[], email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return !users.some((u) => u.email.toLowerCase() === normalized);
}

/** Формирует CreateUserDto из RegistrationData (с хешем пароля). */
export async function buildCreateUserDto(data: RegistrationData): Promise<CreateUserDto> {
  const passwordHash = await hashPassword(data.password);
  
  // Преобразуем выбранные категории и подкатегории в массив ID подкатегорий
  const skillInterests = data.selectedSubcategories || [];
  
  return {
    name: data.name,
    email: data.email.trim().toLowerCase(),
    about: data.about || '', 
    cityId: data.cityId ?? 0,
    dateOfBirth: data.dateOfBirth || '',
    gender: (data.gender ?? 'other') as CreateUserDto['gender'],
    registrationDate: new Date().toISOString().slice(0, 10) as CreateUserDto['registrationDate'],
    skillInterests,
    passwordHash,
    avatarSeed: data.avatarSeed ?? null,
  };
}

export const authService = {
  hashPassword,
  checkEmailUnique,
  buildCreateUserDto,
};