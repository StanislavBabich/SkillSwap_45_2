import { User } from '../../users/entities/user.entity';
import { Request } from '../../requests/entities/request.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class Skill {
    id: string;
    title: string;
    description?: string | null;
    images?: string[] | null;
    category: Category | null;
    owner: User;
    offeredInRequests: Request[];
    requestedInRequests: Request[];
    createdAt: Date;
    updatedAt: Date;
}
