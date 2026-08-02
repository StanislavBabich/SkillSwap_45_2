import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { EntityId } from '@/entities/base';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import { selectFilteredUsers } from '@/features/users/selectors';

const selectSkills = (state: RootState): Skill[] => state.skills.items;
const selectUsers = (state: RootState): User[] => state.users.items;

export interface SkillWithDetails extends Skill {
  user: User | null;
}

export const selectSkillById = (skillId: EntityId) =>
  createSelector([selectSkills], (skills): Skill | null => {
    return skills.find((item) => item.id === skillId) ?? null;
  });

export const selectSkillWithDetails = (skillId: EntityId) =>
  createSelector([selectSkillById(skillId), selectUsers], (skill, users): SkillWithDetails | null => {
    if (!skill) return null;
    const user = users.find((item) => item.id === skill.owner.id) ?? null;
    return { ...skill, user };
  });

/** Все навыки (для "Смотреть все") */
export const selectAllSkillsSorted = createSelector([selectSkills], (skills) =>
  [...skills].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

/** Популярные навыки (секция, топ-3) */
export const selectPopularSkills = createSelector([selectAllSkillsSorted], (skills) =>
  skills.slice(0, 3)
);

/** Новые навыки (секция, топ-3) */
export const selectNewSkills = createSelector([selectAllSkillsSorted], (skills) =>
  skills.slice(0, 3)
);

/** Рекомендованные навыки (секция, топ-3) */
export const selectRecommendedSkills = createSelector(
  [selectSkills, selectPopularSkills, selectNewSkills],
  (allSkills, popularSkills, newSkills) => {
    const excludedIds = new Set([
      ...popularSkills.map((s) => s.id),
      ...newSkills.map((s) => s.id),
    ]);
    const available = allSkills.filter((skill) => !excludedIds.has(skill.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 9);
  }
);

export const selectFilteredSkillIds = createSelector(
  [selectSkills, selectFilteredUsers],
  (skills, filteredUsers) => {
    const filteredUserIds = new Set(filteredUsers.map((u) => u.id));
    return skills
      .filter((skill) => filteredUserIds.has(skill.owner.id))
      .map((skill) => skill.id);
  }
);

export const selectFilteredSkillsCount = createSelector(
  [selectFilteredSkillIds],
  (ids) => ids.length
);

export type SortType = 'new' | 'popular' | 'default';

export const selectSortedSkillIds = createSelector(
  [selectFilteredSkillIds, (_state: RootState, sortType: SortType) => sortType, selectSkills],
  (filteredIds, sortType, allSkills) => {
    if (sortType === 'default') return filteredIds;
    const skillsToSort = allSkills.filter((skill) => filteredIds.includes(skill.id));
    const sorted = [...skillsToSort].sort((a, b) => {
      if (sortType === 'new') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
    return sorted.map((skill) => skill.id);
  }
);

/** Похожие навыки из той же категории */
export const selectSimilarSkills = (skillId: EntityId) =>
  createSelector([selectSkills, selectSkillById(skillId)], (skills, skill) => {
    if (!skill || !skill.category) return [];
    return skills.filter(
      (s) => s.category?.id === skill.category?.id && s.id !== skill.id
    );
  });

/** Избранные навыки текущего пользователя */
export const selectFavoriteSkills = createSelector(
  [selectSkills, (_state: RootState, userId: EntityId | null) => userId],
  (skills, userId): Skill[] => {
    if (!userId) return [];
    // Избранное теперь на бекенде, нужен отдельный запрос
    return [];
  }
);

/** Навыки пользователя */
export const selectSkillsByOwnerId = createSelector(
  [selectSkills, (_state: RootState, ownerId: EntityId) => ownerId],
  (skills, ownerId): Skill[] => {
    return skills.filter((skill) => skill.owner.id === ownerId);
  }
);

export const selectSortedUserSkills = createSelector(
  [
    selectSkills,
    (_state: RootState, ownerIds: EntityId[]) => ownerIds,
    (_state: RootState, _ownerIds: EntityId[], sortType: SortType) => sortType,
  ],
  (skills, ownerIds, sortType): EntityId[] => {
    const userSkills = skills.filter((skill) => ownerIds.includes(skill.owner.id));
    return [...userSkills]
      .sort((a, b) => {
        if (sortType === 'new') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
      .map((s) => s.id);
  }
);