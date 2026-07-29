import { User } from '../../users/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { RequestStatus } from '../request-status.enums';
export declare class Request {
    id: string;
    createdAt: Date;
    sender: User;
    receiver: User;
    status: RequestStatus;
    offeredSkill: Skill;
    requestedSkill: Skill;
    isRead: boolean;
}
