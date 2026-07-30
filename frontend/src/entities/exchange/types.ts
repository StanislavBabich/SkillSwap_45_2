import type { EntityId, ISODateString } from '@/entities/base.ts';

export type SkillExchangeStatus = 'active' | 'completed' | 'cancelled';

export interface SkillExchange {
  id: EntityId;
  requestId: EntityId;
  firstUserId: EntityId;
  firstSkillId: EntityId;
  secondUserId: EntityId;
  secondSkillId: EntityId;
  status: SkillExchangeStatus;
  agreedAt: ISODateString;
}

export type SkillExchangesResponse = SkillExchange[];

export interface CreateSkillExchangeDto {
  requestId: EntityId;
  firstUserId: EntityId;
  firstSkillId: EntityId;
  secondUserId: EntityId;
  secondSkillId: EntityId;
  status?: SkillExchangeStatus;
}

export type UpdateSkillExchangeDto = Partial<Omit<SkillExchange, 'id'>>;
