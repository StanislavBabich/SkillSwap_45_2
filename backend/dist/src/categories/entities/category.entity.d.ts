import { Skill } from '../../skills/entities/skill.entity';
export declare class Category {
    id: string;
    name: string;
    parent?: Category | null;
    children?: Category[];
    skills?: Skill[];
    createdAt: Date;
    updatedAt: Date;
}
