import type { EntityId, ISODateString } from '@/entities/base.ts';

export type SkillShareRequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done';

export interface SkillShareRequest {
  id: EntityId;
  createdAt: ISODateString;
  sender: {
    id: EntityId;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  };
  receiver: {
    id: EntityId;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  };
  offeredSkill: {
    id: EntityId;
    title: string;
    description: string;
  };
  requestedSkill: {
    id: EntityId;
    title: string;
    description: string;
  };
  status: SkillShareRequestStatus;
  isRead: boolean;
}

export type SkillShareRequestsResponse = SkillShareRequest[];

export interface CreateSkillShareRequestDto {
  receiverId: EntityId;
  offeredSkillId: EntityId;
  requestedSkillId: EntityId;
}