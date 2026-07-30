import type { EntityId, ISODateString } from '@/entities/base';

export type ExchangeRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface ExchangeRequest {
  id: EntityId;
  fromUserId: EntityId;
  toUserId: EntityId;
  skillId: EntityId;
  status: ExchangeRequestStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type CreateExchangeRequestDto = {
  fromUserId: EntityId;
  toUserId: EntityId;
  skillId: EntityId;
  status?: ExchangeRequestStatus;
};

export type UpdateExchangeRequestDto = Partial<Omit<ExchangeRequest, 'id'>>;
