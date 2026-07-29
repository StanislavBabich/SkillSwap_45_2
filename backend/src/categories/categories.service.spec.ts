import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import {
  mockCategory,
  mockSubCategory,
  mockCreateCategoryDto,
} from '../mocks/mocks';
import { mockCategoryRepository } from '../mocks/mock-repositories';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepo: ReturnType<typeof mockCategoryRepository>;

  beforeEach(async () => {
    categoryRepo = mockCategoryRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: categoryRepo },
      ],
    }).compile();
    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('должен создавать категорию с родителем', async () => {
      categoryRepo.findOneBy.mockResolvedValue(mockCategory);
      categoryRepo.create.mockReturnValue(mockSubCategory);
      categoryRepo.save.mockResolvedValue(mockSubCategory);
      const result = await service.create(mockCreateCategoryDto);
      expect(result.parent).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('должен возвращать дерево категорий', async () => {
      categoryRepo.find.mockResolvedValue([mockCategory]);
      const result = await service.findAll();
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('update', () => {
    it('должен обновлять категорию', async () => {
      const updateDto = { name: 'Updated' };
      categoryRepo.update.mockResolvedValue({ affected: 1 } as UpdateResult);
      categoryRepo.findOne.mockResolvedValue({ ...mockCategory, ...updateDto });
      const result = await service.update(mockCategory.id, updateDto);
      expect(result?.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('должен удалять категорию', async () => {
      categoryRepo.delete.mockResolvedValue({ affected: 1 } as DeleteResult);
      await service.remove(mockCategory.id);
      expect(categoryRepo.delete).toHaveBeenCalledWith(mockCategory.id);
    });
  });
});
