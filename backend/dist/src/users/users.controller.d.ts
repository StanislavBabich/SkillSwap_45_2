import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    getMe(req: Request): Promise<import("./entities/user.entity").User>;
    updateMe(req: Request, dto: UpdateProfileDto): Promise<import("./entities/user.entity").User>;
    changePassword(req: Request, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: Record<string, unknown>): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<void>;
}
