import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
import { Category } from 'src/categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SimilarUserDto } from './dto/similar-users-response.dto';
import { Category } from '../categories/entities/category.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UserGender } from '../users/user.enums';

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

  // async findOne(id: string): Promise<Skill> {
  //   const skill = await this.skillRepository.findOne({
  //     where: { id },
  //     relations: { owner: true, category: true },
  //   });

  //   if (!skill) {
  //     throw new NotFoundException('Навык не найден');
  //   }

  //   return skill;
  // }

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

    // Удаляем файлы изображений из public/uploads
    if (skill.images && Array.isArray(skill.images)) {
      for (const imageUrl of skill.images) {
        try {
          const filePath = join(process.cwd(), 'public', imageUrl);
          await unlink(filePath);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
          }
        }
      }
    }

    await this.skillRepository.delete(id);
  }

  async findSimilarUsers(skillId: string): Promise<SimilarUserDto[]> {
    const skill = await this.skillRepository.findOne({
      where: { id: skillId },
      relations: { category: true, owner: true },
    });

    if (!skill) {
      throw new NotFoundException('Навык не найден');
    }

    if (!skill.category) {
      return [];
    }

    const skillsInCategory = await this.skillRepository.find({
      where: { category: { id: skill.category.id } },
      relations: { owner: true },
    });

    const userMap = new Map<
      string,
      {
        user: {
          id: string;
          name: string;
          email: string;
          avatar?: string | null;
          city?: string | null;
          birthdate?: string | null;
          about?: string | null;
          gender?: UserGender | null;
        };
        count: number;
        skills: Array<{ id: string; title: string; description?: string | null }>;
      }
    >();

    for (const s of skillsInCategory) {
      if (s.owner.id === skill.owner.id) continue;

      const owner = s.owner;
      const existing = userMap.get(owner.id);

      if (existing) {
        existing.count++;
        existing.skills.push({
          id: s.id,
          title: s.title,
          description: s.description,
        });
      } else {
        userMap.set(owner.id, {
          user: {
            id: owner.id,
            name: owner.name,
            email: owner.email,
            avatar: owner.avatar,
            city: owner.city,
            birthdate: owner.birthdate,
            about: owner.about,
            gender: owner.gender,
          },
          count: 1,
          skills: [
            {
              id: s.id,
              title: s.title,
              description: s.description,
            },
          ],
        });
      }
    }

    const sorted = Array.from(userMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return sorted.map((item) => ({
      ...item.user,
      commonSkillsCount: item.count,
      skills: item.skills,
    }));
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

  async addToFavorites(skillId: string, userId: string): Promise<void> {
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

    const isAlreadyFavorite = user.favoriteSkills.some(
      (favoriteSkill) => favoriteSkill.id === skillId,
    );

    if (isAlreadyFavorite) {
      throw new ConflictException('Навык уже добавлен в избранное');
    }

    user.favoriteSkills.push(skill);
    await this.userRepository.save(user);
  }
}
