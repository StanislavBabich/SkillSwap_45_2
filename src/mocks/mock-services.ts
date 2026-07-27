import { jest } from '@jest/globals';
import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';

type MockType<T> = jest.MockedFunction<(...args: unknown[]) => T>;
const createMock = <T>(): MockType<T> => jest.fn() as unknown as MockType<T>;

export const mockUsersService = {
  findByEmail: createMock<Promise<User | null>>(),
  create: createMock<Promise<User>>(),
  updateRefreshToken: createMock<Promise<void>>(),
  removeRefreshToken: createMock<Promise<void>>(),
  findOne: createMock<Promise<User>>(),
  addFavoriteSkill: createMock<Promise<User>>(),
};

export const mockJwtService = {
  signAsync: createMock<Promise<string>>(),
};

export const mockSkillsService = {
  findOne: createMock<Promise<Skill>>(),
};

export const mockNotificationsGateway = {
  notifyUser: createMock<Promise<void>>(),
};