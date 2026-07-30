import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { EntityId } from '@/entities/base.ts';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';

export type UsersSection = 'popular' | 'new' | 'recommended';

const MAIN_PAGE_PREVIEW_LIMIT = 3;

const selectUsers = (state: RootState): User[] => state.users.items;
const selectSkills = (state: RootState): Skill[] => state.skills.items;
const selectFilters = (state: RootState) => state.filters;

const selectSkillsByOwnerId = createSelector([selectSkills], (skills) => {
  const map = new Map<EntityId, Skill[]>();
  skills.forEach((skill) => {
    const current = map.get(skill.owner.id) ?? [];
    current.push(skill);
    map.set(skill.owner.id, current);
  });
  return map;
});

const getPopularityScore = (skillsByOwnerId: Map<EntityId, Skill[]>, userId: EntityId): number =>
  (skillsByOwnerId.get(userId) ?? []).length; // просто количество навыков

export const selectFilteredUsers = createSelector(
  [selectUsers, selectSkillsByOwnerId, selectFilters],
  (users, skillsByOwnerId, filters) => {
    const search = filters.search.trim().toLowerCase();

    return users.filter((user) => {
      if (filters.gender !== 'any' && user.gender !== filters.gender) {
        return false;
      }
      
      // TODO: починить фильтр городов, когда появится ресурс /api/cities
      //if (filters.selectedCityIds.length > 0 && !filters.selectedCityIds.includes(user.city)) {
      //  return false;
      //}

      const userSkills = skillsByOwnerId.get(user.id) ?? [];

      if (filters.skillType === 'teach' && userSkills.length === 0) {
        return false;
      }

      if (!search) {
        return true;
      }

      const userText = `${user.name} ${user.about}`.toLowerCase();
      if (userText.includes(search)) {
        return true;
      }

      return userSkills.some((skill) => skill.title.toLowerCase().includes(search));
    });
  }
);

export const selectPopularUsers = createSelector(
  [selectFilteredUsers, selectSkillsByOwnerId],
  (users, skillsByOwnerId) =>
    [...users].sort((left, right) => {
      const scoreDiff =
        getPopularityScore(skillsByOwnerId, right.id) - getPopularityScore(skillsByOwnerId, left.id);
      if (scoreDiff !== 0) return scoreDiff;
      return left.name.localeCompare(right.name);
    })
);

export const selectNewUsers = createSelector([selectFilteredUsers], (users) =>
  [...users].sort((left, right) => left.name.localeCompare(right.name))
);

export const selectRecommendedUsers = createSelector(
  [selectFilteredUsers, (_: RootState, currentUserId: EntityId) => currentUserId],
  (users, currentUserId) =>
    users
      .filter((user) => user.id !== currentUserId)
      .sort((left, right) => left.name.localeCompare(right.name))
);

export const selectUsersBySection = (
  state: RootState,
  section: UsersSection,
  currentUserId: EntityId
): User[] => {
  if (section === 'popular') return selectPopularUsers(state);
  if (section === 'new') return selectNewUsers(state);
  return selectRecommendedUsers(state, currentUserId);
};

export const selectMainPageUsersPreview = (
  state: RootState,
  currentUserId: EntityId
): Record<UsersSection, User[]> => ({
  popular: selectPopularUsers(state).slice(0, MAIN_PAGE_PREVIEW_LIMIT),
  new: selectNewUsers(state).slice(0, MAIN_PAGE_PREVIEW_LIMIT),
  recommended: selectRecommendedUsers(state, currentUserId).slice(0, MAIN_PAGE_PREVIEW_LIMIT),
});

export interface UserWithDetails extends User {
  cityName: string;
}

export const selectUserWithDetails = (userId: EntityId) =>
  createSelector([selectUsers], (users): UserWithDetails | null => {
    const user = users.find((item) => item.id === userId);
    if (!user) return null;
    return { ...user, cityName: user.city };
  });

export const selectMainPageFeedMode = createSelector(
  [selectFilteredUsers],
  (filteredUsers): 'single' | 'sections' =>
    filteredUsers.length < MAIN_PAGE_PREVIEW_LIMIT * 3 ? 'single' : 'sections'
);