import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsyncStatus, EntityId } from '@/entities/base.ts';
import skillsApi from '@/entities/skill/api';
import type { Skill } from '@/entities/skill/types';

export interface SkillsState {
  items: Skill[];
  isLoading: boolean;
  status: AsyncStatus;
  error: string | null;
}

const initialState: SkillsState = {
  items: [],
  isLoading: false,
  status: 'idle',
  error: null,
};

export const initializeSkills = createAsyncThunk<Skill[], void>(
  'skills/initialize',
  async () => {
    const response = await skillsApi.getAll();
    return response.data; // SkillsListResponse → берём data
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as { skills: SkillsState }).skills;
      if (state.isLoading) return false;
      return state.status !== 'succeeded';
    },
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.items = action.payload;
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.items.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<{ skillId: EntityId; dto: Partial<Skill> }>) => {
      const skill = state.items.find((item) => item.id === action.payload.skillId);
      if (!skill) return;
      Object.assign(skill, action.payload.dto);
    },
    removeSkill: (state, action: PayloadAction<EntityId>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setSkillsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.status = action.payload ? 'loading' : state.status;
    },
    setSkillsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeSkills.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initializeSkills.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
        state.status = 'succeeded';
      })
      .addCase(initializeSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.error.message ?? 'Ошибка при загрузке навыков';
      });
  },
  selectors: {
    selectAllSkills: (state) => state.items,
    selectSkillById: (state, skillId: EntityId) => state.items.find((skill) => skill.id === skillId),
    selectSkillsByOwnerId: (state, ownerId: EntityId) =>
      state.items.filter((skill) => skill.owner.id === ownerId),
    selectSkillsLoading: (state) => state.isLoading,
    selectSkillsStatus: (state) => state.status,
    selectSkillsError: (state) => state.error,
  },
});

export const {
  setSkills,
  addSkill,
  updateSkill,
  removeSkill,
  setSkillsLoading,
  setSkillsError,
} = skillsSlice.actions;

export const {
  selectAllSkills,
  selectSkillById,
  selectSkillsByOwnerId,
  selectSkillsLoading,
  selectSkillsStatus,
  selectSkillsError,
} = skillsSlice.selectors;

export const skillsReducer = skillsSlice.reducer;