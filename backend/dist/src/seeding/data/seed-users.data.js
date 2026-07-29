"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersData = void 0;
const user_enums_1 = require("../../users/user.enums");
exports.UsersData = [
    {
        name: 'Иван Петров',
        email: 'ivan.petrov@example.com',
        password: 'Test12345',
        about: 'Frontend-разработчик, готов делиться опытом.',
        birthdate: '1995-04-12',
        city: 'Москва',
        gender: user_enums_1.UserGender.MALE,
    },
    {
        name: 'Анна Смирнова',
        email: 'anna.smirnova@example.com',
        password: 'Test12345',
        about: 'UX/UI-дизайнер, изучаю разработку интерфейсов.',
        birthdate: '1997-09-23',
        city: 'Санкт-Петербург',
        gender: user_enums_1.UserGender.FEMALE,
    },
];
//# sourceMappingURL=seed-users.data.js.map