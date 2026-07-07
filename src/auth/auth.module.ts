import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { jwtConfig, type TJwtConfig } from '../config/jwt.config';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: TJwtConfig): JwtModuleOptions => ({
        secret: config.accessSecret,
        signOptions: {
          expiresIn: config.accessExpiresIn,
        } as JwtModuleOptions['signOptions'],
      }),
      inject: [jwtConfig.KEY],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenStrategy,
    RefreshTokenGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
