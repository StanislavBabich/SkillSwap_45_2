import { AuthRequest } from '../auth/auth.types';
import { CreateSkillDto } from './dto/create-skill.dto';
import { GetSkillsDto } from './dto/get-skills.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    create(dto: CreateSkillDto, req: AuthRequest): Promise<import("./entities/skill.entity").Skill>;
    findAll(query: GetSkillsDto): Promise<import("./dto/skills-response.dto").SkillsResponseDto>;
    addToFavorites(skillId: string, req: AuthRequest): Promise<void>;
    removeFromFavorites(skillId: string, req: AuthRequest): Promise<void>;
    findOne(id: string): Promise<import("./entities/skill.entity").Skill>;
    findSimilarUsers(id: string): Promise<import("./dto/similar-users-response.dto").SimilarUserDto[]>;
    update(id: string, dto: UpdateSkillDto, req: AuthRequest): Promise<import("./entities/skill.entity").Skill>;
    remove(id: string, req: AuthRequest): Promise<void>;
}
