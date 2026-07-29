"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const users_module_1 = require("../users/users.module");
const user_entity_1 = require("../users/entities/user.entity");
const jwt_config_1 = require("../config/jwt.config");
const refresh_token_strategy_1 = require("./strategies/refresh-token.strategy");
const refresh_token_guard_1 = require("./guards/refresh-token.guard");
const access_token_strategy_1 = require("./strategies/access-token.strategy");
const access_token_guard_1 = require("./guards/access-token.guard");
const roles_guard_1 = require("./guards/roles.guard");
const ws_jwt_guard_1 = require("./guards/ws-jwt.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    secret: config.accessSecret,
                    signOptions: {
                        expiresIn: config.accessExpiresIn,
                    },
                }),
                inject: [jwt_config_1.jwtConfig.KEY],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            access_token_strategy_1.AccessTokenStrategy,
            access_token_guard_1.AccessTokenGuard,
            refresh_token_strategy_1.RefreshTokenStrategy,
            refresh_token_guard_1.RefreshTokenGuard,
            ws_jwt_guard_1.WsJwtGuard,
            roles_guard_1.RolesGuard,
        ],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule, ws_jwt_guard_1.WsJwtGuard, access_token_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map