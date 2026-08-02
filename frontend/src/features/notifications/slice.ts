import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification, NotificationsStorage } from './types';

const STORAGE_KEY = 'skillswap_notifications';

function loadFromStorage(): Notification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: NotificationsStorage = JSON.parse(raw);
    return Array.isArray(parsed?.data) ? parsed.data : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: Notification[]): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: NotificationsStorage = {
      version: 1,
      updatedAt: new Date().toISOString(),
      data: items,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // noop
  }
}

function getUnreadCount(items: Notification[]): number {
  return items.filter((n) => !n.isRead).length;
}

const initialItems = loadFromStorage();

const initialState = {
  items: initialItems,
  unreadCount: getUnreadCount(initialItems),
  isLoading: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
      state.unreadCount = getUnreadCount(action.payload);
      saveToStorage(action.payload);
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
      saveToStorage(state.items);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.items.find((i) => i.id === action.payload);
      if (n && !n.isRead) {
        n.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        saveToStorage(state.items);
      }
    },
    // помечаем как прочитанные только уведомления указанного пользователя
    markAllAsRead: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      let changed = false;
      
      state.items.forEach((n) => {
        if (n.userId === userId && !n.isRead) {
          n.isRead = true;
          changed = true;
        }
      });
      
      if (changed) {
        state.unreadCount = getUnreadCount(state.items);
        saveToStorage(state.items);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const n = state.items.find((i) => i.id === action.payload);
      if (n && !n.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveToStorage(state.items);
    },
    // очищаем только прочитанные уведомления указанного пользователя
    clearRead: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      const previousLength = state.items.length;
      
      state.items = state.items.filter((n) => !(n.userId === userId && n.isRead));
      
      if (previousLength !== state.items.length) {
        state.unreadCount = getUnreadCount(state.items);
        saveToStorage(state.items);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearRead,
  setLoading,
} = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;