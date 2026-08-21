import { SeedingDataSource } from './data-source';
import { seedAdmin } from './seed-admin';
import { seedCategories } from './seed-categories';
import { seedCities } from './seed-cities';
import { seedSkills } from './seed-skills';
import { seedUsers } from './seed-users';

async function run(): Promise<void> {
  await SeedingDataSource.initialize();

  try {
    await seedCities(SeedingDataSource);
    await seedUsers(SeedingDataSource);
    await seedCategories(SeedingDataSource);
    await seedSkills(SeedingDataSource);
    await seedAdmin(SeedingDataSource);
    console.log('Все сиды успешно выполнены');
  } finally {
    await SeedingDataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Ошибка выполнения сидов', error);
  process.exitCode = 1;
});
