"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockTokens = exports.mockCreateRequestDto = exports.mockRequest = exports.mockGetSkillsDto = exports.mockUpdateSkillDto = exports.mockCreateSkillDto = exports.mockOtherSkill = exports.mockSkill = exports.mockCreateCategoryDto = exports.mockSubCategory = exports.mockCategory = exports.mockLoginDto = exports.mockRegisterDto = exports.mockCreateUserDto = exports.mockAdmin = exports.mockOtherUser = exports.mockUser = exports.mockJwtConfig = exports.mockAppConfig = void 0;
const user_enums_1 = require("../users/user.enums");
const request_status_enums_1 = require("../requests/request-status.enums");
exports.mockAppConfig = { port: 3000, hashSalt: 10 };
exports.mockJwtConfig = {
    accessSecret: 'test_access_secret',
    refreshSecret: 'test_refresh_secret',
    accessExpiresIn: '1h',
    refreshExpiresIn: '7d',
};
exports.mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_password',
    about: 'About me',
    birthdate: '1990-01-01',
    city: 'Moscow',
    gender: user_enums_1.UserGender.MALE,
    avatar: 'avatar.png',
    skills: [],
    sentRequests: [],
    receivedRequests: [],
    favoriteSkills: [],
    role: user_enums_1.UserRole.USER,
    refreshToken: null,
};
exports.mockOtherUser = {
    ...exports.mockUser,
    id: 'other-user-456',
    name: 'Other User',
    email: 'other@example.com',
};
exports.mockAdmin = {
    ...exports.mockUser,
    id: 'admin-789',
    email: 'admin@example.com',
    role: user_enums_1.UserRole.ADMIN,
};
exports.mockCreateUserDto = {
    name: 'New User',
    email: 'new@example.com',
    password: 'new_password',
};
exports.mockRegisterDto = {
    name: 'New User',
    email: 'new@example.com',
    password: 'new_password',
};
exports.mockLoginDto = {
    email: 'test@example.com',
    password: 'test_password',
};
exports.mockCategory = {
    id: 'cat-123',
    name: 'Programming',
    parent: null,
    children: [],
    skills: [],
    createdAt: new Date(),
    updatedAt: new Date(),
};
exports.mockSubCategory = {
    ...exports.mockCategory,
    id: 'cat-456',
    name: 'Backend',
    parent: exports.mockCategory,
};
exports.mockCreateCategoryDto = {
    name: 'New Category',
    parentId: exports.mockCategory.id,
};
exports.mockSkill = {
    id: 'skill-123',
    title: 'NestJS',
    description: 'Framework',
    images: ['/uploads/image1.png'],
    category: exports.mockCategory,
    owner: exports.mockUser,
    offeredInRequests: [],
    requestedInRequests: [],
    createdAt: new Date(),
    updatedAt: new Date(),
};
exports.mockOtherSkill = {
    ...exports.mockSkill,
    id: 'skill-456',
    title: 'React',
    description: 'Frontend Framework',
    owner: exports.mockOtherUser,
};
exports.mockCreateSkillDto = {
    title: 'New Skill',
    description: 'New Description',
    categoryId: exports.mockCategory.id,
};
exports.mockUpdateSkillDto = {
    title: 'Updated Skill',
    categoryId: exports.mockCategory.id,
};
exports.mockGetSkillsDto = {
    page: 1,
    limit: 20,
    search: 'nest',
    category: exports.mockCategory.id,
};
exports.mockRequest = {
    id: 'request-123',
    sender: exports.mockUser,
    receiver: exports.mockOtherUser,
    offeredSkill: exports.mockSkill,
    requestedSkill: exports.mockOtherSkill,
    status: request_status_enums_1.RequestStatus.PENDING,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
};
exports.mockCreateRequestDto = {
    receiverId: exports.mockOtherUser.id,
    offeredSkillId: exports.mockSkill.id,
    requestedSkillId: exports.mockOtherSkill.id,
};
exports.mockTokens = {
    accessToken: 'mock_access_token_123',
    refreshToken: 'mock_refresh_token_123',
};
//# sourceMappingURL=mocks.js.map