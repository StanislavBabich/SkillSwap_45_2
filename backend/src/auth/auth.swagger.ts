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
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({ type: RegisterDto }),
    ApiCreatedResponse({
      description: 'User registered successfully',
      type: AuthResponseDto,
    }),
    ApiConflictResponse({
      description: 'A user with this email already exists',
    }),
  );
}

export function SwaggerLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Log in' }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({
      description: 'Login successful',
      type: AuthResponseDto,
    }),
    ApiUnauthorizedResponse({ description: 'Invalid email or password' }),
  );
}

export function SwaggerRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh tokens' }),
    ApiBearerAuth(),
    ApiBody({ type: RefreshTokenDto }),
    ApiOkResponse({
      description: 'Tokens refreshed successfully',
      schema: {
        example: {
          accessToken: 'eyJhbGciOi...',
          refreshToken: 'eyJhbGciOi...',
        },
      },
    }),
    ApiUnauthorizedResponse({ description: 'Invalid refresh token' }),
  );
}

export function SwaggerLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Log out' }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Logout successful',
      type: LogoutResponseDto,
    }),
    ApiUnauthorizedResponse({ description: 'Authorization required' }),
  );
}
