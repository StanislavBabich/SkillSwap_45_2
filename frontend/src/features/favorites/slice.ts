import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EntityId } from '@/entities/base.ts';
import type { Skill } from '@/entities/skill/types';
import skillsApi from '@/entities/skill/api';
import usersApi from '@/entities/user/api';
import { storage } from '@/shared/lib/storage';
import type {
  AddFavoriteUserDto,
  RemoveFavoriteUserDto,
  SetFavoriteUsersDto,
} from '@/entities/favorite/types';

export interface FavoritesState {
  byOwnerId: Record<EntityId, EntityId[]>;
  skillIds?: EntityId[];
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const initialState: FavoritesState = {
  byOwnerId: {},
  skillIds: [],
  status: 'idle',
  error: null,
};

export const initializeFavoriteSkills = createAsyncThunk<Skill[]>(
  'favorites/initializeSkills',
  async () => {
    const token = storage.getToken();
    if (!token) return [];
    const user = await usersApi.getMe(token);
    return user.favoriteSkills ?? [];
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as { favorites: FavoritesState }).favorites;
      return state.status !== 'loading';
    },
  }
);

export const toggleFavoriteSkill = createAsyncThunk<
  { skillId: EntityId; isFavorite: boolean },
  { skillId: EntityId; isFavorite: boolean }
>('favorites/toggleSkill', async ({ skillId, isFavorite }) => {
  const token = storage.getToken();
  if (!token) throw new Error('Authorization required');

  if (isFavorite) {
    await skillsApi.removeFromFavorites(skillId, token);
  } else {
    await skillsApi.addToFavorites(skillId, token);
  }

  return { skillId, isFavorite: !isFavorite };
});

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
      state.skillIds = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeFavoriteSkills.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initializeFavoriteSkills.fulfilled, (state, action) => {
        state.skillIds = action.payload.map((skill) => skill.id);
        state.status = 'succeeded';
      })
      .addCase(initializeFavoriteSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load favorites';
      })
      .addCase(toggleFavoriteSkill.fulfilled, (state, action) => {
        const ids = state.skillIds ?? [];
        state.skillIds = action.payload.isFavorite
          ? Array.from(new Set([...ids, action.payload.skillId]))
          : ids.filter((id) => id !== action.payload.skillId);
      });
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

export const selectFavoriteSkillIds = (state: { favorites: FavoritesState }): EntityId[] =>
  state.favorites.skillIds ?? [];

export const selectFavoriteSkillsStatus = (state: { favorites: FavoritesState }) =>
  state.favorites.status ?? 'idle';
