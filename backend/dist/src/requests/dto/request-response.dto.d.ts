import { RequestStatus } from '../request-status.enums';
import { UserPreviewDto } from '../../users/dto/user-preview.dto';
import { SkillPreviewDto } from '../../skills/dto/skill-preview.dto';
export declare class RequestResponseDto {
    id: string;
    createdAt: Date;
    status: RequestStatus;
    isRead: boolean;
    sender: UserPreviewDto;
    receiver: UserPreviewDto;
    offeredSkill: SkillPreviewDto;
    requestedSkill: SkillPreviewDto;
}
