import { UpdateResult, DeleteResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Category } from '../categories/entities/category.entity';
import { Request } from '../requests/entities/request.entity';
type MockType<T> = jest.MockedFunction<(...args: unknown[]) => T>;
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
export declare const createMockQueryBuilder: <T = unknown>() => MockQueryBuilder<T>;
export declare const mockUserRepository: () => {
    findOne: MockType<Promise<User | null>>;
    find: MockType<Promise<User[]>>;
    create: MockType<User>;
    save: MockType<Promise<User>>;
    update: MockType<Promise<UpdateResult>>;
    delete: MockType<Promise<DeleteResult>>;
    createQueryBuilder: MockType<MockQueryBuilder<User>>;
};
export declare const mockSkillRepository: () => {
    findOne: MockType<Promise<Skill | null>>;
    findOneOrFail: MockType<Promise<Skill>>;
    find: MockType<Promise<Skill[]>>;
    create: MockType<Skill>;
    save: MockType<Promise<Skill>>;
    delete: MockType<Promise<DeleteResult>>;
    createQueryBuilder: MockType<MockQueryBuilder<Skill>>;
};
export declare const mockCategoryRepository: () => {
    findOne: MockType<Promise<Category | null>>;
    findOneBy: MockType<Promise<Category | null>>;
    find: MockType<Promise<Category[]>>;
    create: MockType<Category>;
    save: MockType<Promise<Category>>;
    update: MockType<Promise<UpdateResult>>;
    delete: MockType<Promise<DeleteResult>>;
};
export declare const mockRequestRepository: () => {
    findOne: MockType<Promise<Request | null>>;
    create: MockType<Request>;
    save: MockType<Promise<Request>>;
    remove: MockType<Promise<Request>>;
    createQueryBuilder: MockType<MockQueryBuilder<Request>>;
};
export {};
