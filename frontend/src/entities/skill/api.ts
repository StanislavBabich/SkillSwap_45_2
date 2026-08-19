import type { EntityId } from '@/entities/base.ts';
import { getApiUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import type { Skill, SkillsListResponse, CreateSkillDto } from './types';

async function fetchSkillsInternal(params?: Record<string, string>): Promise<SkillsListResponse> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchJson<SkillsListResponse>(getApiUrl(`/skills${query}`));
}

const skillsApi = {
  getAll: (params?: Record<string, string>) => fetchSkillsInternal(params),
  getById: async (skillId: EntityId): Promise<Skill | null> => {
    try {
      return await fetchJson<Skill>(getApiUrl(`/skills/${skillId}`));
    } catch {
      return null;
    }
  },
  create: async (dto: CreateSkillDto, token: string): Promise<Skill> => {
    return fetchJson<Skill>(getApiUrl('/skills'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });
  },
  update: async (skillId: EntityId, dto: Partial<CreateSkillDto>, token: string): Promise<Skill> => {
    return fetchJson<Skill>(getApiUrl(`/skills/${skillId}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });
  },
  delete: async (skillId: EntityId, token: string): Promise<void> => {
    await fetchJson<void>(getApiUrl(`/skills/${skillId}`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  addToFavorites: async (skillId: EntityId, token: string): Promise<void> => {
    await fetchJson<void>(getApiUrl(`/skills/${skillId}/favorite`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  removeFromFavorites: async (skillId: EntityId, token: string): Promise<void> => {
    await fetchJson<void>(getApiUrl(`/skills/${skillId}/favorite`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export const getSkills = skillsApi.getAll;
export const getSkillById = skillsApi.getById;
export const createSkill = skillsApi.create;
export const updateSkill = skillsApi.update;
export const deleteSkill = skillsApi.delete;
export const addToFavorites = skillsApi.addToFavorites;
export const removeFromFavorites = skillsApi.removeFromFavorites;

export default skillsApi;
