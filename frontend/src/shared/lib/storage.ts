import type { AuthUser, StoredAuthUser } from '@/features/auth/types';
import type { Skill } from '@/entities/skill/types'; // 👈 импортируем тип Skill

export const USERS = 'USERS';
export const SKILLS = 'SKILLS';
export const CURRENT_USER = 'CURRENT_USER';
export const AUTH_TOKEN = 'AUTH_TOKEN';
export const AUTH_SESSION_EVENT = 'skillswap:auth-session-changed';

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isAuthUser = (value: unknown): value is AuthUser => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'number' &&
    typeof value.email === 'string' &&
    typeof value.name === 'string' &&
    (value.avatar === undefined || value.avatar === null || typeof value.avatar === 'string')
  );
};

const isStoredAuthUser = (value: unknown): value is StoredAuthUser => {
  if (!isRecord(value) || !isAuthUser(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.passwordHash === 'string';
};

const safeParse = <T>(json: string | null, fallback: T): T => {
  if (!json) {
    return fallback;
  }

  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

// ========== USERS ==========
export const saveUsers = (users: StoredAuthUser[]): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(USERS, JSON.stringify(users));
  } catch {
    // noop
  }
};

export const loadUsers = (): StoredAuthUser[] => {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const parsed = safeParse<unknown>(storage.getItem(USERS), []);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isStoredAuthUser);
  } catch {
    return [];
  }
};

// ========== SKILLS ==========
export const saveSkills = (skills: Skill[]): void => { 
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(SKILLS, JSON.stringify(skills));
  } catch {
    // noop
  }
};

export const loadSkills = (): Skill[] => { 
  const storage = getStorage();
  if (!storage) return [];

  try {
    const parsed = safeParse<unknown>(storage.getItem(SKILLS), []);
    return Array.isArray(parsed) ? parsed as Skill[] : [];
  } catch {
    return [];
  }
};

// ========== CURRENT USER ==========
export const setCurrentUser = (user: AuthUser): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(CURRENT_USER, JSON.stringify(user));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
    }
  } catch {
    // noop
  }
};

export const getCurrentUser = (): AuthUser | null => {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const parsed = safeParse<unknown>(storage.getItem(CURRENT_USER), null);

    if (!isAuthUser(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const clearCurrentUser = (): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(CURRENT_USER);
    storage.removeItem(AUTH_TOKEN);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
    }
  } catch {
    // noop
  }
};

// ========== AUTH TOKEN ==========
export const setToken = (token: string): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(AUTH_TOKEN, token);
  } catch {
    // noop
  }
};

export const getToken = (): string | null => {
  const storage = getStorage();
  if (!storage) return null;

  try {
    return storage.getItem(AUTH_TOKEN);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  const token = getToken();

  return Boolean(user && token);
};

// ========== UTILS ==========
export const clearAll = (): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(USERS);
    storage.removeItem(SKILLS);
    storage.removeItem(CURRENT_USER);
    storage.removeItem(AUTH_TOKEN);
  } catch {
    // noop
  }
};

// ========== ЕДИНЫЙ ОБЪЕКТ ДЛЯ УДОБСТВА ==========
export const storage = {
  saveUsers,
  loadUsers,
  saveSkills,
  loadSkills,
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser,
  setToken,
  getToken,
  isAuthenticated,
  clearAll,
};