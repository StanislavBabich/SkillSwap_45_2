import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        about: true,
        birthdate: true,
        city: true,
        gender: true,
        avatar: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  /**
   * Поиск пользователя с паролем (для логина и смены пароля)
   */
  async findOneWithPassword(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        about: true,
        birthdate: true,
        city: true,
        gender: true,
        avatar: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Обновление профиля (name, about, birthdate, city, gender, avatar)
   */
  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    await this.userRepository.update(id, dto);
    return this.findOne(id);
  }

  /**
   * Смена пароля с проверкой старого
   */
  async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.findOneWithPassword(id);

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Неверный текущий пароль');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.update(id, { password: hashedPassword });

    return { message: 'Пароль успешно изменён' };
  }

  async update(
    id: string,
    updateUserDto: Record<string, unknown>,
  ): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }
}
