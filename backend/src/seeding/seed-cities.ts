import { DataSource } from 'typeorm';
import { City } from '../cities/entities/city.entity';
import cityNames from './data/russian-cities.json';

// Ресурс: https://github.com/pensnarik/russian-cities/blob/master/russian-cities.json
export async function seedCities(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(City);
  const uniqueNames = [...new Set(cityNames.map((name) => name.trim()))].filter(
    Boolean,
  );

  await repository.upsert(
    uniqueNames.map((name) => ({ name })),
    {
      conflictPaths: ['name'],
      skipUpdateIfNoValuesChanged: true,
    },
  );

  console.log(`Cities processed: ${uniqueNames.length}`);
}
