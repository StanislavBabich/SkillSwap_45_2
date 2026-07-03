import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const dbConfig = registerAs(
  'DB_CONFIG',
  (): DataSourceOptions => ({
    type: 'postgres',

    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'skillswap_db',
  }),
);

export type TDbConfig = ReturnType<typeof dbConfig>;