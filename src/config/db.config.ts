import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const dbConfig = registerAs(
  'DB_CONFIG',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
);

export type TDbConfig = ReturnType<typeof dbConfig>;