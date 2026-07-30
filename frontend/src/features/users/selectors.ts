import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { EntityId } from '@/entities/base.ts';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';

export type UsersSection = 'popular' | 'new' | 'recommended';

const MAIN_PAGE_PREVIEW_LIMIT = 3;

const selectUsers = (state: RootState): User[] => state.users.items;
const selectSkills = (state: RootState): Skill[] => state.skills.items;
const selectCities = (state: RootState) => state.cities.items;
const selectSubcategories = (state: RootState) => state.categories.subcategories;
const selectFilters = (state: RootState) => state.filters;

const selectSkillsByUserId = createSelector([selectSkills], (skills) => {
  const map = new Map<EntityId, Skill[]>();

  skills.forEach((skill) => {
    const current = map.get(skill.userId) ?? [];
    current.push(skill);
    map.set(skill.userId, current);
  });

  return map;
});

const selectSubcategoryToCategoryIdMap = createSelector([selectSubcategories], (subcategories) => {
  const map = new Map<EntityId, EntityId>();
  subcategories.forEach((subcategory) => {
    map.set(subcategory.id, subcategory.categoryId);
  });
  return map;
});

const getUserTeachSubcategoryIds = (
  skillsByUserId: Map<EntityId, Skill[]>,
  userId: EntityId
): EntityId[] => (skillsByUserId.get(userId) ?? []).map((skill) => skill.subcategoryId);

const getUserTeachCategoryIds = (
  skillsByUserId: Map<EntityId, Skill[]>,
  subcategoryToCategoryIdMap: Map<EntityId, EntityId>,
  userId: EntityId
): EntityId[] =>
  getUserTeachSubcategoryIds(skillsByUserId, userId)
    .map((subcategoryId) => subcategoryToCategoryIdMap.get(subcategoryId))
    .filter((value): value is EntityId => typeof value === 'number');

const getUserLearnCategoryIds = (
  user: User,
  subcategoryToCategoryIdMap: Map<EntityId, EntityId>
): EntityId[] =>
  user.skillInterests
    .map((subcategoryId) => subcategoryToCategoryIdMap.get(subcategoryId))
    .filter((value): value is EntityId => typeof value === 'number');

const intersectionCount = (left: EntityId[], right: EntityId[]): number => {
  if (!left.length || !right.length) {
    return 0;
  }

  const rightSet = new Set(right);
  return left.reduce((acc, id) => acc + (rightSet.has(id) ? 1 : 0), 0);
};

