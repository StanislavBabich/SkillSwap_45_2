import { ConfigService } from '@nestjs/config';

export const appConfig = (configService: ConfigService) => ({
  port: configService.get<number>('PORT', 3000),
  hashSalt: configService.get<string>('HASH_SALT', 'default_salt'),
});