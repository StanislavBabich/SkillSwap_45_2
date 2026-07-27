import { execSync } from 'child_process';

export default async function globalSetup(): Promise<void> {
  console.log('\n🔄 Подготовка тестовой БД...\n');

  try {
    execSync('npm run seed:categories', { stdio: 'inherit' });
    execSync('npm run seed:admin', { stdio: 'inherit' });
    console.log('\n✅ Подготовка тестовой БД завершена.\n');
  } catch (error) {
    console.error('❌ Ошибка при подготовке тестовой БД:', error);
    throw error;
  }
}