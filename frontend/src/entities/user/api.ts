import type { EntityId } from '@/entities/base.ts';
import { getDbJsonUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import memoizeRequest from '@shared/api/memoizeRequest.ts';
import type { User, UsersResponse } from './types';

const USERS_DB_URL = getDbJsonUrl('users');

async function fetchUsersInternal(): Promise<UsersResponse> {
  return fetchJson<UsersResponse>(USERS_DB_URL);
}

const usersApi = {
  getUsers: memoizeRequest(fetchUsersInternal),
  getUserById: async (userId: EntityId): Promise<User | null> => {
    const users = await usersApi.getUsers();
    return users.find((user) => user.id === userId) ?? null;
  },
};

export const getUsers = usersApi.getUsers;
export const getUserById = usersApi.getUserById;

export default usersApi;
