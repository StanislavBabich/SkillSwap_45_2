import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { EntityId } from '@/entities/base';

// Базовый селектор
export const selectAllExchangeRequests = (state: RootState) =>
  state.exchangeRequests.items;

// Заявка по ID
export const selectExchangeRequestById = (id: EntityId) =>
  createSelector(selectAllExchangeRequests, (items) =>
    items.find((req) => req.id === id)
  );

// Все заявки текущего пользователя (и входящие, и исходящие)
export const selectUserExchangeRequests = (userId: EntityId) =>
  createSelector(selectAllExchangeRequests, (items) =>
    items.filter(
      (req) => req.fromUserId === userId || req.toUserId === userId
    )
  );

export const selectExchangeRequestBySkill = (
  userId: EntityId | null,
  skillId: EntityId | null
) => (state: RootState) => {
  if (!userId || !skillId) return null;

  return (
    state.exchangeRequests.items.find(
      (req) => req.fromUserId === userId && req.skillId === skillId
    ) ?? null
  );
};

// Все заявки со статусом pending
export const selectPendingExchangeRequests = createSelector(
  selectAllExchangeRequests,
  (items) => items.filter((req) => req.status === 'pending')
);

// Количество всех заявок (для уведомлений)
export const selectExchangeRequestsCount = createSelector(
  selectAllExchangeRequests,
  (items) => items.length
);
