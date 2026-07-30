import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { UserRole } from '../users/user.enums';
import { UsersData } from './data/seed-users.data';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  const hashSalt = Number(process.env.HASH_SALT) || 10;

  // Очищаем всех пользователей, кроме администратора
  await userRepository.delete({ role: UserRole.USER });

  for (const data of UsersData) {
    const { wantToLearnCategories, ...userFields } = data;
    const password = await bcrypt.hash(userFields.password, hashSalt);

    // Находим категории по названиям
    let wantToLearn: Category[] = [];
    if (wantToLearnCategories && wantToLearnCategories.length > 0) {
      const categories = await Promise.all(
        wantToLearnCategories.map((name) =>
          categoryRepository.findOneBy({ name }),
        ),
      );
      wantToLearn = categories.filter(Boolean) as Category[];
    }

    await userRepository.save(
      userRepository.create({
        ...userFields,
        password,
        role: UserRole.USER,
        wantToLearn,
      }),
    );
  }

  console.log(`Пользователи: обработано ${UsersData.length}`);
}