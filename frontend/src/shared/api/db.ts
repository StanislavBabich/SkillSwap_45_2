const DB_BASE_PATH = '/db';

const REMOTE_DB_URLS: Record<string, string | undefined> = {
  categories: import.meta.env.VITE_DB_CATEGORIES_URL,
  cities: import.meta.env.VITE_DB_CITIES_URL,
  skills: import.meta.env.VITE_DB_SKILLS_URL,
  users: import.meta.env.VITE_DB_USERS_URL,
};

export const getDbJsonUrl = (fileName: string): string => {
  const remoteUrl = REMOTE_DB_URLS[fileName];
  return remoteUrl ?? `${DB_BASE_PATH}/${fileName}.json`;
};const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getApiUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};