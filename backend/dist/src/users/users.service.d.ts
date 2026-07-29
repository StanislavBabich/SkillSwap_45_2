import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { type TAppConfig } from '../config/app.config';
export declare class UsersService {
    private readonly userRepository;
    private readonly skillRepository;
    private readonly appConf;
    constructor(userRepository: Repository<User>, skillRepository: Repository<Skill>, appConf: TAppConfig);
    private findUserById;
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    updateProfile(id: string, dto: UpdateProfileDto): Promise<User>;
    changePassword(id: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    update(id: string, updateUserDto: Record<string, unknown>): Promise<User>;
    remove(id: string): Promise<void>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    removeRefreshToken(userId: string): Promise<void>;
    addFavoriteSkill(userId: string, skillId: string): Promise<User>;
}
