"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = seedUsers;
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const user_enums_1 = require("../users/user.enums");
const seed_users_data_1 = require("./data/seed-users.data");
async function seedUsers(dataSource) {
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const categoryRepository = dataSource.getRepository(category_entity_1.Category);
    const hashSalt = Number(process.env.HASH_SALT) || 10;
    await userRepository.delete({ role: user_enums_1.UserRole.USER });
    for (const data of seed_users_data_1.UsersData) {
        const { wantToLearnCategories, ...userFields } = data;
        const password = await bcrypt.hash(userFields.password, hashSalt);
        let wantToLearn = [];
        if (wantToLearnCategories && wantToLearnCategories.length > 0) {
            const categories = await Promise.all(wantToLearnCategories.map((name) => categoryRepository.findOneBy({ name })));
            wantToLearn = categories.filter(Boolean);
        }
        await userRepository.save(userRepository.create({
            ...userFields,
            password,
            role: user_enums_1.UserRole.USER,
            wantToLearn,
        }));
    }
    console.log(`Пользователи: обработано ${seed_users_data_1.UsersData.length}`);
}
//# sourceMappingURL=seed-users.js.map