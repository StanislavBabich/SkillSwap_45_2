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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const users_service_1 = require("../users/users.service");
const user_enums_1 = require("../users/user.enums");
const jwt_config_1 = require("../config/jwt.config");
const app_config_1 = require("../config/app.config");
let AuthService = class AuthService {
    usersService;
    jwtService;
    jwtConf;
    appConf;
    userRepository;
    constructor(usersService, jwtService, jwtConf, appConf, userRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.jwtConf = jwtConf;
        this.appConf = appConf;
        this.userRepository = userRepository;
    }
    async registerUser(dto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Пользователь с таким email уже существует');
        }
        const saltRounds = this.appConf.hashSalt;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: user_enums_1.UserRole.USER,
        });
        const { accessToken, refreshToken } = await this.generateTokens(user);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);
        await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);
        return { user, accessToken, refreshToken };
    }
    async login(dto) {
        const { email, password } = dto;
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();
        if (!user) {
            throw new common_1.UnauthorizedException('Неверный email или пароль');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Неверный email или пароль');
        }
        const { accessToken, refreshToken } = await this.generateTokens(user);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, this.appConf.hashSalt);
        await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);
        return {
            accessToken,
            refreshToken,
            user,
        };
    }
    async refresh(userId, refreshToken) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.refreshToken')
            .where('user.id = :id', { id: userId })
            .getOne();
        if (!user?.refreshToken) {
            throw new common_1.UnauthorizedException('Недействительный refresh token');
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            throw new common_1.UnauthorizedException('Недействительный refresh token');
        }
        const tokens = await this.generateTokens(user);
        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, this.appConf.hashSalt);
        await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);
        return tokens;
    }
    async logout(userId) {
        await this.usersService.removeRefreshToken(userId);
        return { message: 'Вы успешно вышли из аккаунта' };
    }
    async generateTokens(user) {
        const accessPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const refreshPayload = {
            sub: user.id,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(accessPayload, {
                secret: this.jwtConf.accessSecret,
                expiresIn: this.jwtConf.accessExpiresIn,
            }),
            this.jwtService.signAsync(refreshPayload, {
                secret: this.jwtConf.refreshSecret,
                expiresIn: this.jwtConf.refreshExpiresIn,
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(jwt_config_1.jwtConfig.KEY)),
    __param(3, (0, common_1.Inject)(app_config_1.appConfig.KEY)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService, Object, Object, typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map