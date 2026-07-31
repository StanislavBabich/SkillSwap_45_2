import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';

describe('CitiesService', () => {
  let service: CitiesService;
  let repository: jest.Mocked<Pick<Repository<City>, 'preload' | 'save'>>;

  beforeEach(async () => {
    repository = {
      preload: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: getRepositoryToken(City), useValue: repository },
      ],
    }).compile();

    service = module.get(CitiesService);
  });

  it('updates and returns a city', async () => {
    const city = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Moscow',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repository.preload.mockResolvedValue(city);
    repository.save.mockResolvedValue(city);

    await expect(service.update(city.id, { name: city.name })).resolves.toEqual(
      city,
    );
    expect(repository.preload).toHaveBeenCalledWith({
      id: city.id,
      name: city.name,
    });
    expect(repository.save).toHaveBeenCalledWith(city);
  });

  it('throws NotFoundException when the city does not exist', async () => {
    repository.preload.mockResolvedValue(undefined);

    await expect(
      service.update('550e8400-e29b-41d4-a716-446655440000', {
        name: 'Moscow',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
