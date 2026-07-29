import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { type TJwtConfig } from '../config/jwt.config';
import { type TAppConfig } from '../config/app.config';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly jwtConf;
    private readonly appConf;
    private readonly userRepository;
    constructor(usersService: UsersService, jwtService: JwtService, jwtConf: TJwtConfig, appConf: TAppConfig, userRepository: Repository<User>);
    registerUser(dto: RegisterDto): Promise<{
        user: User;
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    refresh(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<LogoutResponseDto>;
    private generateTokens;
}
