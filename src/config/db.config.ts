import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const dbConfig = registerAs('DB_CONFIG', (): DataSourceOptions => {
  const isTestEnv = process.env.NODE_ENV === 'test';

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || 'postgres'),
    database: isTestEnv
      ? process.env.DB_NAME_TEST || 'skillswap_test'
      : process.env.DB_NAME || 'skillswap_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false, // отключаем логи в тестах
  };
});

export type TDbConfig = ReturnType<typeof dbConfig>;
