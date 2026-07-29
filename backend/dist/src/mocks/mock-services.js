"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockNotificationsGateway = exports.mockSkillsService = exports.mockJwtService = exports.mockUsersService = void 0;
const globals_1 = require("@jest/globals");
const createMock = () => globals_1.jest.fn();
exports.mockUsersService = {
    findByEmail: createMock(),
    create: createMock(),
    updateRefreshToken: createMock(),
    removeRefreshToken: createMock(),
    findOne: createMock(),
    addFavoriteSkill: createMock(),
};
exports.mockJwtService = {
    signAsync: createMock(),
};
exports.mockSkillsService = {
    findOne: createMock(),
};
exports.mockNotificationsGateway = {
    notifyUser: createMock(),
};
//# sourceMappingURL=mock-services.js.map