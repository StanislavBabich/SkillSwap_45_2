import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: import("../users/entities/user.entity").User;
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(req: Request & {
        user: {
            id: string;
        };
    }, refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: Request & {
        user: {
            id: string;
        };
    }): Promise<LogoutResponseDto>;
}
