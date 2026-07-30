import type { EntityId } from '@/entities/base.ts';
import { getDbJsonUrl } from '@shared/api/db.ts';
import { fetchJson } from '@shared/api/fetchJson.ts';
import memoizeRequest from '@shared/api/memoizeRequest.ts';
import type { Skill, SkillsResponse } from './types';

const SKILLS_DB_URL = getDbJsonUrl('skills');

async function fetchSkillsInternal(): Promise<SkillsResponse> {
  return fetchJson<SkillsResponse>(SKILLS_DB_URL);
}

const skillsApi = {
  getSkills: memoizeRequest(fetchSkillsInternal),
  getSkillById: async (skillId: EntityId): Promise<Skill | null> => {
    const skills = await skillsApi.getSkills();
    return skills.find((skill) => skill.id === skillId) ?? null;
  },
  getSkillsByUserId: async (userId: EntityId): Promise<Skill[]> => {
    const skills = await skillsApi.getSkills();
    return skills.filter((skill) => skill.userId === userId);
  },
};

export const getSkills = skillsApi.getSkills;
export const getSkillById = skillsApi.getSkillById;
export const getSkillsByUserId = skillsApi.getSkillsByUserId;

export default skillsApi;
