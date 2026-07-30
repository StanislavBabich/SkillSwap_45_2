import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/user.enums';
import { UsersData } from './data/seed-users.data';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(User);
  const hashSalt = Number(process.env.HASH_SALT) || 10;

  // Очищаем всех пользователей, кроме администратора
  await repository.delete({ role: UserRole.USER });

  for (const data of UsersData) {
    const password = await bcrypt.hash(data.password, hashSalt);
    await repository.save(
      repository.create({
        ...data,
        password,
        role: UserRole.USER,
      }),
    );
  }

  console.log(`Пользователи: обработано ${UsersData.length}`);
}