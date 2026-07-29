"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const category_entity_1 = require("../categories/entities/category.entity");
const typeorm_2 = require("typeorm");
const entity_not_found_exception_1 = require("../common/exceptions/entity-not-found.exception");
const user_entity_1 = require("../users/entities/user.entity");
const skill_entity_1 = require("./entities/skill.entity");
let SkillsService = class SkillsService {
    skillRepository;
    categoryRepository;
    userRepository;
    constructor(skillRepository, categoryRepository, userRepository) {
        this.skillRepository = skillRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }
    async create(dto, userId) {
        if (!userId) {
            throw new common_1.UnauthorizedException('Требуется авторизация');
        }
        const { categoryId, ...rest } = dto;
        const skill = this.skillRepository.create({
            ...rest,
            category: categoryId ? { id: categoryId } : undefined,
            owner: { id: userId },
        });
        return this.skillRepository.save(skill);
    }
    async findAll(query) {
        const { page = 1, limit = 20, search = '', category } = query;
        const qb = this.buildBaseQuery();
        this.applySearchFilter(qb, search);
        await this.applyCategoryFilter(qb, category);
        const skip = (page - 1) * limit;
        qb.skip(skip).take(limit).orderBy('skill.createdAt', 'DESC');
        const [data, total] = await qb.getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        if (page > totalPages && total > 0) {
            throw new common_1.NotFoundException(`Страница ${page} не найдена. Всего страниц: ${totalPages}`);
        }
        return { data, page, totalPages };
    }
    async update(id, dto, userId) {
        if (!userId) {
            throw new common_1.UnauthorizedException('Требуется авторизация');
        }
        const skill = await this.findOneWithOwner(id);
        if (skill.owner.id !== userId) {
            throw new common_1.ForbiddenException('Вы не можете редактировать чужой навык');
        }
        const { categoryId, ...rest } = dto;
        Object.assign(skill, rest);
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
    async findOne(id) {
        return this.skillRepository.findOneOrFail({
            where: { id },
            relations: { owner: true, category: true },
        });
    }
    async remove(id, userId) {
        if (!userId) {
            throw new common_1.UnauthorizedException('Требуется авторизация');
        }
        const skill = await this.findOneWithOwner(id);
        if (skill.owner.id !== userId) {
            throw new common_1.ForbiddenException('Вы не можете удалить чужой навык');
        }
        if (skill.images && Array.isArray(skill.images)) {
            for (const imageUrl of skill.images) {
                try {
                    const filePath = (0, path_1.join)(process.cwd(), 'public', imageUrl);
                    await (0, promises_1.unlink)(filePath);
                }
                catch (error) {
                    if (error.code !== 'ENOENT') {
                        throw error;
                    }
                }
            }
        }
        await this.skillRepository.delete(id);
    }
    async findSimilarUsers(skillId) {
        const skill = await this.skillRepository.findOne({
            where: { id: skillId },
            relations: { category: true, owner: true },
        });
        if (!skill) {
            throw new common_1.NotFoundException('Навык не найден');
        }
        if (!skill.category) {
            return [];
        }
        const skillsInCategory = await this.skillRepository.find({
            where: { category: { id: skill.category.id } },
            relations: { owner: true },
        });
        const userMap = new Map();
        for (const s of skillsInCategory) {
            if (s.owner.id === skill.owner.id)
                continue;
            const owner = s.owner;
            const existing = userMap.get(owner.id);
            if (existing) {
                existing.count++;
                existing.skills.push({
                    id: s.id,
                    title: s.title,
                    description: s.description,
                });
            }
            else {
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
    async findOneWithOwner(id) {
        const skill = await this.skillRepository.findOne({
            where: { id },
            relations: { owner: true },
        });
        if (!skill) {
            throw new common_1.NotFoundException('Навык не найден');
        }
        return skill;
    }
    buildBaseQuery() {
        return this.skillRepository
            .createQueryBuilder('skill')
            .leftJoinAndSelect('skill.category', 'category')
            .leftJoinAndSelect('skill.owner', 'owner')
            .leftJoin('category.parent', 'parentCategory');
    }
    applySearchFilter(qb, search) {
        if (search && search.trim() !== '') {
            qb.andWhere(`(
          LOWER(skill.title) LIKE LOWER(:search) OR
          LOWER(category.name) LIKE LOWER(:search) OR
          LOWER(parentCategory.name) LIKE LOWER(:search)
        )`, { search: `%${search.trim()}%` });
        }
    }
    async applyCategoryFilter(qb, categoryId) {
        if (!categoryId)
            return;
        const category = await this.categoryRepository.findOne({
            where: { id: categoryId },
            relations: { parent: true },
            select: {
                id: true,
                parent: { id: true },
            },
        });
        if (!category)
            return;
        if (category.parent === null) {
            const subcategories = await this.categoryRepository.find({
                where: { parent: { id: categoryId } },
                select: { id: true },
            });
            const subIds = subcategories.map((c) => c.id);
            if (subIds.length > 0) {
                qb.andWhere('skill.category_id IN (:...subIds)', { subIds });
            }
            else {
                qb.andWhere('1 = 0');
            }
        }
        else {
            qb.andWhere('skill.category_id = :categoryId', { categoryId });
        }
    }
    async addToFavorites(skillId, userId) {
        const skill = await this.skillRepository.findOne({
            where: { id: skillId },
        });
        if (!skill) {
            throw new entity_not_found_exception_1.EntityNotFoundException('Skill', skillId);
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: { favoriteSkills: true },
        });
        if (!user) {
            throw new entity_not_found_exception_1.EntityNotFoundException('User', userId);
        }
        const isAlreadyFavorite = user.favoriteSkills.some((favoriteSkill) => favoriteSkill.id === skillId);
        if (isAlreadyFavorite) {
            throw new common_1.ConflictException('Навык уже добавлен в избранное');
        }
        user.favoriteSkills.push(skill);
        await this.userRepository.save(user);
    }
    async removeFromFavorites(skillId, userId) {
        const skill = await this.skillRepository.findOne({
            where: { id: skillId },
        });
        if (!skill) {
            throw new entity_not_found_exception_1.EntityNotFoundException('Skill', skillId);
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: { favoriteSkills: true },
        });
        if (!user) {
            throw new entity_not_found_exception_1.EntityNotFoundException('User', userId);
        }
        const isFavorite = user.favoriteSkills.some((favoriteSkill) => favoriteSkill.id === skillId);
        if (!isFavorite) {
            throw new common_1.NotFoundException('Навык не найден в избранном');
        }
        user.favoriteSkills = user.favoriteSkills.filter((favoriteSkill) => favoriteSkill.id !== skillId);
        await this.userRepository.save(user);
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SkillsService);
//# sourceMappingURL=skills.service.js.map