import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';

describe('CitiesController', () => {
  let controller: CitiesController;
  let citiesService: jest.Mocked<
    Pick<CitiesService, 'findAll' | 'create' | 'update' | 'remove'>
  >;

  const cityId = '550e8400-e29b-41d4-a716-446655440000';
  const mockCity: City = {
    id: cityId,
    name: 'Москва',
    createdAt: new Date('2026-08-10T10:00:00.000Z'),
    updatedAt: new Date('2026-08-10T10:00:00.000Z'),
  };

  beforeEach(async () => {
    citiesService = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
          provide: CitiesService,
          useValue: citiesService,
        },
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('должен передавать query в CitiesService.findAll', async () => {
      const query = { search: 'моск' };
      citiesService.findAll.mockResolvedValue([mockCity]);

      await expect(controller.findAll(query)).resolves.toEqual([mockCity]);
      expect(citiesService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('create', () => {
    it('должен передавать dto в CitiesService.create', async () => {
      const createCityDto = { name: mockCity.name };
      citiesService.create.mockResolvedValue(mockCity);

      await expect(controller.create(createCityDto)).resolves.toEqual(mockCity);
      expect(citiesService.create).toHaveBeenCalledWith(createCityDto);
    });
  });

  describe('update', () => {
    it('должен передавать id и dto в CitiesService.update', async () => {
      const updateCityDto = { name: 'Moscow' };
      const updatedCity = { ...mockCity, ...updateCityDto };
      citiesService.update.mockResolvedValue(updatedCity);

      await expect(controller.update(cityId, updateCityDto)).resolves.toEqual(
        updatedCity,
      );
      expect(citiesService.update).toHaveBeenCalledWith(cityId, updateCityDto);
    });
  });

  describe('remove', () => {
    it('должен передавать id в CitiesService.remove', async () => {
      citiesService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(cityId)).resolves.toBeUndefined();
      expect(citiesService.remove).toHaveBeenCalledWith(cityId);
    });
  });
});
