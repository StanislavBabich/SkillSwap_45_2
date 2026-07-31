import type { EntityId, ISODateString } from '@/entities/base';

export type ExchangeRequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done';

export interface ExchangeRequest {
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
  status: ExchangeRequestStatus;
  isRead: boolean;
}

export type CreateExchangeRequestDto = {
  receiverId: EntityId;
  offeredSkillId: EntityId;
  requestedSkillId: EntityId;
};

export type UpdateExchangeRequestDto = Partial<Omit<ExchangeRequest, 'id'>>;