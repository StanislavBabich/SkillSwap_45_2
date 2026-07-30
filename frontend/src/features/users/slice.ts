import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsyncStatus, EntityId } from '@/entities/base.ts';
import usersApi from '@/entities/user/api';
import type { UpdateUserDto, User } from '@/entities/user/types';
import type { StoredAuthUser } from '@/features/auth/types';
import type { Gender } from '@/entities/base';
import { createUserWithSkill } from './thunks';
import { storage } from '@/shared/lib/storage';

export interface UsersState {
  items: User[];
  isLoading: boolean;
  status: AsyncStatus;
  error: string | null;
}

interface UpdateUserPayload {
  userId: EntityId;
  dto: UpdateUserDto;
}

const initialState: UsersState = {
  items: [],
  isLoading: false,
  status: 'idle',
  error: null,
};

// Конвертация StoredAuthUser → User
const convertStoredToUser = (stored: StoredAuthUser): User => ({
  id: stored.id,
  name: stored.name,
  email: stored.email,
  about: typeof stored.about === 'string' ? stored.about : '',
  cityId: typeof stored.cityId === 'number' ? stored.cityId : 0,
  dateOfBirth: typeof stored.dateOfBirth === 'string' ? stored.dateOfBirth : '',
  gender: (stored.gender as Gender) || 'other',
  registrationDate: typeof stored.registrationDate === 'string' 
    ? stored.registrationDate 
    : new Date().toISOString().split('T')[0],
  skillInterests: Array.isArray(stored.skillInterests) ? stored.skillInterests : [],
  passwordHash: stored.passwordHash,
  avatarSeed: typeof stored.avatarSeed === 'string' ? stored.avatarSeed : null,
});

// Конвертация User → StoredAuthUser
const convertUserToStored = (user: User): StoredAuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  passwordHash: user.passwordHash,
  avatar: null,  
  avatarSeed: user.avatarSeed,
  cityId: user.cityId,
  gender: user.gender,
  dateOfBirth: user.dateOfBirth,
  about: user.about,
  skillInterests: user.skillInterests,
  registrationDate: user.registrationDate,
});

export const initializeUsers = createAsyncThunk<User[], void>(
  'users/initialize',
  async () => {
    const savedUsers = storage.loadUsers(); // StoredAuthUser[]
    
    if (savedUsers.length > 0) {
      return savedUsers.map(convertStoredToUser); // → User[]
    }
    
    return usersApi.getUsers(); // User[]
  },
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
      storage.saveUsers(action.payload.map(convertUserToStored));
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.items.push(action.payload);
      storage.saveUsers(state.items.map(convertUserToStored));
    },
    updateUser: (state, action: PayloadAction<UpdateUserPayload>) => {
      const user = state.items.find((item) => item.id === action.payload.userId);
      if (!user) return;
      Object.assign(user, action.payload.dto);
      storage.saveUsers(state.items.map(convertUserToStored));
    },
    removeUser: (state, action: PayloadAction<EntityId>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      storage.saveUsers(state.items.map(convertUserToStored));
    },
    setUsersLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.status = action.payload ? 'loading' : state.status;
    },
    setUsersError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
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
        storage.saveUsers(action.payload.map(convertUserToStored));
      })
      .addCase(initializeUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.error.message ?? 'Ошибка при загрузке пользователей';
      })
      .addCase(createUserWithSkill.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createUserWithSkill.fulfilled, (state, action) => {
        state.items.push(action.payload.user);
        state.isLoading = false;
        state.status = 'succeeded';
        storage.saveUsers(state.items.map(convertUserToStored));
      })
      .addCase(createUserWithSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Ошибка регистрации';
      });
  },
  selectors: {
    selectAllUsers: (state) => state.items,
    selectUserById: (state, userId: EntityId) => state.items.find((user) => user.id === userId),
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
  setUsersLoading,
  setUsersError,
} = usersSlice.actions;

export const {
  selectAllUsers,
  selectUserById,
  selectUsersLoading,
  selectUsersStatus,
  selectUsersError,
} = usersSlice.selectors;

export const usersReducer = usersSlice.reducer;