export const selectFilteredUsers = createSelector(
  [selectUsers, selectSkillsByUserId, selectSubcategoryToCategoryIdMap, selectFilters],
  (users, skillsByUserId, subcategoryToCategoryIdMap, filters) => {
    const search = filters.search.trim().toLowerCase();
    const selected = new Set(filters.selectedCategoryIds);
    const categoryToSubcategoryIds = new Map<EntityId, EntityId[]>();

    subcategoryToCategoryIdMap.forEach((categoryId, subcategoryId) => {
      const current = categoryToSubcategoryIds.get(categoryId) ?? [];
      current.push(subcategoryId);
      categoryToSubcategoryIds.set(categoryId, current);
    });

    const selectedCategoryIdsByCoverage = new Set<EntityId>();
    categoryToSubcategoryIds.forEach((subcategoryIds, categoryId) => {
      const isCategorySelected =
        subcategoryIds.length > 0 && subcategoryIds.every((subcategoryId) => selected.has(subcategoryId));

      if (isCategorySelected) {
        selectedCategoryIdsByCoverage.add(categoryId);
      }
    });
    const selectedSubcategoryIds = new Set<EntityId>();
    selected.forEach((id) => {
      if (!subcategoryToCategoryIdMap.has(id)) {
        return;
      }

      const categorySubcategoryIds = categoryToSubcategoryIds.get(id);
      const looksLikeCategoryMarker =
        categorySubcategoryIds != null &&
        categorySubcategoryIds.length > 0 &&
        categorySubcategoryIds.every((subcategoryId) => selected.has(subcategoryId));

      if (!looksLikeCategoryMarker) {
        selectedSubcategoryIds.add(id);
      }
    });

    const matchesCategorySelection = (subcategoryId: EntityId): boolean => {
      if (selected.size === 0) {
        return true;
      }

      const categoryId = subcategoryToCategoryIdMap.get(subcategoryId);
      return (
        selectedSubcategoryIds.has(subcategoryId) ||
        (categoryId != null && selectedCategoryIdsByCoverage.has(categoryId))
      );
    };

    return users.filter((user) => {
      if (filters.gender !== 'any' && user.gender !== filters.gender) {
        return false;
      }

      if (filters.selectedCityIds.length > 0 && !filters.selectedCityIds.includes(user.cityId)) {
        return false;
      }

      const userSkills = skillsByUserId.get(user.id) ?? [];
      const teachSubcategoryIds = getUserTeachSubcategoryIds(skillsByUserId, user.id);
      const learnSubcategoryIds = user.skillInterests;

      if (filters.selectedCategoryIds.length > 0) {
        const categoryMatchByType =
          filters.skillType === 'teach'
            ? teachSubcategoryIds.some((subcategoryId) => matchesCategorySelection(subcategoryId))
            : filters.skillType === 'learn'
              ? learnSubcategoryIds.some((subcategoryId) => matchesCategorySelection(subcategoryId))
              : teachSubcategoryIds.some((subcategoryId) => matchesCategorySelection(subcategoryId)) ||
                learnSubcategoryIds.some((subcategoryId) => matchesCategorySelection(subcategoryId));

        if (!categoryMatchByType) {
          return false;
        }
      }

      if (filters.skillType === 'teach' && userSkills.length === 0) {
        return false;
      }

      if (filters.skillType === 'learn' && user.skillInterests.length === 0) {
        return false;
      }

      if (!search) {
        return true;
      }

      const userText = `${user.name} ${user.about}`.toLowerCase();
      if (userText.includes(search)) {
        return true;
      }

      return userSkills.some((skill) => skill.name.toLowerCase().includes(search));
    });
  }
);

const getPopularityScore = (skillsByUserId: Map<EntityId, Skill[]>, userId: EntityId): number =>
  (skillsByUserId.get(userId) ?? []).reduce((sum, skill) => sum + skill.likes.length, 0);

export const selectPopularUsers = createSelector(
  [selectFilteredUsers, selectSkillsByUserId],
  (users, skillsByUserId) =>
    [...users].sort((left, right) => {
      const scoreDiff =
        getPopularityScore(skillsByUserId, right.id) - getPopularityScore(skillsByUserId, left.id);
      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      const dateDiff =
        new Date(right.registrationDate).getTime() - new Date(left.registrationDate).getTime();
      if (dateDiff !== 0) {
        return dateDiff;
      }

      return left.name.localeCompare(right.name);
    })
);

export const selectNewUsers = createSelector([selectFilteredUsers], (users) =>
  [...users].sort((left, right) => {
    const dateDiff =
      new Date(right.registrationDate).getTime() - new Date(left.registrationDate).getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }

    return left.name.localeCompare(right.name);
  })
);

export const selectRecommendedUsers = createSelector(
  [
    selectFilteredUsers,
    selectUsers,
    selectSkillsByUserId,
    selectSubcategoryToCategoryIdMap,
    (_: RootState, currentUserId: EntityId) => currentUserId,
  ],
  (filteredUsers, users, skillsByUserId, subcategoryToCategoryIdMap, currentUserId) => {
    const currentUser = users.find((user) => user.id === currentUserId);
    if (!currentUser) {
      return [];
    }

    const currentTeachSubcategoryIds = getUserTeachSubcategoryIds(skillsByUserId, currentUserId);
    const currentLearnSubcategoryIds = currentUser.skillInterests;

    return filteredUsers
      .filter((user) => user.id !== currentUserId)
      .map((candidate) => {
        const candidateTeachSubcategoryIds = getUserTeachSubcategoryIds(
          skillsByUserId,
          candidate.id
        );
        const candidateLearnSubcategoryIds = candidate.skillInterests;
        const candidateTeachCategoryIds = getUserTeachCategoryIds(
          skillsByUserId,
          subcategoryToCategoryIdMap,
          candidate.id
        );

        const score =
          intersectionCount(currentLearnSubcategoryIds, candidateTeachSubcategoryIds) * 3 +
          intersectionCount(currentTeachSubcategoryIds, candidateLearnSubcategoryIds) * 2 +
          intersectionCount(
            getUserLearnCategoryIds(currentUser, subcategoryToCategoryIdMap),
            candidateTeachCategoryIds
          ) +
          (candidate.cityId === currentUser.cityId ? 1 : 0);

        return { candidate, score };
      })
      .sort((left, right) => {
        const scoreDiff = right.score - left.score;
        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        const popularityDiff =
          getPopularityScore(skillsByUserId, right.candidate.id) -
          getPopularityScore(skillsByUserId, left.candidate.id);
        if (popularityDiff !== 0) {
          return popularityDiff;
        }

        return left.candidate.name.localeCompare(right.candidate.name);
      })
      .map((item) => item.candidate);
  }
);

