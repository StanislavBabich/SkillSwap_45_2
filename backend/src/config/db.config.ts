import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import 'pg';
import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { Category } from '../categories/entities/category.entity';
import { Request } from '../requests/entities/request.entity';
import { City } from '../cities/entities/city.entity';

export function createDbOptions(): DataSourceOptions {
  const isTestEnv = process.env.NODE_ENV === 'test';
  const databaseUrl = process.env.DATABASE_URL?.replace(
    /&?channel_binding=require/g,
    '',
  );

  if (process.env.VERCEL && !databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Add the Neon pooled URL in Vercel → Settings → Environment Variables.',
    );
  }

  const synchronize =
    process.env.DB_SYNC === 'true' ||
    (process.env.DB_SYNC !== 'false' && process.env.NODE_ENV !== 'production');

  const common: Pick<
    DataSourceOptions,
    'entities' | 'synchronize' | 'logging'
  > = {
    entities: [User, Skill, Category, Request, City],
    synchronize,
    logging: false,
  };

  const pool = {
    max: 1,
    connectionTimeoutMillis: 4000,
    idleTimeoutMillis: 5000,
  };

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl: { rejectUnauthorized: false },
      extra: {
        ...pool,
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
    extra: pool,
    ...common,
  };
}

export const dbConfig = registerAs(
  'DB_CONFIG',
  (): DataSourceOptions => createDbOptions(),
);

export type TDbConfig = ReturnType<typeof dbConfig>;
