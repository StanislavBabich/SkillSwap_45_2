import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export function createDbOptions(): DataSourceOptions {
  const isTestEnv = process.env.NODE_ENV === 'test';
  const databaseUrl = process.env.DATABASE_URL;
  const synchronize =
    process.env.DB_SYNC === 'true' ||
    (process.env.DB_SYNC !== 'false' && process.env.NODE_ENV !== 'production');

  const common: Pick<DataSourceOptions, 'entities' | 'synchronize' | 'logging'> =
    {
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize,
      logging: false,
    };

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      extra: {
        max: 2,
        ssl: { rejectUnauthorized: false },
      },
      ...common,
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || 'postgres'),
    database: isTestEnv
      ? process.env.DB_NAME_TEST || 'skillswap_test'
      : process.env.DB_NAME || 'skillswap_db',
    ...common,
  };
}

export const dbConfig = registerAs(
  'DB_CONFIG',
  (): DataSourceOptions => createDbOptions(),
);

export type TDbConfig = ReturnType<typeof dbConfig>;
