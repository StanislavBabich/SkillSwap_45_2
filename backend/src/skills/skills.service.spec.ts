import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { Skill } from './entities/skill.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import * as fsPromises from 'fs/promises';
import {
  mockUser,
  mockOtherUser,
  mockCategory,
  mockSkill,
  mockCreateSkillDto,
  mockUpdateSkillDto,
  mockGetSkillsDto,
} from '../mocks/mocks';
import {
  mockSkillRepository,
  mockCategoryRepository,
  mockUserRepository,
  createMockQueryBuilder,
} from '../mocks/mock-repositories';

jest.mock('fs/promises', () => ({ unlink: jest.fn() }));

describe('SkillsService', () => {
  let service: SkillsService;
  let skillRepo: ReturnType<typeof mockSkillRepository>;
  let categoryRepo: ReturnType<typeof mockCategoryRepository>;
  let userRepo: ReturnType<typeof mockUserRepository>;

  beforeEach(async () => {
    skillRepo = mockSkillRepository();
    categoryRepo = mockCategoryRepository();
    userRepo = mockUserRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        { provide: getRepositoryToken(Skill), useValue: skillRepo },
        { provide: getRepositoryToken(Category), useValue: categoryRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
  });

  describe('create', () => {
    it('должен создавать новый навык', async () => {
      skillRepo.create.mockReturnValue(mockSkill);
      skillRepo.save.mockResolvedValue(mockSkill);
      const result = await service.create(mockCreateSkillDto, mockUser.id);
      expect(result).toEqual(mockSkill);
    });

    it('должен выбрасывать UnauthorizedException, если userId не передан', async () => {
      await expect(service.create(mockCreateSkillDto, '')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findAll', () => {
    it('должен возвращать пагинированный список навыков', async () => {
      // Передаем дженерик Skill, чтобы типы совпали
      const mockQB = createMockQueryBuilder<Skill>();
      skillRepo.createQueryBuilder.mockReturnValue(mockQB);
      mockQB.getManyAndCount.mockResolvedValue([[mockSkill], 1]);

      const result = await service.findAll(mockGetSkillsDto);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('update', () => {
    it('должен обновлять данные навыка', async () => {
      skillRepo.findOne.mockResolvedValue(mockSkill);
      categoryRepo.findOneBy.mockResolvedValue(mockCategory);
      skillRepo.save.mockResolvedValue({ ...mockSkill, title: 'Updated' });
      skillRepo.findOneOrFail.mockResolvedValue({
        ...mockSkill,
        title: 'Updated',
      });

      const result = await service.update(
        mockSkill.id,
        mockUpdateSkillDto,
        mockUser.id,
      );
      expect(result.title).toBe('Updated');
    });

    it('должен выбрасывать ForbiddenException при попытке редактировать чужой навык', async () => {
      skillRepo.findOne.mockResolvedValue({
        ...mockSkill,
        owner: mockOtherUser,
      });
      await expect(
        service.update(mockSkill.id, mockUpdateSkillDto, mockUser.id),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('должен удалять навык и связанные файлы', async () => {
      skillRepo.findOne.mockResolvedValue(mockSkill);
      skillRepo.delete.mockResolvedValue({ affected: 1 } as DeleteResult);
      (fsPromises.unlink as jest.Mock).mockResolvedValue(undefined);

      await service.remove(mockSkill.id, mockUser.id);
      expect(fsPromises.unlink).toHaveBeenCalled();
    });
  });
});
