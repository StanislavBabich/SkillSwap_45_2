import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { categoriesReducer } from '@/features/categories/slice';
import { citiesReducer } from '@/features/cities/slice';
import { exchangesReducer } from '@/features/exchanges/slice';
import { favoritesReducer } from '@/features/favorites/slice';
import { filtersReducer } from '@/features/filters/slice';
import { notificationsReducer } from '@/features/notifications';
import { requestsReducer } from '@/features/requests/slice';
import { skillsReducer } from '@/features/skills/slice';
import { usersReducer } from '@/features/users/slice';
import { uiReducer } from '@/features/ui/slice';
import { exchangeRequestsReducer } from '@/features/exchangeRequests/slice';

export const rootReducer = combineReducers({
  users: usersReducer,
  skills: skillsReducer,
  cities: citiesReducer,
  categories: categoriesReducer,
  filters: filtersReducer,
  favorites: favoritesReducer,
  requests: requestsReducer,
  exchanges: exchangesReducer,
  notifications: notificationsReducer,
  ui: uiReducer,
  exchangeRequests: exchangeRequestsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export { store };
export default store;
