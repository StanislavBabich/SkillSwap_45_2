import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EntityId } from '@/entities/base.ts';
import type {
  AddFavoriteUserDto,
  RemoveFavoriteUserDto,
  SetFavoriteUsersDto,
} from '@/entities/favorite/types';

export interface FavoritesState {
  byOwnerId: Record<EntityId, EntityId[]>;
}

const initialState: FavoritesState = {
  byOwnerId: {},
};

const getFavoriteUserIds = (state: FavoritesState, ownerUserId: EntityId): EntityId[] =>
  state.byOwnerId[ownerUserId] ?? [];

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavoriteUser: (state, action: PayloadAction<AddFavoriteUserDto>) => {
      const { ownerUserId, targetUserId } = action.payload;
      const userIds = getFavoriteUserIds(state, ownerUserId);

      if (userIds.includes(targetUserId)) {
        return;
      }

      state.byOwnerId[ownerUserId] = [...userIds, targetUserId];
    },
    removeFavoriteUser: (state, action: PayloadAction<RemoveFavoriteUserDto>) => {
      const { ownerUserId, targetUserId } = action.payload;
      const userIds = getFavoriteUserIds(state, ownerUserId);

      state.byOwnerId[ownerUserId] = userIds.filter((userId) => userId !== targetUserId);
    },
    toggleFavoriteUser: (state, action: PayloadAction<AddFavoriteUserDto>) => {
      const { ownerUserId, targetUserId } = action.payload;
      const userIds = getFavoriteUserIds(state, ownerUserId);
      const isAlreadyFavorite = userIds.includes(targetUserId);

      state.byOwnerId[ownerUserId] = isAlreadyFavorite
        ? userIds.filter((userId) => userId !== targetUserId)
        : [...userIds, targetUserId];
    },
    setFavoriteUsers: (state, action: PayloadAction<SetFavoriteUsersDto>) => {
      const { ownerUserId, targetUserIds } = action.payload;
      state.byOwnerId[ownerUserId] = Array.from(new Set(targetUserIds));
    },
    clearFavoriteUsers: (state, action: PayloadAction<EntityId>) => {
      delete state.byOwnerId[action.payload];
    },
    clearAllFavorites: (state) => {
      state.byOwnerId = {};
    }
  },
  selectors: {
    selectFavoritesByOwnerMap: (state) => state.byOwnerId,
    selectFavoriteUserIdsByOwner: (state, ownerUserId: EntityId): EntityId[] =>
      state.byOwnerId[ownerUserId] ?? [],
    selectIsUserFavorite: (state, ownerUserId: EntityId, targetUserId: EntityId): boolean =>
      (state.byOwnerId[ownerUserId] ?? []).includes(targetUserId),
  },
});

export const {
  addFavoriteUser,
  removeFavoriteUser,
  toggleFavoriteUser,
  setFavoriteUsers,
  clearFavoriteUsers,
  clearAllFavorites,
} = favoritesSlice.actions;

export const {
  selectFavoritesByOwnerMap,
  selectFavoriteUserIdsByOwner: selectFavoriteUserIdsByOwnerState,
  selectIsUserFavorite: selectIsUserFavoriteState,
} = favoritesSlice.selectors;

export const favoritesReducer = favoritesSlice.reducer;
export default favoritesSlice.reducer;

export const selectFavoriteUserIdsByOwner = (
  state: { favorites: FavoritesState },
  ownerUserId: EntityId
): EntityId[] => selectFavoriteUserIdsByOwnerState(state, ownerUserId);

export const selectIsUserFavorite = (
  state: { favorites: FavoritesState },
  ownerUserId: EntityId,
  targetUserId: EntityId
): boolean => selectIsUserFavoriteState(state, ownerUserId, targetUserId);
