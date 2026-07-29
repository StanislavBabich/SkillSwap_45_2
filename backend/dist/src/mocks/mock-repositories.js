"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRequestRepository = exports.mockCategoryRepository = exports.mockSkillRepository = exports.mockUserRepository = exports.createMockQueryBuilder = void 0;
const createMock = () => jest.fn();
const createMockQueryBuilder = () => ({
    leftJoinAndSelect: createMock().mockReturnThis(),
    leftJoin: createMock().mockReturnThis(),
    where: createMock().mockReturnThis(),
    andWhere: createMock().mockReturnThis(),
    orWhere: createMock().mockReturnThis(),
    select: createMock().mockReturnThis(),
    addSelect: createMock().mockReturnThis(),
    skip: createMock().mockReturnThis(),
    take: createMock().mockReturnThis(),
    orderBy: createMock().mockReturnThis(),
    getMany: createMock(),
    getOne: createMock(),
    getManyAndCount: createMock(),
});
exports.createMockQueryBuilder = createMockQueryBuilder;
const mockUserRepository = () => ({
    findOne: createMock(),
    find: createMock(),
    create: createMock(),
    save: createMock(),
    update: createMock(),
    delete: createMock(),
    createQueryBuilder: createMock().mockReturnValue((0, exports.createMockQueryBuilder)()),
});
exports.mockUserRepository = mockUserRepository;
const mockSkillRepository = () => ({
    findOne: createMock(),
    findOneOrFail: createMock(),
    find: createMock(),
    create: createMock(),
    save: createMock(),
    delete: createMock(),
    createQueryBuilder: createMock().mockReturnValue((0, exports.createMockQueryBuilder)()),
});
exports.mockSkillRepository = mockSkillRepository;
const mockCategoryRepository = () => ({
    findOne: createMock(),
    findOneBy: createMock(),
    find: createMock(),
    create: createMock(),
    save: createMock(),
    update: createMock(),
    delete: createMock(),
});
exports.mockCategoryRepository = mockCategoryRepository;
const mockRequestRepository = () => ({
    findOne: createMock(),
    create: createMock(),
    save: createMock(),
    remove: createMock(),
    createQueryBuilder: createMock().mockReturnValue((0, exports.createMockQueryBuilder)()),
});
exports.mockRequestRepository = mockRequestRepository;
//# sourceMappingURL=mock-repositories.js.map