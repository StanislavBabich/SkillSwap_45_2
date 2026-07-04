import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';  // ← только тип!
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.enums';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { jwtConfig, type TJwtConfig } from '../config/jwt.config';
import { appConfig, type TAppConfig } from '../config/app.config';

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

type RefreshTokenPayload = {
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly configService: TJwtConfig,
    @Inject(appConfig.KEY)
    private readonly appConfigService: TAppConfig,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(dto: RegisterDto): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    // 1. Проверяем, существует ли пользователь
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // 2. Хешируем пароль
    const saltRounds = Number(this.appConfigService.hashSalt) || 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // 3. Создаём пользователя
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: UserRole.USER,
    });

    // 4. Генерируем токены
    const { accessToken, refreshToken } = await this.generateTokens(user);

    // 5. Сохраняем refreshToken в БД
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const jwt = this.configService;

    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: jwt.accessSecret,
        expiresIn: jwt.accessExpiresIn as StringValue,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: jwt.refreshSecret,
        expiresIn: jwt.refreshExpiresIn as StringValue,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}