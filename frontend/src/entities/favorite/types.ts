import type { EntityId } from '@/entities/base.ts';

export interface AddFavoriteUserDto {
  ownerUserId: EntityId;
  targetUserId: EntityId;
}

export interface RemoveFavoriteUserDto {
  ownerUserId: EntityId;
  targetUserId: EntityId;
}

export interface SetFavoriteUsersDto {
  ownerUserId: EntityId;
  targetUserIds: EntityId[];
}
