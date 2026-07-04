import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './auth.types';
import { UserGender } from '../users/entities/user.enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
  //   const { email, password, name } = registerDto;
  //   const existingUser = await this.userRepository.findOne({
  //     where: { email },
  //   });

  //   if (existingUser) {
  //     throw new ConflictException('Пользователь с таким email уже существует');
  //   }

  //   const saltRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password, saltRounds);

  //   const user = this.userRepository.create({
  //     email,
  //     password: hashedPassword,
  //     name,
  //     birthdate: '2000-01-01',
  //     city: 'Unknown',
  //     gender: UserGender.OTHER, 
  //   });

  //   try {
  //     await this.userRepository.save(user);
  //   } catch (error) {
  //     throw new InternalServerErrorException('Ошибка при сохранении пользователя');
  //   }

  //   const tokens = await this.generateTokens(user);

  //   const { password: _, ...userWithoutPassword } = user;
  //   return {
  //     ...tokens,
  //     user: userWithoutPassword as any,
  //   };
  // }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const tokens = await this.generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await this.userRepository.save(user);

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...tokens,
      user: userWithoutPassword as any,
    };
  }

  private async generateTokens(user: UserEntity): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessSecret = this.configService.get<string>('JWT_CONFIG.accessSecret') || 'default-access-secret';
    const refreshSecret = this.configService.get<string>('JWT_CONFIG.refreshSecret') || 'default-refresh-secret';
    const accessExpiresIn = this.configService.get<string>('JWT_CONFIG.accessExpiresIn') || '15m';
    const refreshExpiresIn = this.configService.get<string>('JWT_CONFIG.refreshExpiresIn') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}