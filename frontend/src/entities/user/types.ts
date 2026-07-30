import type { EntityId, ISODateString, Gender } from '@/entities/base.ts';

export interface User {
  id: EntityId;
  name: string;
  email: string;
  about: string;
  city: string;                    // было cityId: EntityId
  birthdate: ISODateString;        // было dateOfBirth
  gender: Gender;
  avatar: string | null;           // было avatarSeed
  role: 'USER' | 'ADMIN';          // новое поле
}

export type UsersResponse = User[];
export type CreateUserDto = Pick<User, 'name' | 'email'> & { password: string };
export type UpdateUserDto = Partial<Omit<User, 'id' | 'email' | 'role'>>;