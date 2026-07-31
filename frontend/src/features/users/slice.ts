import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsyncStatus, EntityId } from '@/entities/base.ts';
import usersApi from '@/entities/user/api';
import type { UpdateUserDto, User } from '@/entities/user/types';

export interface UsersState {
  items: User[];
  currentUserId: EntityId | null;
  isLoading: boolean;
  status: AsyncStatus;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  currentUserId: null,
  isLoading: false,
  status: 'idle',
  error: null,
};

export const initializeUsers = createAsyncThunk<User[], void>(
  'users/initialize',
  async () => usersApi.getAll(),
  {
    condition: (_, { getState }) => {
      const state = (getState() as { users: UsersState }).users;
      if (state.isLoading) return false;
      return state.status !== 'succeeded';
    },
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
  setUsers: (state, action: PayloadAction<User[]>) => {
    state.items = action.payload;
  },
  addUser: (state, action: PayloadAction<User>) => {
    state.items.push(action.payload);
  },
  updateUser: (state, action: PayloadAction<{ userId: EntityId; dto: Partial<User> }>) => {
    const user = state.items.find((item) => item.id === action.payload.userId);
    if (!user) return;
    Object.assign(user, action.payload.dto);
  },
  removeUser: (state, action: PayloadAction<EntityId>) => {
    state.items = state.items.filter((item) => item.id !== action.payload);
  },
  setCurrentUserId: (state, action: PayloadAction<EntityId | null>) => {
    state.currentUserId = action.payload;
  },
  setUsersLoading: (state, action: PayloadAction<boolean>) => {
    state.isLoading = action.payload;
    state.status = action.payload ? 'loading' : state.status;
  },
  setUsersError: (state, action: PayloadAction<string | null>) => {
    state.error = action.payload;
  },
  resetUsersStatus: (state) => {
    state.status = 'idle';
    state.isLoading = false;
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(initializeUsers.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initializeUsers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
        state.status = 'succeeded';
      })
      .addCase(initializeUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.error.message ?? 'Ошибка при загрузке пользователей';
      });
  },
  selectors: {
    selectAllUsers: (state) => state.items,
    selectUserById: (state, userId: EntityId) => state.items.find((user) => user.id === userId),
    selectCurrentUserId: (state) => state.currentUserId,
    selectUsersLoading: (state) => state.isLoading,
    selectUsersStatus: (state) => state.status,
    selectUsersError: (state) => state.error,
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setCurrentUserId,
  setUsersLoading,
  setUsersError,
  resetUsersStatus,
} = usersSlice.actions;

export const {
  selectAllUsers,
  selectUserById,
  selectCurrentUserId,
  selectUsersLoading,
  selectUsersStatus,
  selectUsersError,
} = usersSlice.selectors;

export const usersReducer = usersSlice.reducer;