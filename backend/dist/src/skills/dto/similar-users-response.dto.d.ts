import { UserGender } from '../../users/user.enums';
declare class SimilarUserSkillDto {
    id: string;
    title: string;
    description?: string | null;
}
export declare class SimilarUserDto {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    city?: string | null;
    birthdate?: string | null;
    about?: string | null;
    gender?: UserGender | null;
    commonSkillsCount: number;
    skills: SimilarUserSkillDto[];
}
export {};
