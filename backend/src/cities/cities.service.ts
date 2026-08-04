import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, QueryFailedError, Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { FindCitiesQueryDto } from './dto/find-cities-query.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async findAll({ search }: FindCitiesQueryDto): Promise<City[]> {
    return this.cityRepository.find({
      where: search ? { name: ILike(`%${search}%`) } : undefined,
      order: { name: 'ASC' },
      take: 10,
    });
  }

  async create(createCityDto: CreateCityDto): Promise<City> {
    try {
      return await this.cityRepository.save(
        this.cityRepository.create(createCityDto),
      );
    } catch (error) {
      const driverError: unknown =
        error instanceof QueryFailedError ? error.driverError : undefined;

      if (
        typeof driverError === 'object' &&
        driverError !== null &&
        'code' in driverError &&
        driverError.code === '23505'
      ) {
        throw new ConflictException(
          `City with name ${createCityDto.name} already exists`,
        );
      }

      throw error;
    }
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.cityRepository.preload({
      id,
      ...updateCityDto,
    });

    if (!city) {
      throw new NotFoundException(`City with id ${id} not found`);
    }

    return this.cityRepository.save(city);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cityRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`City with id ${id} not found`);
    }
  }
}
