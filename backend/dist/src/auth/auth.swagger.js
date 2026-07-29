"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerRegister = SwaggerRegister;
exports.SwaggerLogin = SwaggerLogin;
exports.SwaggerRefresh = SwaggerRefresh;
exports.SwaggerLogout = SwaggerLogout;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const logout_response_dto_1 = require("./dto/logout-response.dto");
function SwaggerRegister() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Регистрация нового пользователя' }), (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }), (0, swagger_1.ApiCreatedResponse)({
        description: 'Пользователь успешно зарегистрирован',
        type: auth_response_dto_1.AuthResponseDto,
    }), (0, swagger_1.ApiConflictResponse)({
        description: 'Пользователь с таким email уже существует',
    }));
}
function SwaggerLogin() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Вход в аккаунт' }), (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }), (0, swagger_1.ApiOkResponse)({
        description: 'Успешный вход',
        type: auth_response_dto_1.AuthResponseDto,
    }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Неверный email или пароль' }));
}
function SwaggerRefresh() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Обновление токенов' }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }), (0, swagger_1.ApiOkResponse)({
        description: 'Токены успешно обновлены',
        schema: {
            example: {
                accessToken: 'eyJhbGciOi...',
                refreshToken: 'eyJhbGciOi...',
            },
        },
    }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Недействительный refresh token' }));
}
function SwaggerLogout() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Выход из аккаунта' }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOkResponse)({
        description: 'Успешный выход',
        type: logout_response_dto_1.LogoutResponseDto,
    }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Требуется авторизация' }));
}
//# sourceMappingURL=auth.swagger.js.map