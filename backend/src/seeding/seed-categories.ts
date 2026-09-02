import { DataSource, IsNull } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { CategoriesData } from './data/seed-categories.data';

export async function seedCategories(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(Category);

  for (const data of CategoriesData) {
    let parent = await repository.findOneBy({
      name: data.name,
      parent: IsNull(),
    });
    if (!parent) {
      parent = await repository.save(
        repository.create({ name: data.name, parent: null }),
      );
    }

    for (const childName of data.children ?? []) {
      const child = await repository.findOneBy({
        name: childName,
        parent: { id: parent.id },
      });
      if (!child) {
        await repository.save(repository.create({ name: childName, parent }));
      }
    }
  }

  const total = CategoriesData.reduce(
    (count, category) => count + 1 + (category.children?.length ?? 0),
    0,
  );
  console.log(`Categories processed: ${total}`);
}
