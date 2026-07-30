import type { EntityId, ISODateString, Gender } from '@/entities/base.ts';

export interface User {
  id: EntityId;
  name: string;
  email: string;
  about: string;
  cityId: EntityId;
  dateOfBirth: ISODateString;
  gender: Gender;          
  registrationDate: ISODateString;
  skillInterests: EntityId[];
  passwordHash: string;
  /** Seed для генерации аватара (DiceBear); при выборе «Сгенерировать другой» на регистрации */
  avatarSeed?: string | null;
}

export type UsersResponse = User[];
export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Partial<Omit<User, 'id'>>;