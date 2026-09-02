import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, QueryFailedError, Repository } from 'typeorm';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';

describe('CitiesService', () => {
  let service: CitiesService;
  let cityRepository: jest.Mocked<
    Pick<Repository<City>, 'find' | 'create' | 'preload' | 'save' | 'delete'>
  >;

  const cityId = '550e8400-e29b-41d4-a716-446655440000';
  const mockCity: City = {
    id: cityId,
    name: 'Moscow',
    createdAt: new Date('2026-08-10T10:00:00.000Z'),
    updatedAt: new Date('2026-08-10T10:00:00.000Z'),
  };

  beforeEach(async () => {
    cityRepository = {
      find: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getRepositoryToken(City),
          useValue: cityRepository,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  describe('findAll', () => {
    it('должен возвращать не более 10 городов, отсортированных по имени', async () => {
      cityRepository.find.mockResolvedValue([mockCity]);

      const result = await service.findAll({});

      expect(result).toEqual([mockCity]);
      expect(cityRepository.find).toHaveBeenCalledWith({
        where: undefined,
        order: { name: 'ASC' },
        take: 10,
      });
    });

    it('должен искать города по подстроке без учета регистра', async () => {
      cityRepository.find.mockResolvedValue([mockCity]);

      const result = await service.findAll({ search: 'mosc' });

      expect(result).toEqual([mockCity]);
      expect(cityRepository.find).toHaveBeenCalledWith({
        where: { name: ILike('%mosc%') },
        order: { name: 'ASC' },
        take: 10,
      });
    });
  });

  describe('create', () => {
    it('должен создавать и возвращать город', async () => {
      const createCityDto = { name: mockCity.name };
      cityRepository.create.mockReturnValue(mockCity);
      cityRepository.save.mockResolvedValue(mockCity);

      const result = await service.create(createCityDto);

      expect(result).toEqual(mockCity);
      expect(cityRepository.create).toHaveBeenCalledWith(createCityDto);
      expect(cityRepository.save).toHaveBeenCalledWith(mockCity);
    });

    it('должен выбрасывать ConflictException при создании города с существующим именем', async () => {
      const createCityDto = { name: mockCity.name };
      const duplicateError = new QueryFailedError(
        'INSERT INTO cities ...',
        [],
        { code: '23505' } as Error & { code: string },
      );

      cityRepository.create.mockReturnValue(mockCity);
      cityRepository.save.mockRejectedValue(duplicateError);

      await expect(service.create(createCityDto)).rejects.toThrow(
        new ConflictException(
          `City with name ${createCityDto.name} already exists`,
        ),
      );
    });

    it('должен пробрасывать неизвестную ошибку базы данных', async () => {
      const createCityDto = { name: mockCity.name };
      const databaseError = new Error('Database connection failed');

      cityRepository.create.mockReturnValue(mockCity);
      cityRepository.save.mockRejectedValue(databaseError);

      await expect(service.create(createCityDto)).rejects.toThrow(
        databaseError,
      );
    });
  });

  describe('update', () => {
    it('должен обновлять и возвращать город', async () => {
      const updateCityDto = { name: 'Moscow' };
      const updatedCity = { ...mockCity, ...updateCityDto };

      cityRepository.preload.mockResolvedValue(updatedCity);
      cityRepository.save.mockResolvedValue(updatedCity);

      const result = await service.update(cityId, updateCityDto);

      expect(result).toEqual(updatedCity);
      expect(cityRepository.preload).toHaveBeenCalledWith({
        id: cityId,
        ...updateCityDto,
      });
      expect(cityRepository.save).toHaveBeenCalledWith(updatedCity);
    });

    it('должен выбрасывать NotFoundException, если город не найден', async () => {
      cityRepository.preload.mockResolvedValue(undefined);

      await expect(service.update(cityId, { name: 'Moscow' })).rejects.toThrow(
        new NotFoundException(`City with id ${cityId} not found`),
      );

      expect(cityRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('должен удалять существующий город', async () => {
      cityRepository.delete.mockResolvedValue({
        raw: [],
        affected: 1,
      });

      await expect(service.remove(cityId)).resolves.toBeUndefined();
      expect(cityRepository.delete).toHaveBeenCalledWith(cityId);
    });

    it('должен выбрасывать NotFoundException, если город не найден', async () => {
      cityRepository.delete.mockResolvedValue({
        raw: [],
        affected: 0,
      });

      await expect(service.remove(cityId)).rejects.toThrow(
        new NotFoundException(`City with id ${cityId} not found`),
      );
    });
  });
});
