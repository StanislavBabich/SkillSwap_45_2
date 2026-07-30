import type { EntityId, ISODateString, Gender } from '@/entities/base.ts';

export interface User {
  id: EntityId;
  name: string;
  email: string;
  about: string;
  city: string;
  birthdate: ISODateString;
  gender: Gender;
  avatar: string | null;
  role: 'USER' | 'ADMIN';
  wantToLearn?: Array<{
    id: EntityId;
    name: string;
  }>;
}

export type UsersResponse = User[];
export type CreateUserDto = Pick<User, 'name' | 'email'> & { password: string };
export type UpdateUserDto = Partial<Omit<User, 'id' | 'email' | 'role'>>;