import { UserGender, UserRole } from '../user.enums';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    about?: string;
    birthdate?: string;
    city?: string;
    gender?: UserGender;
    avatar?: string;
    wantToLearn?: string[];
    favoriteSkills?: string[];
    role?: UserRole;
}
