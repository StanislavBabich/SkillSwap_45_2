import type { EntityId, ISODateString } from '@/entities/base.ts';

export type SkillShareRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface SkillShareRequest {
  id: EntityId;
  fromUserId: EntityId;
  toUserId: EntityId;
  skillId: EntityId;
  status: SkillShareRequestStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type SkillShareRequestsResponse = SkillShareRequest[];

export interface CreateSkillShareRequestDto {
  fromUserId: EntityId;
  toUserId: EntityId;
  skillId: EntityId;
  status?: SkillShareRequestStatus;
}

export type UpdateSkillShareRequestDto = Partial<Omit<SkillShareRequest, 'id'>>;
