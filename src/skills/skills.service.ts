import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { GetSkillsDto } from './dto/get-skills.dto';
import { SkillsResponseDto } from './dto/skills-response.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // ===================== CRUD =====================

  async create(dto: CreateSkillDto, userId: string): Promise<Skill> {
    if (!userId) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    const { categoryId, ...rest } = dto;
    const skill = this.skillRepository.create({
      ...rest,
      category: categoryId ? { id: categoryId } : undefined,
      owner: { id: userId },
    });

    return this.skillRepository.save(skill);
  }

  async findAll(query: GetSkillsDto): Promise<SkillsResponseDto> {
    const { page = 1, limit = 20, search = '', category } = query;

    const qb = this.buildBaseQuery();
    this.applySearchFilter(qb, search);
    await this.applyCategoryFilter(qb, category);

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit).orderBy('skill.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      throw new NotFoundException(
        `Страница ${page} не найдена. Всего страниц: ${totalPages}`,
      );
    }

    return { data, page, totalPages };
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne({
      where: { id },
      relations: { owner: true, category: true },
    });

    if (!skill) {
      throw new NotFoundException('Навык не найден');
    }

    return skill;
  }

  async update(
    id: string,
    dto: UpdateSkillDto,
    userId: string,
  ): Promise<Skill> {
    if (!userId) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    const skill = await this.findOneWithOwner(id);
    if (skill.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете редактировать чужой навык');
    }

    const { categoryId, ...rest } = dto;

    // Применяем простые поля
    Object.assign(skill, rest);

    // Если передан categoryId, подгружаем категорию и устанавливаем связь
    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (category) {
        skill.category = category;
      }
    }

    await this.skillRepository.save(skill);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    if (!userId) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    const skill = await this.findOneWithOwner(id);
    if (skill.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалить чужой навык');
    }

    // TODO: удалить файлы изображений из public/uploads, когда появится загрузка
    await this.skillRepository.delete(id);
  }

  private async findOneWithOwner(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!skill) {
      throw new NotFoundException('Навык не найден');
    }

    return skill;
  }

  // ================= ПРИВАТНЫЕ МЕТОДЫ ДЛЯ ПОСТРОЕНИЯ ЗАПРОСА =================

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
      // Родительская категория → ищем по всем подкатегориям
      const subcategories = await this.categoryRepository.find({
        where: { parent: { id: categoryId } },
        select: { id: true },
      });

      const subIds = subcategories.map((c) => c.id);

      if (subIds.length > 0) {
        qb.andWhere('skill.category_id IN (:...subIds)', { subIds });
      } else {
        qb.andWhere('1 = 0'); // если подкатегорий нет — возвращаем пустой результат
      }
    } else {
      // Подкатегория → ищем только в ней
      qb.andWhere('skill.category_id = :categoryId', { categoryId });
    }
  }
}
