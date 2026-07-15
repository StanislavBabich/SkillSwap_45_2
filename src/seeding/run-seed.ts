import { SeedingDataSource } from './data-source';
import { seedCategories } from './seed-categories';
import { seedUsers } from './seed-users';

const seeds = {
  users: seedUsers,
  categories: seedCategories,
};

async function run(): Promise<void> {
  const seedName = process.argv[2] as keyof typeof seeds;
  const seed = seeds[seedName];
  if (!seed) {
    throw new Error(`Неизвестный сид: ${process.argv[2] ?? ''}`);
  }

  await SeedingDataSource.initialize();
  try {
    await seed(SeedingDataSource);
  } finally {
    await SeedingDataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Ошибка выполнения сида', error);
  process.exitCode = 1;
});
