import type { EntityId } from '@/entities/base.ts';
import { getApiUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import memoizeRequest from '@shared/api/memoizeRequest.ts';
import type { User, UsersResponse } from './types';

async function fetchUsersInternal(): Promise<UsersResponse> {
  return fetchJson<UsersResponse>(getApiUrl('/users'));
}

const usersApi = {
  getAll: memoizeRequest(fetchUsersInternal),
  getById: async (userId: EntityId): Promise<User | null> => {
    try {
      return await fetchJson<User>(getApiUrl(`/users/${userId}`));
    } catch {
      return null;
    }
  },
  getMe: async (token: string): Promise<User> => {
    return fetchJson<User>(getApiUrl('/users/me'), {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  updateMe: async (dto: Partial<User>, token: string): Promise<User> => {
    return fetchJson<User>(getApiUrl('/users/me'), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });
  },
};

export const getUsers = usersApi.getAll;
export const getUserById = usersApi.getById;
export const getMe = usersApi.getMe;
export const updateMe = usersApi.updateMe;

export default usersApi;