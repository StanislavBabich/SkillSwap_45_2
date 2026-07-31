import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EntityId } from '@/entities/base';
import type {
  ExchangeRequest,
  ExchangeRequestStatus,
  CreateExchangeRequestDto,
  UpdateExchangeRequestDto,
} from './types';

const STORAGE_KEY = 'skillswap_exchanges_v1';

interface StoredExchangeRequests {
  version: 1;
  updatedAt: string;
  data: ExchangeRequest[];
}

const loadFromStorage = (): ExchangeRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StoredExchangeRequests;
    return Array.isArray(parsed.data) ? parsed.data : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: ExchangeRequest[]): void => {
  const payload: StoredExchangeRequests = {
    version: 1,
    updatedAt: new Date().toISOString(),
    data: items,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore errors
  }
};

const getNextId = (): string => {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getToday = (): string => new Date().toISOString();

export interface ExchangeRequestsState {
  items: ExchangeRequest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExchangeRequestsState = {
  items: loadFromStorage(),
  isLoading: false,
  error: null,
};

const exchangeRequestsSlice = createSlice({
  name: 'exchangeRequests',
  initialState,
  reducers: {
    loadExchangeRequests(state) {
      state.items = loadFromStorage();
    },

    createExchangeRequest(state, action: PayloadAction<CreateExchangeRequestDto>) {
      const newItem: ExchangeRequest = {
        id: getNextId(),
        sender: { id: '', name: '', email: '', avatar: null, role: '' },
        receiver: { id: action.payload.receiverId, name: '', email: '', avatar: null, role: '' },
        offeredSkill: { id: action.payload.offeredSkillId, title: '', description: '' },
        requestedSkill: { id: action.payload.requestedSkillId, title: '', description: '' },
        status: 'pending',
        isRead: false,
        createdAt: getToday(),
      };

      state.items.push(newItem);
      saveToStorage(state.items);
    },

    updateExchangeRequestStatus(
      state,
      action: PayloadAction<{ id: EntityId; status: ExchangeRequestStatus }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (!item) return;

      item.status = action.payload.status;
      saveToStorage(state.items);
    },

    updateExchangeRequest(
      state,
      action: PayloadAction<{ id: EntityId; dto: UpdateExchangeRequestDto }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (!item) return;

      Object.assign(item, action.payload.dto);
      saveToStorage(state.items);
    },

    clearExchangeRequests(state) {
      state.items = [];
      saveToStorage(state.items);
    },
  },
});

export const {
  loadExchangeRequests,
  createExchangeRequest,
  updateExchangeRequestStatus,
  updateExchangeRequest,
  clearExchangeRequests,
} = exchangeRequestsSlice.actions;

export const exchangeRequestsReducer = exchangeRequestsSlice.reducer;