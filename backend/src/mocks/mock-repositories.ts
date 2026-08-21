import { UpdateResult, DeleteResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Category } from '../categories/entities/category.entity';
import { Request } from '../requests/entities/request.entity';

type MockType<T> = jest.MockedFunction<(...args: unknown[]) => T>;
const createMock = <T>(): MockType<T> => jest.fn();

export interface MockQueryBuilder<T = unknown> {
  leftJoinAndSelect: MockType<MockQueryBuilder<T>>;
  leftJoin: MockType<MockQueryBuilder<T>>;
  where: MockType<MockQueryBuilder<T>>;
  andWhere: MockType<MockQueryBuilder<T>>;
  orWhere: MockType<MockQueryBuilder<T>>;
  select: MockType<MockQueryBuilder<T>>;
  addSelect: MockType<MockQueryBuilder<T>>;
  skip: MockType<MockQueryBuilder<T>>;
  take: MockType<MockQueryBuilder<T>>;
  orderBy: MockType<MockQueryBuilder<T>>;
  getMany: MockType<Promise<T[]>>;
  getOne: MockType<Promise<T | null>>;
  getManyAndCount: MockType<Promise<[T[], number]>>;
}

export const createMockQueryBuilder = <T = unknown>(): MockQueryBuilder<T> => ({
  leftJoinAndSelect: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  leftJoin: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  where: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  andWhere: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  orWhere: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  select: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  addSelect: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  skip: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  take: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  orderBy: createMock<MockQueryBuilder<T>>().mockReturnThis(),
  getMany: createMock<Promise<T[]>>(),
  getOne: createMock<Promise<T | null>>(),
  getManyAndCount: createMock<Promise<[T[], number]>>(),
});

export const mockUserRepository = () => ({
  findOne: createMock<Promise<User | null>>(),
  find: createMock<Promise<User[]>>(),
  create: createMock<User>(),
  save: createMock<Promise<User>>(),
  update: createMock<Promise<UpdateResult>>(),
  delete: createMock<Promise<DeleteResult>>(),
  createQueryBuilder: createMock<MockQueryBuilder<User>>().mockReturnValue(
    createMockQueryBuilder<User>(),
  ),
});

export const mockSkillRepository = () => ({
  findOne: createMock<Promise<Skill | null>>(),
  findOneOrFail: createMock<Promise<Skill>>(),
  find: createMock<Promise<Skill[]>>(),
  create: createMock<Skill>(),
  save: createMock<Promise<Skill>>(),
  delete: createMock<Promise<DeleteResult>>(),
  createQueryBuilder: createMock<MockQueryBuilder<Skill>>().mockReturnValue(
    createMockQueryBuilder<Skill>(),
  ),
});

export const mockCategoryRepository = () => ({
  findOne: createMock<Promise<Category | null>>(),
  findOneBy: createMock<Promise<Category | null>>(),
  find: createMock<Promise<Category[]>>(),
  findBy: createMock<Promise<Category[]>>(),
  create: createMock<Category>(),
  save: createMock<Promise<Category>>(),
  update: createMock<Promise<UpdateResult>>(),
  delete: createMock<Promise<DeleteResult>>(),
});

export const mockRequestRepository = () => ({
  findOne: createMock<Promise<Request | null>>(),
  create: createMock<Request>(),
  save: createMock<Promise<Request>>(),
  remove: createMock<Promise<Request>>(),
  createQueryBuilder: createMock<MockQueryBuilder<Request>>().mockReturnValue(
    createMockQueryBuilder<Request>(),
  ),
});
