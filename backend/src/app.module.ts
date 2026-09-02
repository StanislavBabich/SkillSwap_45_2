import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from './config/app.config';
import { dbConfig, TDbConfig } from './config/db.config';
import { jwtConfig } from './config/jwt.config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SkillsModule } from './skills/skills.module';
import { FilesModule } from './files/files.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RequestsModule } from './requests/requests.module';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, dbConfig, jwtConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [dbConfig.KEY],
      useFactory: (config: TDbConfig) => ({
        ...config,
        retryAttempts: process.env.VERCEL ? 1 : 10,
        retryDelay: 1000,
      }),
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 10,
        },
      ],
    }),

    UsersModule,
    AuthModule,
    SkillsModule,
    FilesModule,
    CategoriesModule,
    NotificationsModule,
    RequestsModule,
    CitiesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
