import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { GetSkillsDto } from './dto/get-skills.dto';
import { SkillsResponseDto } from './dto/skills-response.dto';
import { Category } from 'src/categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create() {
    return 'This action adds a new skill';
  }

  async findAll(query: GetSkillsDto): Promise<SkillsResponseDto> {
    const { page = 1, limit = 20, search = '', category } = query;

    const qb = this.buildBaseQuery();
    // поиск
    this.applySearchFilter(qb, search);

    // Применяем фильтр по категории
    await this.applyCategoryFilter(qb, category);

    // Применяем пагинацию
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit).orderBy('skill.createdAt', 'DESC');

    // Выполняем запрос финальный
    const [data, total] = await qb.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      throw new NotFoundException(
        `Страница ${page} не найдена. Всего страниц: ${totalPages}`,
      );
    }

    return {
      data,
      page,
      totalPages,
    };
  }

  // ПРИВАТНЫЕ МЕТОДЫ ДЛЯ ПОСТРОЕНИЯ ЗАПРОСА

  private buildBaseQuery(): SelectQueryBuilder<Skill> {
    return this.skillRepository
      .createQueryBuilder('skill')
      .leftJoinAndSelect('skill.category', 'category')
      .leftJoinAndSelect('skill.owner', 'owner')
      .leftJoin('category.parent', 'parentCategory');
  }

  private applySearchFilter(
    qb: SelectQueryBuilder<Skill>,
    search: string,
  ): void {
    if (search && search.trim() !== '') {
      qb.andWhere(
        `(
          LOWER(skill.title) LIKE LOWER(:search) OR
          LOWER(category.name) LIKE LOWER(:search) OR
          LOWER(parentCategory.name) LIKE LOWER(:search)
        )`,
        { search: `%${search.trim()}%` },
      );
    }
  }

  private async applyCategoryFilter(
    qb: SelectQueryBuilder<Skill>,
    categoryId: string | undefined,
  ): Promise<void> {
    if (!categoryId) return;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: { parent: true },
      select: {
        id: true,
        parent: { id: true },
      },
    });

    if (!category) return;

    if (category.parent === null) {
      // Если родительская категория то ищем по подкатегориям подходящие скилы
      const subcategories = await this.categoryRepository.find({
        where: { parent: { id: categoryId } },
        select: { id: true },
      });

      const subIds = subcategories.map((c) => c.id);

      if (subIds.length > 0) {
        qb.andWhere('skill.category_id IN (:...subIds)', { subIds });
      } else {
        qb.andWhere('1 = 0'); // если нет подкатегорий то пустой массив в ответ
      }
    } else {
      // Подкатегория → ищем только в ней
      qb.andWhere('skill.category_id = :categoryId', { categoryId });
    }
  }

  async removeFromFavorites(skillId: string, userId: string): Promise<void> {
    const skill = await this.skillRepository.findOne({
      where: { id: skillId },
    });

    if (!skill) {
      throw new EntityNotFoundException('Skill', skillId);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favoriteSkills: true },
    });

    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    const isFavorite = user.favoriteSkills.some(
      (favoriteSkill) => favoriteSkill.id === skillId,
    );

    if (!isFavorite) {
      throw new NotFoundException('Навык не найден в избранном');
    }

    user.favoriteSkills = user.favoriteSkills.filter(
      (favoriteSkill) => favoriteSkill.id !== skillId,
    );
    await this.userRepository.save(user);
  }

  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
