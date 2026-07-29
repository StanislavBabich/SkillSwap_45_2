"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsData = void 0;
const seed_users_data_1 = require("./seed-users.data");
exports.SkillsData = [
    {
        title: 'Современный Frontend на React',
        description: 'Компоненты, состояние, маршрутизация и работа с API.',
        categoryName: 'Frontend',
        ownerEmail: seed_users_data_1.UsersData[0].email,
    },
    {
        title: 'Основы UX/UI-дизайна',
        description: 'Исследование пользователей, прототипы и дизайн-системы.',
        categoryName: 'UX/UI',
        ownerEmail: seed_users_data_1.UsersData[1].email,
    },
];
//# sourceMappingURL=seed-skills.data.js.map