import type { EntityId } from '@/entities/base';
import { getApiUrl } from '@/shared/api/db';
import { storage } from '@/shared/lib/storage';
import type { CreateSkillShareRequestDto, SkillShareRequest } from './types';

const authorizedRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = storage.getToken();
  if (!token) throw new Error('You need to log in to perform this action');

  const response = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
};

export const requestsApi = {
  getIncoming: () => authorizedRequest<SkillShareRequest[]>('/requests/incoming'),
  getOutgoing: () => authorizedRequest<SkillShareRequest[]>('/requests/outgoing'),
  create: (dto: CreateSkillShareRequestDto) =>
    authorizedRequest<SkillShareRequest>('/requests', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
  accept: (id: EntityId) =>
    authorizedRequest<SkillShareRequest>(`/requests/${id}/accept`, { method: 'PATCH' }),
  reject: (id: EntityId) =>
    authorizedRequest<SkillShareRequest>(`/requests/${id}/reject`, { method: 'PATCH' }),
  remove: (id: EntityId) => authorizedRequest<void>(`/requests/${id}`, { method: 'DELETE' }),
  markAsRead: (id: EntityId) =>
    authorizedRequest<SkillShareRequest>(`/requests/${id}/read`, { method: 'PATCH' }),
};
