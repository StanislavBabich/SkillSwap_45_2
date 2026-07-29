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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./entities/user.entity");
const skill_entity_1 = require("../skills/entities/skill.entity");
const app_config_1 = require("../config/app.config");
const entity_not_found_exception_1 = require("../common/exceptions/entity-not-found.exception");
let UsersService = class UsersService {
    userRepository;
    skillRepository;
    appConf;
    constructor(userRepository, skillRepository, appConf) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.appConf = appConf;
    }
    async findUserById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new entity_not_found_exception_1.EntityNotFoundException('User', id);
        }
        return user;
    }
    async create(createUserDto) {
        try {
            const { favoriteSkills, ...userData } = createUserDto;
            void favoriteSkills;
            const user = this.userRepository.create(userData);
            return this.userRepository.save(user);
        }
        catch (error) {
            if (error instanceof typeorm_2.QueryFailedError) {
                const driverError = error;
                if (driverError?.driverError?.code === '23505') {
                    throw new common_1.ConflictException('Пользователь с таким email уже существует');
                }
            }
            throw error;
        }
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findOne(id) {
        return this.findUserById(id);
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
        });
    }
    async updateProfile(id, dto) {
        const user = await this.findUserById(id);
        Object.assign(user, dto);
        return this.userRepository.save(user);
    }
    async changePassword(id, dto) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: {
                id: true,
                password: true,
            },
        });
        if (!user) {
            throw new entity_not_found_exception_1.EntityNotFoundException('User', id);
        }
        const isOldPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new common_1.UnauthorizedException('Неверный текущий пароль');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, this.appConf.hashSalt);
        await this.userRepository.update(id, { password: hashedPassword });
        return { message: 'Пароль успешно изменён' };
    }
    async update(id, updateUserDto) {
        const user = await this.findUserById(id);
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }
    async remove(id) {
        const user = await this.findUserById(id);
        await this.userRepository.delete(user.id);
    }
    async updateRefreshToken(userId, refreshToken) {
        await this.findUserById(userId);
        await this.userRepository.update(userId, { refreshToken });
    }
    async removeRefreshToken(userId) {
        await this.findUserById(userId);
        await this.userRepository.update(userId, { refreshToken: null });
    }
    async addFavoriteSkill(userId, skillId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: { favoriteSkills: true },
        });
        if (!user) {
            throw new entity_not_found_exception_1.EntityNotFoundException('User', userId);
        }
        const skill = await this.skillRepository.findOne({
            where: { id: skillId },
        });
        if (!skill) {
            throw new entity_not_found_exception_1.EntityNotFoundException('Skill', skillId);
        }
        const isAlreadyFavorite = user.favoriteSkills.some((favSkill) => favSkill.id === skillId);
        if (isAlreadyFavorite) {
            throw new common_1.BadRequestException('Навык уже добавлен в избранное');
        }
        user.favoriteSkills.push(skill);
        await this.userRepository.save(user);
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __param(2, (0, common_1.Inject)(app_config_1.appConfig.KEY)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], UsersService);
//# sourceMappingURL=users.service.js.map