import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EntityId } from '@/entities/base.ts';
import type {
  CreateSkillShareRequestDto,
  SkillShareRequest,
  SkillShareRequestStatus,
  UpdateSkillShareRequestDto,
} from '@/entities/request/types';

export interface RequestsState {
  items: SkillShareRequest[];
}

const initialState: RequestsState = {
  items: [],
};

interface UpdateRequestStatusPayload {
  requestId: EntityId;
  status: SkillShareRequestStatus;
}

interface UpdateRequestPayload {
  requestId: EntityId;
  dto: UpdateSkillShareRequestDto;
}

const getNextId = (items: { id: EntityId }[]): EntityId =>
  items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

const getTodayDate = (): string => new Date().toISOString().split('T')[0];


const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<SkillShareRequest[]>) => {
      state.items = action.payload;
    },
    createRequest: (state, action: PayloadAction<CreateSkillShareRequestDto>) => {
      state.items.push({
        id: getNextId(state.items),
        fromUserId: action.payload.fromUserId,
        toUserId: action.payload.toUserId,
        skillId: action.payload.skillId,
        status: action.payload.status ?? 'pending',
        createdAt: getTodayDate(),
        updatedAt: getTodayDate()
      });
    },
    updateRequestStatus: (state, action: PayloadAction<UpdateRequestStatusPayload>) => {
      const request = state.items.find((item) => item.id === action.payload.requestId);
      if (!request) {
        return;
      }

      request.status = action.payload.status;
    },
    updateRequest: (state, action: PayloadAction<UpdateRequestPayload>) => {
      const request = state.items.find((item) => item.id === action.payload.requestId);
      if (!request) {
        return;
      }

      Object.assign(request, action.payload.dto);
    },
    removeRequest: (state, action: PayloadAction<EntityId>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearRequests: (state) => {
      state.items = [];
    },
  },
  selectors: {
    selectAllRequests: (state) => state.items,
    selectRequestById: (state, requestId: EntityId) =>
      state.items.find((request) => request.id === requestId),
    selectRequestsByFromUserId: (state, fromUserId: EntityId) =>
      state.items.filter((request) => request.fromUserId === fromUserId),
    selectRequestsByToUserId: (state, toUserId: EntityId) =>
      state.items.filter((request) => request.toUserId === toUserId),
    selectRequestsByStatus: (state, status: SkillShareRequestStatus) =>
      state.items.filter((request) => request.status === status),
    selectPendingRequests: (state) => state.items.filter((request) => request.status === 'pending'),
  },
});

export const {
  setRequests,
  createRequest,
  updateRequestStatus,
  updateRequest,
  removeRequest,
  clearRequests,
} = requestsSlice.actions;

export const {
  selectAllRequests,
  selectRequestById,
  selectRequestsByFromUserId,
  selectRequestsByStatus,
  selectPendingRequests,
  selectRequestsByToUserId
} = requestsSlice.selectors;

export const requestsReducer = requestsSlice.reducer;
