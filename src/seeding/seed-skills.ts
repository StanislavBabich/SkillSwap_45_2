import { DataSource } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Skill } from '../skills/entities/skill.entity';
import { User } from '../users/entities/user.entity';
import { SkillsData } from './data/seed-skills.data';

export async function seedSkills(dataSource: DataSource): Promise<void> {
  const skillRepository = dataSource.getRepository(Skill);
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);

  for (const data of SkillsData) {
    const owner = await userRepository.findOneByOrFail({
      email: data.ownerEmail,
    });
    const category = await categoryRepository.findOneByOrFail({
      name: data.categoryName,
    });
    const existing = await skillRepository.findOneBy({
      title: data.title,
      owner: { id: owner.id },
    });

    await skillRepository.save(
      skillRepository.create({
        ...existing,
        title: data.title,
        description: data.description,
        owner,
        category,
      }),
    );
  }

  console.log(`Навыки: обработано ${SkillsData.length}`);
}
