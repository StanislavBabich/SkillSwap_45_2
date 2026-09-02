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
    console.log('All seeds completed successfully');
  } finally {
    await SeedingDataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Seed execution error', error);
  process.exitCode = 1;
});
