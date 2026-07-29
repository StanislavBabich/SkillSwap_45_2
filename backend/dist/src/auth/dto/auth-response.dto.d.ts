import { User } from '../../users/entities/user.entity';
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'password' | 'refreshToken'>;
}