export const selectUsersBySection = (
  state: RootState,
  section: UsersSection,
  currentUserId: EntityId
): User[] => {
  if (section === 'popular') {
    return selectPopularUsers(state);
  }

  if (section === 'new') {
    return selectNewUsers(state);
  }

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
  cityName: string | null;
}

export const selectUserWithDetails = (userId: EntityId) =>
  createSelector([selectUsers, selectCities], (users, cities): UserWithDetails | null => {
    const user = users.find((item) => item.id === userId);
    if (!user) {
      return null;
    }

    const cityName = cities.find((city) => city.id === user.cityId)?.name ?? null;

    return {
      ...user,
      cityName,
    };
  });

export const selectMainPageFeedMode = createSelector(
  [selectFilteredUsers],
  (filteredUsers): 'single' | 'sections' =>
    filteredUsers.length < MAIN_PAGE_PREVIEW_LIMIT * 3 ? 'single' : 'sections'
);

export const selectPerfectMatches = createSelector(
  [
    selectUsers,
    selectSkills,
    (_state: RootState, currentUserId: EntityId | null) => currentUserId
  ],
  (users, skills, currentUserId): User[] => {
    // Если пользователь не авторизован - возвращаем пустой массив
    if (!currentUserId) {
      return [];
    }

    const teachMap = new Map<EntityId, Set<EntityId>>();
    skills.forEach(skill => {
      const set = teachMap.get(skill.userId) ?? new Set();
      set.add(skill.subcategoryId);
      teachMap.set(skill.userId, set);
    });

    const learnMap = new Map<EntityId, Set<EntityId>>();
    users.forEach(user => {
      learnMap.set(user.id, new Set(user.skillInterests));
    });

    const currentTeach = teachMap.get(currentUserId) ?? new Set();
    const currentLearn = learnMap.get(currentUserId) ?? new Set();

    return users.filter(user => {
      if (user.id === currentUserId) return false;

      const userTeach = teachMap.get(user.id) ?? new Set();
      const userLearn = learnMap.get(user.id) ?? new Set();

      const canTeachToCurrent = intersectionCount([...userTeach], [...currentLearn]) > 0;
      const canLearnFromCurrent = intersectionCount([...userLearn], [...currentTeach]) > 0;

      return canTeachToCurrent && canLearnFromCurrent;
    });
  }
);

// Исправленный селектор для personalizedRecommendations
export const selectPersonalizedRecommendations = createSelector(
  [
    selectSkills,
    selectUsers,
    (_state: RootState, currentUserId: EntityId | null) => currentUserId,
    (_state: RootState, _currentUserId: EntityId | null, excludedUserIds: EntityId[] = []) => excludedUserIds
  ],
  (skills, users, currentUserId, excludedUserIds): EntityId[] => {
    // Если пользователь не авторизован - возвращаем пустой массив
    if (!currentUserId) {
      return [];
    }

    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return [];

    const interests = new Set(currentUser.skillInterests);
    const excludedSet = new Set(excludedUserIds);

    const candidateSkills = skills.filter(skill => 
      interests.has(skill.subcategoryId) && !excludedSet.has(skill.userId)
    );

    const shuffled = [...candidateSkills].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 9).map(s => s.id);
  }
);