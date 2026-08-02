import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

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
