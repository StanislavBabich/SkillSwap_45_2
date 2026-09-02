import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { appConfig } from '../config/app.config';
import { jwtConfig } from '../config/jwt.config';
import {
  mockAppConfig,
  mockJwtConfig,
  mockLoginDto,
  mockRegisterDto,
  mockTokens,
  mockUser,
} from '../mocks/mocks';
import { mockUserRepository } from '../mocks/mock-repositories';

jest.mock('bcrypt', () => ({ compare: jest.fn(), hash: jest.fn() }));

// Фабрики моков вместо any
const createMockUsersService = () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
  updateRefreshToken: jest.fn(),
  removeRefreshToken: jest.fn(),
});

const createMockJwtService = () => ({
  signAsync: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: ReturnType<typeof createMockUsersService>;
  let jwtService: ReturnType<typeof createMockJwtService>;
  let userRepo: ReturnType<typeof mockUserRepository>;

  beforeEach(async () => {
    usersService = createMockUsersService();
    jwtService = createMockJwtService();
    userRepo = mockUserRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: appConfig.KEY, useValue: mockAppConfig },
        { provide: jwtConfig.KEY, useValue: mockJwtConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('registerUser', () => {
    it('должен успешно зарегистрировать пользователя', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      usersService.create.mockResolvedValue(mockUser);
      jwtService.signAsync
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);

      const result = await service.registerUser(mockRegisterDto);
      expect(result.user).toEqual(mockUser);
    });

    it('должен выбрасывать ConflictException, если email уже существует', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      await expect(service.registerUser(mockRegisterDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('должен успешно войти в систему', async () => {
      const mockQB = userRepo.createQueryBuilder();
      mockQB.getOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce(mockTokens.accessToken)
        .mockResolvedValueOnce(mockTokens.refreshToken);

      const result = await service.login(mockLoginDto);
      expect(result.accessToken).toBe(mockTokens.accessToken);
    });

    it('должен выбрасывать UnauthorizedException при неверном пароле', async () => {
      const mockQB = userRepo.createQueryBuilder();
      mockQB.getOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
