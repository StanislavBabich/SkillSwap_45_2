import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { Category } from '../categories/entities/category.entity';
import { GetSkillsDto } from './dto/get-skills.dto';
import { SkillsResponseDto } from './dto/skills-response.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(query: GetSkillsDto): Promise<SkillsResponseDto>{
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

  private applySearchFilter(qb: SelectQueryBuilder<Skill>, search: string): void {
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
      select: ['id', 'parent_id'],
    });

    if (!category) return;

    if (category.parent_id === null) {
      // Если родительская категория то ищем по подкатегориям подходящие скилы
      const subcategories = await this.categoryRepository.find({
        where: { parent_id: categoryId },
        select: ['id'],
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

}
