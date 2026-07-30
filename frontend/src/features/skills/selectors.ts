import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { EntityId } from '@/entities/base';
import type { Category, Subcategory } from '@/entities/category/types';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import { selectSearch, selectSelectedCategoryIds, selectGender, selectSelectedCityIds } from '@/features/filters/selectors';
import { AuthService } from '@/features/auth';

const selectSkills = (state: RootState): Skill[] => state.skills.items;
const selectUsers = (state: RootState): User[] => state.users.items;
const selectCategories = (state: RootState): Category[] => state.categories.categories;
const selectSubcategories = (state: RootState): Subcategory[] => state.categories.subcategories;

export interface SkillWithDetails extends Skill {
  user: User | null;
  category: Category | null;
  subcategory: Subcategory | null;
}

export const selectSkillById = (skillId: EntityId) =>
  createSelector([selectSkills], (skills): Skill | null => {
    const skill = skills.find((item) => item.id === skillId);
    return skill ?? null;
  });

export const selectSkillLikes = (skillId: EntityId) =>
  createSelector([selectSkillById(skillId)], (skill): EntityId[] => skill?.likes ?? []);

export const selectIsSkillLikedByCurrentUser = (skillId: EntityId, userId: EntityId) =>
  createSelector([selectSkillById(skillId)], (skill) => skill?.likes?.includes(userId) ?? false);

export const selectSkillLikesCount = (skillId: EntityId) =>
  createSelector([selectSkillById(skillId)], (skill): number => skill?.likes?.length ?? 0);

export const selectSkillWithDetails = (skillId: EntityId) =>
  createSelector(
    [selectSkillById(skillId), selectUsers, selectSubcategories, selectCategories],
    (skill, users, subcategories, categories): SkillWithDetails | null => {
      if (!skill) {
        return null;
      }

      const user = users.find((item) => item.id === skill.userId) ?? null;
      const subcategory = subcategories.find((item) => item.id === skill.subcategoryId) ?? null;
      const category = subcategory
        ? (categories.find((item) => item.id === subcategory.categoryId) ?? null)
        : null;

      return {
        ...skill,
        user,
        category,
        subcategory,
      };
    }
  );

export const selectUserWantToLearnSkills = (userId: EntityId) =>
  createSelector([selectUsers, selectSubcategories], (users, subcategories): Subcategory[] => {
    const user = users.find((item) => item.id === userId);
    if (!user) {
      return [];
    }

    return user.skillInterests
      .map((subcategoryId) => subcategories.find((item) => item.id === subcategoryId) ?? null)
      .filter((item): item is Subcategory => item !== null);
  });

/**
 * Находит skillId пользователя (чему он может научить)
 * Для режима "Хочу научиться" - когда у нас есть userId, но нужен skillId
 */
export const selectUserTeachSkillId = (userId: EntityId) =>
  createSelector(
    [selectSkills],
    (skills) => {
      const userSkill = skills.find(skill => skill.userId === userId);
      return userSkill?.id ?? null;
    }
  );
  
  
/** Все популярные навыки (для "Смотреть все") */
export const selectAllPopularSkills = createSelector([selectSkills], (skills) =>
  [...skills].sort((a, b) => b.likes.length - a.likes.length)
);

/** Все новые навыки (для "Смотреть все") */
export const selectAllNewSkills = createSelector([selectSkills], (skills) =>
  [...skills].sort((a, b) => b.id - a.id)
);

/** Популярные навыки (секция, топ-3) */
export const selectPopularSkills = createSelector([selectAllPopularSkills], (skills) => skills.slice(0, 3));

/** Новые навыки (секция, топ-3) */
export const selectNewSkills = createSelector([selectAllNewSkills], (skills) => skills.slice(0, 3));

/** Рекомендованные навыки (секция, топ-3) */
export const selectRecommendedSkills = createSelector(
  [selectSkills, selectPopularSkills, selectNewSkills],
  (allSkills, popularSkills, newSkills) => {
    // Собираем ID навыков, которые уже показаны (первые 3 из каждой секции)
    const popularIds = new Set(popularSkills.slice(0, 3).map(s => s.id));
    const newIds = new Set(newSkills.slice(0, 3).map(s => s.id));
    
    // Объединяем все исключаемые ID
    const excludedIds = new Set([...popularIds, ...newIds]);

    // Фильтруем, исключая показанные
    const availableSkills = allSkills.filter(skill => !excludedIds.has(skill.id));

    // Если доступных навыков меньше 9, возвращаем все доступные
    if (availableSkills.length <= 9) {
      return availableSkills;
    }

    // Перемешиваем массив случайным образом и берем первые 9
    const shuffled = [...availableSkills].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 9);
  }
);


