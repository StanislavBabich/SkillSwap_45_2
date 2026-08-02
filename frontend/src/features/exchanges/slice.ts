import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EntityId } from '@/entities/base.ts';
import type {
  CreateSkillExchangeDto,
  SkillExchange,
  SkillExchangeStatus,
  UpdateSkillExchangeDto,
} from '@/entities/exchange/types';

export interface ExchangesState {
  items: SkillExchange[];
}

const initialState: ExchangesState = {
  items: [],
};

interface UpdateExchangeStatusPayload {
  exchangeId: EntityId;
  status: SkillExchangeStatus;
}

interface UpdateExchangePayload {
  exchangeId: EntityId;
  dto: UpdateSkillExchangeDto;
}

const getNextId = (items: { id: EntityId }[]): EntityId =>
  items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

const getTodayDate = (): string => new Date().toISOString().split('T')[0];

const exchangesSlice = createSlice({
  name: 'exchanges',
  initialState,
  reducers: {
    setExchanges: (state, action: PayloadAction<SkillExchange[]>) => {
      state.items = action.payload;
    },
    createExchange: (state, action: PayloadAction<CreateSkillExchangeDto>) => {
      state.items.push({
        id: getNextId(state.items),
        requestId: action.payload.requestId,
        firstUserId: action.payload.firstUserId,
        firstSkillId: action.payload.firstSkillId,
        secondUserId: action.payload.secondUserId,
        secondSkillId: action.payload.secondSkillId,
        status: action.payload.status ?? 'active',
        agreedAt: getTodayDate(),
      });
    },
    updateExchangeStatus: (state, action: PayloadAction<UpdateExchangeStatusPayload>) => {
      const exchange = state.items.find((item) => item.id === action.payload.exchangeId);
      if (!exchange) {
        return;
      }

      exchange.status = action.payload.status;
    },
    updateExchange: (state, action: PayloadAction<UpdateExchangePayload>) => {
      const exchange = state.items.find((item) => item.id === action.payload.exchangeId);
      if (!exchange) {
        return;
      }

      Object.assign(exchange, action.payload.dto);
    },
    removeExchange: (state, action: PayloadAction<EntityId>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearExchanges: (state) => {
      state.items = [];
    },
  },
  selectors: {
    selectAllExchanges: (state) => state.items,
    selectExchangeById: (state, exchangeId: EntityId) =>
      state.items.find((exchange) => exchange.id === exchangeId),
    selectExchangeByRequestId: (state, requestId: EntityId) =>
      state.items.find((exchange) => exchange.requestId === requestId),
    selectExchangesByStatus: (state, status: SkillExchangeStatus) =>
      state.items.filter((exchange) => exchange.status === status),
    selectActiveExchanges: (state) =>
      state.items.filter((exchange) => exchange.status === 'active'),
    selectCompletedExchanges: (state) =>
      state.items.filter((exchange) => exchange.status === 'completed'),
    selectCancelledExchanges: (state) =>
      state.items.filter((exchange) => exchange.status === 'cancelled'),
    selectExchangesByUserId: (state, userId: EntityId) =>
      state.items.filter(
        (exchange) => exchange.firstUserId === userId || exchange.secondUserId === userId
      )
  },
});

export const {
  setExchanges,
  createExchange,
  updateExchangeStatus,
  updateExchange,
  removeExchange,
  clearExchanges,
} = exchangesSlice.actions;

export const {
  selectAllExchanges,
  selectExchangeById,
  selectExchangeByRequestId,
  selectExchangesByStatus,
  selectActiveExchanges,
  selectCompletedExchanges,
  selectCancelledExchanges,
  selectExchangesByUserId
} = exchangesSlice.selectors;

export const exchangesReducer = exchangesSlice.reducer;
