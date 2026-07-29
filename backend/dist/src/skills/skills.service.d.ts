import { Category } from "../categories/entities/category.entity";
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { GetSkillsDto } from './dto/get-skills.dto';
import { SimilarUserDto } from './dto/similar-users-response.dto';
import { SkillsResponseDto } from './dto/skills-response.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
export declare class SkillsService {
    private readonly skillRepository;
    private readonly categoryRepository;
    private readonly userRepository;
    constructor(skillRepository: Repository<Skill>, categoryRepository: Repository<Category>, userRepository: Repository<User>);
    create(dto: CreateSkillDto, userId: string): Promise<Skill>;
    findAll(query: GetSkillsDto): Promise<SkillsResponseDto>;
    update(id: string, dto: UpdateSkillDto, userId: string): Promise<Skill>;
    findOne(id: string): Promise<Skill>;
    remove(id: string, userId: string): Promise<void>;
    findSimilarUsers(skillId: string): Promise<SimilarUserDto[]>;
    private findOneWithOwner;
    private buildBaseQuery;
    private applySearchFilter;
    private applyCategoryFilter;
    addToFavorites(skillId: string, userId: string): Promise<void>;
    removeFromFavorites(skillId: string, userId: string): Promise<void>;
}
