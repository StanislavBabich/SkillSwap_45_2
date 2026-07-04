import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('APP_CONFIG', () => ({
  port: Number(process.env.PORT) || 3000,
  hashSalt: process.env.HASH_SALT || 'default_salt',
}));

export type TAppConfig = ReturnType<typeof appConfig>;