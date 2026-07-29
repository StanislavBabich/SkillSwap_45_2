import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { UpdateResult } from 'typeorm';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { ChangePasswordDto } from './dto/change-password.dto';
import { appConfig } from '../config/app.config';
import {
  mockAppConfig,
  mockUser,
  mockCreateUserDto,
  mockSkill,
} from '../mocks/mocks';
import {
  mockUserRepository,
  mockSkillRepository,
} from '../mocks/mock-repositories';

jest.mock('bcrypt', () => ({ compare: jest.fn(), hash: jest.fn() }));

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: ReturnType<typeof mockUserRepository>;
  let skillRepo: ReturnType<typeof mockSkillRepository>;

  beforeEach(async () => {
    userRepo = mockUserRepository();
    skillRepo = mockSkillRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Skill), useValue: skillRepo },
        { provide: appConfig.KEY, useValue: mockAppConfig },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('должен создавать нового пользователя', async () => {
      userRepo.create.mockReturnValue(mockUser);
      userRepo.save.mockResolvedValue(mockUser);
      const result = await service.create(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('должен выбрасывать ConflictException при дублировании email', async () => {
      userRepo.create.mockReturnValue(mockUser);
      userRepo.save.mockRejectedValue(
        new ConflictException('Пользователь с таким email уже существует'),
      );

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('должен успешно обновлять данные пользователя', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateDto };

      userRepo.findOne.mockResolvedValue(mockUser);
      userRepo.save.mockResolvedValue(updatedUser);

      const result = await service.update(mockUser.id, updateDto);
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('changePassword', () => {
    it('должен успешно изменять пароль', async () => {
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'old',
        newPassword: 'new',
      };
      const user = { id: mockUser.id, password: 'hashed' } as User;

      userRepo.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashed');
      userRepo.update.mockResolvedValue({ affected: 1 } as UpdateResult);

      const result = await service.changePassword(
        mockUser.id,
        changePasswordDto,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith('old', 'hashed');
      expect(result).toEqual({ message: 'Пароль успешно изменён' });
    });

    it('должен выбрасывать EntityNotFoundException, если пользователь не найден', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(
        service.changePassword(mockUser.id, {
          oldPassword: 'old',
          newPassword: 'new',
        }),
      ).rejects.toThrow(EntityNotFoundException);
    });

    it('должен выбрасывать UnauthorizedException, если старый пароль неверный', async () => {
      const user = { id: mockUser.id, password: 'hashed' } as User;
      userRepo.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword(mockUser.id, {
          oldPassword: 'wrong',
          newPassword: 'new',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('addFavoriteSkill', () => {
    it('должен добавлять навык в избранное', async () => {
      const userWithSkills = { ...mockUser, favoriteSkills: [] };
      userRepo.findOne.mockResolvedValue(userWithSkills);
      skillRepo.findOne.mockResolvedValue(mockSkill);
      userRepo.save.mockResolvedValue({
        ...userWithSkills,
        favoriteSkills: [mockSkill],
      });

      const result = await service.addFavoriteSkill(mockUser.id, mockSkill.id);
      expect(result.favoriteSkills).toContainEqual(mockSkill);
    });

    it('должен выбрасывать BadRequestException, если навык уже в избранном', async () => {
      const userWithSkills = { ...mockUser, favoriteSkills: [mockSkill] };
      userRepo.findOne.mockResolvedValue(userWithSkills);
      skillRepo.findOne.mockResolvedValue(mockSkill);

      await expect(
        service.addFavoriteSkill(mockUser.id, mockSkill.id),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
