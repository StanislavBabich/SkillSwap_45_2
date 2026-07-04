import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('JWT_CONFIG', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'default_access_secret_change_me',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_me',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));

export type TJwtConfig = ReturnType<typeof jwtConfig>;