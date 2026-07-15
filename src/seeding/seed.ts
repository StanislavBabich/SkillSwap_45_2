import { SeedingDataSource } from './data-source';
import { seedCategories } from './seed-categories';
import { seedUsers } from './seed-users';

async function run(): Promise<void> {
  await SeedingDataSource.initialize();

  try {
    await seedUsers(SeedingDataSource);
    await seedCategories(SeedingDataSource);
    console.log('Все сиды успешно выполнены');
  } finally {
    await SeedingDataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Ошибка выполнения сидов', error);
  process.exitCode = 1;
});
