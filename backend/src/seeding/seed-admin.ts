import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/user.enums';
import { getAdminData } from './data/seed-admin.data';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(User);
  const data = getAdminData();
  const password = await bcrypt.hash(
    data.password,
    Number(process.env.HASH_SALT) || 10,
  );
  const existing = await repository.findOneBy({ email: data.email });

  await repository.save(
    repository.create({
      ...existing,
      ...data,
      password,
      role: UserRole.ADMIN,
    }),
  );

  console.log(`Administrator: ${data.email}`);
}
