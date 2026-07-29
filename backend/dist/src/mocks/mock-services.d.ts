import { jest } from '@jest/globals';
import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
type MockType<T> = jest.MockedFunction<(...args: unknown[]) => T>;
export declare const mockUsersService: {
    findByEmail: MockType<Promise<User | null>>;
    create: MockType<Promise<User>>;
    updateRefreshToken: MockType<Promise<void>>;
    removeRefreshToken: MockType<Promise<void>>;
    findOne: MockType<Promise<User>>;
    addFavoriteSkill: MockType<Promise<User>>;
};
export declare const mockJwtService: {
    signAsync: MockType<Promise<string>>;
};
export declare const mockSkillsService: {
    findOne: MockType<Promise<Skill>>;
};
export declare const mockNotificationsGateway: {
    notifyUser: MockType<Promise<void>>;
};
export {};
