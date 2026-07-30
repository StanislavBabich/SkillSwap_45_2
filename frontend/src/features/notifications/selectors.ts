import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Notification } from './types';

const selectNotificationItems = (state: RootState): Notification[] =>
  state.notifications?.items ?? [];

export const selectUnreadCount = createSelector(
  [selectNotificationItems, (_state: RootState, userId?: number) => userId],
  (items, userId): number => {
    if (!userId) return 0;
    return items.filter((n) => !n.isRead && n.userId === userId).length;
  }
);

export const selectUnreadNotifications = createSelector(
  [selectNotificationItems],
  (items): Notification[] => items.filter((n) => !n.isRead)
);

export const selectReadNotifications = createSelector(
  [selectNotificationItems],
  (items): Notification[] => items.filter((n) => n.isRead)
);

export const selectFirstUnreadNotification = createSelector(
  [selectNotificationItems],
  (items): Notification | undefined => items.find((n) => !n.isRead)
);