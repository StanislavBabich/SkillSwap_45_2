import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsyncStatus, EntityId } from '@/entities/base.ts';
import skillsApi from '@/entities/skill/api';
import type { CreateSkillDto, Skill, UpdateSkillDto } from '@/entities/skill/types';
import { createUserWithSkill } from '@/features/users/thunks';
import { storage } from '@/shared/lib/storage'; 

export interface SkillsState {
  items: Skill[];
  isLoading: boolean;
  status: AsyncStatus;
  error: string | null;
}

interface UpdateSkillPayload {
  skillId: EntityId;
  dto: UpdateSkillDto;
}

interface ToggleSkillLikePayload {
  skillId: EntityId;
  userId: EntityId;
}

const initialState: SkillsState = {
  items: [],
  isLoading: false,
  status: 'idle',
  error: null,
};

const getNextId = (items: { id: EntityId }[]): EntityId =>
  items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

export const initializeSkills = createAsyncThunk<Skill[], void>(
  'skills/initialize',
  async () => {
    const savedSkills = storage.loadSkills(); 
    if (savedSkills.length > 0) {
      return savedSkills;
    }
    return skillsApi.getSkills();
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
      storage.saveSkills(action.payload); 
    },
    createSkill: (state, action: PayloadAction<CreateSkillDto>) => {
      const newSkill = {
        id: getNextId(state.items),
        ...action.payload,
      };
      state.items.push(newSkill);
      storage.saveSkills(state.items); 
    },
    updateSkill: (state, action: PayloadAction<UpdateSkillPayload>) => {
      const skill = state.items.find((item) => item.id === action.payload.skillId);
      if (!skill) return;
      Object.assign(skill, action.payload.dto);
      storage.saveSkills(state.items); 
    },
    removeSkill: (state, action: PayloadAction<EntityId>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      storage.saveSkills(state.items); 
    },
    toggleSkillLike: (state, action: PayloadAction<ToggleSkillLikePayload>) => {
      const skill = state.items.find((item) => item.id === action.payload.skillId);
      if (!skill) return;

      const alreadyLiked = skill.likes.includes(action.payload.userId);
      if (alreadyLiked) {
        skill.likes = skill.likes.filter((userId) => userId !== action.payload.userId);
      } else {
        skill.likes.push(action.payload.userId);
      }
      storage.saveSkills(state.items); 
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
        storage.saveSkills(action.payload); 
      })
      .addCase(initializeSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load skills';
      })
      .addCase(createUserWithSkill.fulfilled, (state, action) => {
        state.items.push(action.payload.skill);
        storage.saveSkills(state.items); 
      });
  },
  selectors: {
    selectAllSkills: (state) => state.items,
    selectSkillById: (state, skillId: EntityId) => state.items.find((skill) => skill.id === skillId),
    selectSkillsByUserId: (state, userId: EntityId) => state.items.filter((skill) => skill.userId === userId),
    selectSkillsLoading: (state) => state.isLoading,
    selectSkillsStatus: (state) => state.status,
    selectSkillsError: (state) => state.error,
  },
});

export const {
  setSkills,
  createSkill,
  updateSkill,
  removeSkill,
  toggleSkillLike,
  setSkillsLoading,
  setSkillsError,
} = skillsSlice.actions;

export const {
  selectAllSkills,
  selectSkillById,
  selectSkillsByUserId,
  selectSkillsLoading,
  selectSkillsStatus,
  selectSkillsError,
} = skillsSlice.selectors;

export const skillsReducer = skillsSlice.reducer;