import { UserPreviewDto } from '../../users/dto/user-preview.dto';
declare class SkillCategoryDto {
    id: string;
    name: string;
}
export declare class SkillResponseDto {
    id: string;
    title: string;
    description?: string | null;
    images?: string[] | null;
    category?: SkillCategoryDto | null;
    owner: UserPreviewDto;
    createdAt: Date;
    updatedAt: Date;
}
export {};
