import { Skill } from '../../skills/entities/skill.entity';
import { Category } from '../../categories/entities/category.entity';
import { Request } from '../../requests/entities/request.entity';
import { UserGender, UserRole } from '../user.enums';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    about?: string | null;
    birthdate?: string | null;
    city?: string | null;
    gender?: UserGender | null;
    avatar?: string | null;
    skills?: Skill[];
    wantToLearn: Category[];
    sentRequests: Request[];
    receivedRequests: Request[];
    favoriteSkills: Skill[];
    role: UserRole;
    refreshToken?: string | null;
}