export const selectFilteredSkillIds = createSelector(
  [selectSkills, selectUsers, selectSearch, selectGender, selectSelectedCityIds, selectSelectedCategoryIds, selectSubcategories],
  (skills, users, search, gender, cityIds, selectedCategoryIds, subcategories) => {

    // Создаем карту подкатегорий
    const subToCat = new Map(subcategories.map(s => [s.id, s.categoryId]));

    // Фильтруем пользователей
    const filteredUserIds = users
      .filter(user => {
        if (gender !== 'any' && user.gender !== gender) return false;
        if (cityIds.length > 0 && !cityIds.includes(user.cityId)) return false;
        return true;
      })
      .map(u => u.id);

    const query = search.trim().toLowerCase();
    const selectedSet = new Set(selectedCategoryIds);

    return skills
      .filter(skill => {
        // Проверка пользователя
        if (!filteredUserIds.includes(skill.userId)) return false;

        // Поиск
        const matchesSearch = query.length === 0 || 
          skill.name.toLowerCase().includes(query) || 
          skill.description.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;

        // Категории
        if (selectedSet.size === 0) return true;

        const catId = subToCat.get(skill.subcategoryId);
        return selectedSet.has(skill.subcategoryId) || (catId != null && selectedSet.has(catId));
      })
      .map(skill => skill.id);
  }
);

export const selectFilteredSkillsCount = createSelector(
  [selectFilteredSkillIds],
  (ids) => ids.length
);

// Тип сортировки
export type SortType = 'new' | 'popular' | 'default';

// Селектор для отсортированных навыков
export const selectSortedSkillIds = createSelector(
  [selectFilteredSkillIds, (_state: RootState, sortType: SortType) => sortType, selectSkills],
  (filteredIds, sortType, allSkills) => {
    if (sortType === 'default') return filteredIds;
    
    const skillsToSort = allSkills.filter(skill => filteredIds.includes(skill.id));
    
    const sorted = [...skillsToSort].sort((a, b) => {
      if (sortType === 'new') {
        return b.id - a.id;
      }
      if (sortType === 'popular') {
        return b.likes.length - a.likes.length;
      }
      return 0;
    });
    
    return sorted.map(skill => skill.id);
  }
);

/**
 * Похожие навыки из той же категории без лимита
 */
export const selectSimilarSkills = (skillId: EntityId) =>
  createSelector(
    [selectSkills, selectSkillById(skillId), selectSubcategories], 
    (skills, skill, subcategories) => {
      if (!skill) return [];
      
      // Находим категорию текущего навыка
      const currentSubcategory = subcategories.find(s => s.id === skill.subcategoryId);
      if (!currentSubcategory) return [];
      
      const currentCategoryId = currentSubcategory.categoryId;
      
      // Находим все подкатегории этой категории
      const categorySubcategoryIds = subcategories
        .filter(s => s.categoryId === currentCategoryId)
        .map(s => s.id);
      
      // Фильтруем навыки по этим подкатегориям
      return skills
        .filter(s => 
          categorySubcategoryIds.includes(s.subcategoryId) && 
          s.id !== skill.id
        );
    }
  );

export const selectFavoriteSkills = createSelector(
  [selectSkills],
  (skills): Skill[] => {
    const currentUser = AuthService.getCurrentUser();  // ← прямо из сервиса
    if (!currentUser) return [];
    return skills.filter(skill => skill.likes.includes(currentUser.id));
  }
);

// 
export const selectSkillsByUserId = createSelector(
  [selectSkills, (_state: RootState, userId: EntityId) => userId],
  (skills, userId): Skill[] => {
    return skills.filter(skill => skill.userId === userId);
  }
);

// Селектор для отсортированных навыков пользователей (для режима learn)
export const selectSortedUserSkills = createSelector(
  [
    selectSkills,
    (_state: RootState, userIds: EntityId[]) => userIds,
    (_state: RootState, _userIds: EntityId[], sortType: SortType) => sortType
  ],
  (skills, userIds, sortType): EntityId[] => {
    // Получаем все навыки этих пользователей
    const userSkills = skills.filter(skill => userIds.includes(skill.userId));
    
    // Сортируем по ID
    return [...userSkills]
      .sort((a, b) => {
        if (sortType === 'new') {
          return b.id - a.id; // сначала новые (больший ID)
        } else {
          return a.id - b.id; // сначала старые (меньший ID)
        }
      })
      .map(s => s.id);
  }
);