import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { appConfig, type TAppConfig } from '../config/app.config';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { DriverError } from '../common/utils/error-parser.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(appConfig.KEY)
    private readonly appConf: TAppConfig,
  ) {}

  private async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new EntityNotFoundException('User', id);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { favoriteSkills: _favoriteSkills, ...userData } = createUserDto;

      const user = this.userRepository.create(userData);
      
      return this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error as unknown as { driverError?: DriverError };
        if (driverError?.driverError?.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email уже существует',
          );
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.findUserById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findUserById(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new EntityNotFoundException('User', id);
    }

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Неверный текущий пароль');
    }

    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      this.appConf.hashSalt,
    );
    await this.userRepository.update(id, { password: hashedPassword });

    return { message: 'Пароль успешно изменён' };
  }

  async update(
    id: string,
    updateUserDto: Record<string, unknown>,
  ): Promise<User> {
    const user = await this.findUserById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findUserById(id);
    await this.userRepository.delete(user.id);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.findUserById(userId);
    await this.userRepository.update(userId, { refreshToken });
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.findUserById(userId);
    await this.userRepository.update(userId, { refreshToken: null });
  }
}
