import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
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
  const synchronize =
    process.env.DB_SYNC === 'true' ||
    (process.env.DB_SYNC !== 'false' && process.env.NODE_ENV !== 'production');

  const common: Pick<DataSourceOptions, 'entities' | 'synchronize' | 'logging'> =
    {
      entities: [User, Skill, Category, Request, City],
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
