"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminData = void 0;
const getAdminData = () => ({
    name: process.env.ADMIN_NAME || 'Администратор SkillSwap',
    email: process.env.ADMIN_EMAIL || 'admin@skillswap.local',
    password: process.env.ADMIN_PASSWORD || 'Admin12345',
});
exports.getAdminData = getAdminData;
//# sourceMappingURL=seed-admin.data.js.map