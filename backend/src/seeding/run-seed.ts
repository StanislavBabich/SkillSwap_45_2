import { SeedingDataSource } from './data-source';
import { seedAdmin } from './seed-admin';
import { seedCategories } from './seed-categories';
import { seedCities } from './seed-cities';
import { seedSkills } from './seed-skills';
import { seedUsers } from './seed-users';

const seeds = {
  users: seedUsers,
  categories: seedCategories,
  skills: seedSkills,
  admin: seedAdmin,
  cities: seedCities,
};

async function run(): Promise<void> {
  const seedName = process.argv[2] as keyof typeof seeds;
  const seed = seeds[seedName];
  if (!seed) {
    throw new Error(`Unknown seed: ${process.argv[2] ?? ''}`);
  }

  await SeedingDataSource.initialize();
  try {
    await seed(SeedingDataSource);
  } finally {
    await SeedingDataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Seed execution error', error);
  process.exitCode = 1;
});
