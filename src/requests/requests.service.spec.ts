import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { UsersService } from '../users/users.service';
import { SkillsService } from '../skills/skills.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Request } from './entities/request.entity';
import { RequestStatus } from './request-status.enums';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import {
  mockUser,
  mockOtherUser,
  mockSkill,
  mockRequest,
  mockCreateRequestDto,
} from '../mocks/mocks';
import { mockRequestRepository } from '../mocks/mock-repositories';

// Фабрики моков вместо any
const createMockUsersService = () => ({
  findOne: jest.fn(),
  addFavoriteSkill: jest.fn(),
});

const createMockSkillsService = () => ({
  findOne: jest.fn(),
});

const createMockNotificationsGateway = () => ({
  notifyUser: jest.fn(),
});

describe('RequestsService', () => {
  let service: RequestsService;
  let requestRepo: ReturnType<typeof mockRequestRepository>;
  let usersService: ReturnType<typeof createMockUsersService>;
  let skillsService: ReturnType<typeof createMockSkillsService>;
  let notificationsGateway: ReturnType<typeof createMockNotificationsGateway>;

  beforeEach(async () => {
    requestRepo = mockRequestRepository();
    usersService = createMockUsersService();
    skillsService = createMockSkillsService();
    notificationsGateway = createMockNotificationsGateway();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        { provide: getRepositoryToken(Request), useValue: requestRepo },
        { provide: UsersService, useValue: usersService },
        { provide: SkillsService, useValue: skillsService },
        { provide: NotificationsGateway, useValue: notificationsGateway },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
  });

  describe('create', () => {
    it('должен создавать новую заявку', async () => {
      usersService.findOne.mockResolvedValue(mockUser);
      skillsService.findOne.mockResolvedValue(mockSkill);
      requestRepo.create.mockReturnValue(mockRequest);
      requestRepo.save.mockResolvedValue(mockRequest);

      const mockQB = requestRepo.createQueryBuilder();
      mockQB.getOne.mockResolvedValue(mockRequest);

      const result = await service.create(mockCreateRequestDto, mockUser.id);
      expect(result.sender.id).toBe(mockUser.id);
    });

    it('должен выбрасывать BadRequestException при попытке отправить заявку самому себе', async () => {
      usersService.findOne.mockResolvedValue(mockUser);
      await expect(
        service.create(
          { ...mockCreateRequestDto, receiverId: mockUser.id },
          mockUser.id,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('accept', () => {
    it('должен принимать заявку', async () => {
      const mockQB = requestRepo.createQueryBuilder();
      mockQB.getOne.mockResolvedValue(mockRequest);
      usersService.addFavoriteSkill.mockResolvedValue(mockUser);
      requestRepo.save.mockResolvedValue({
        ...mockRequest,
        status: RequestStatus.IN_PROGRESS,
      });

      const result = await service.accept(mockRequest.id, mockOtherUser.id);
      expect(result.status).toBe(RequestStatus.IN_PROGRESS);
    });

    it('должен выбрасывать ForbiddenException, если не получатель', async () => {
      const mockQB = requestRepo.createQueryBuilder();
      mockQB.getOne.mockResolvedValue(mockRequest);
      await expect(service.accept(mockRequest.id, mockUser.id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
