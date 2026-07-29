import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';

export function SwaggerRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Регистрация нового пользователя' }),
    ApiBody({ type: RegisterDto }),
    ApiCreatedResponse({
      description: 'Пользователь успешно зарегистрирован',
      type: AuthResponseDto,
    }),
    ApiConflictResponse({
      description: 'Пользователь с таким email уже существует',
    }),
  );
}

export function SwaggerLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Вход в аккаунт' }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({
      description: 'Успешный вход',
      type: AuthResponseDto,
    }),
    ApiUnauthorizedResponse({ description: 'Неверный email или пароль' }),
  );
}

export function SwaggerRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Обновление токенов' }),
    ApiBearerAuth(),
    ApiBody({ type: RefreshTokenDto }),
    ApiOkResponse({
      description: 'Токены успешно обновлены',
      schema: {
        example: {
          accessToken: 'eyJhbGciOi...',
          refreshToken: 'eyJhbGciOi...',
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Недействительный refresh token' }),
  );
}

export function SwaggerLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Выход из аккаунта' }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Успешный выход',
      type: LogoutResponseDto,
    }),
    ApiUnauthorizedResponse({ description: 'Требуется авторизация' }),
  );
}
