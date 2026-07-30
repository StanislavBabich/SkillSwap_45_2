import { useEffect, useState, useMemo } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { EntityId } from '@/entities/base';
import styles from './MainContent.module.css';
import { selectSkillsError, selectSkillsStatus } from '@/features/skills/slice';
import { selectUsersError, selectUsersStatus } from '@/features/users/slice';
import {
  selectFilteredUsers,
  selectPerfectMatches,
  selectPersonalizedRecommendations,
} from '@/features/users/selectors';
import { ActiveFilters } from '@widgets/MainContent/components/ActiveFilters';
import { SectionGrid } from '@widgets/MainContent/components/SectionGrid';
import { SectionHeader } from '@widgets/MainContent/components/SectionHeader';
import { useSidebarMode } from '@widgets/MainContent/hooks/useSidebarMode';
import { EmptyState } from '@widgets/MainContent/components/EmptyState';
import {
  selectAllNewSkills,      
  selectAllPopularSkills,
  selectNewSkills,
  selectPopularSkills,
  selectRecommendedSkills,
  selectFilteredSkillIds,
  selectSortedSkillIds,
  selectSortedUserSkills, // ✅ Новый селектор
  SortType
} from '@/features/skills/selectors.ts';
import { selectSkillType } from '@/features/filters/selectors';

const RECOMMENDED_SECTION_LIMIT = 9;

type SectionKey = 'popular' | 'new' | 'recommended' | 'perfect' | null;

export const MainContent = () => {
  const navigate = useNavigate();
  const handleSkillClick = (skillId: EntityId) => {
    navigate(`/skill/${skillId}`);
  };

  const [selectedSection, setSelectedSection] = useState<SectionKey>(null);
  const [sortType, setSortType] = useState<SortType>('default');
  const mode = useSidebarMode();

  const { user: currentUser, isAuthenticated } = useAuth();
  const currentUserId = currentUser?.id ?? null;

  const users = useAppSelector((state) => state.users.items);
  const skills = useAppSelector((state) => state.skills.items);
  const skillType = useAppSelector(selectSkillType);

  const filteredSkillIds = useAppSelector(selectFilteredSkillIds);
  const sortedSkillIds = useAppSelector(state => selectSortedSkillIds(state, sortType));
  const filteredUsers = useAppSelector(selectFilteredUsers);

  const usersStatus = useAppSelector(selectUsersStatus);
  const usersError = useAppSelector(selectUsersError);
  const skillsStatus = useAppSelector(selectSkillsStatus);
  const skillsError = useAppSelector(selectSkillsError);
  const allPopularSkills = useAppSelector(selectAllPopularSkills).map((s) => s.id);
  const previewPopularSkills = useAppSelector(selectPopularSkills).map((s) => s.id);

  const allNewSkills = useAppSelector(selectAllNewSkills).map((s) => s.id);
  const previewNewSkills = useAppSelector(selectNewSkills).map((s) => s.id);

  const recommendedSkills = useAppSelector(selectRecommendedSkills).map((s) => s.id);

  const perfectMatches = useAppSelector(state => 
    selectPerfectMatches(state, currentUserId)
  );

  const perfectMatchSkillIds = useMemo(() => {
    return perfectMatches
      .map(user => skills.find(skill => skill.userId === user.id)?.id)
      .filter((id): id is number => id !== undefined);
  }, [perfectMatches, skills]);
  
  const perfectMatchPreview = useMemo(
    () => perfectMatchSkillIds.slice(0, 3),
    [perfectMatchSkillIds]
  );
  
  const excludedUserIds = useMemo(
    () => perfectMatches.map(u => u.id),
    [perfectMatches]
  );

  const personalizedRecommendations = useAppSelector(state => 
    selectPersonalizedRecommendations(state, currentUserId, excludedUserIds)
  );

  const handleBackToMain = () => {
    setSelectedSection(null);
  };

  const handleSortChange = () => {
    setSortType(prev => prev === 'new' ? 'default' : 'new');
  };

  useEffect(() => {
    if (mode === 'single') {
      setSelectedSection(null);
    }
  }, [mode]);

  const isLoading =
    users.length === 0 &&
    skills.length === 0 &&
    (usersStatus === 'loading' || skillsStatus === 'loading');
  const errorMessage = usersError ?? skillsError;

  // Мемоизируем userIds для предотвращения лишних ререндеров
const userIds = useMemo(() => filteredUsers.map(u => u.id), [filteredUsers]);

// Используем селектор через useAppSelector
const sortedUserSkillIds = useAppSelector(state => 
  selectSortedUserSkills(state, userIds, sortType)
);

// Исправленная логика отображения с сортировкой для всех режимов
const displaySkillIds = useMemo(() => {
  if (skillType === 'learn') {
    // Для режима "Хочу научиться" - используем отсортированные навыки пользователей
    return sortedUserSkillIds;
  } else {
    // Для режимов "Все" и "Могу научить" - используем существующую логику
    return sortType === 'default' ? filteredSkillIds : sortedSkillIds;
  }
}, [skillType, sortedUserSkillIds, filteredSkillIds, sortedSkillIds, sortType]);

  return (
    <section className={styles.content}>
      {isLoading ? <p className={styles.stateMessage}>Загрузка данных...</p> : null}
      {errorMessage ? <p className={styles.errorMessage}>Ошибка: {errorMessage}</p> : null}
      {mode === 'single' ? (
        /* РЕЖИМ ФИЛЬТРАЦИИ */
        <>
          <ActiveFilters className={styles.activeFilters} />
          
          <SectionHeader
            title="Подходящие предложения"
            appearance="filtered"
            showAction
            className={styles.sectionHeader}
            actionLabel={sortType === 'new' ? 'Сначала старые' : 'Сначала новые'}
            onActionClick={handleSortChange}
          />
          {displaySkillIds.length === 0 ? (  
            <EmptyState
              title="Ничего не найдено"
              description="Попробуйте изменить фильтры или поисковый запрос."
            />
          ) : (
            <SectionGrid
              skillIds={displaySkillIds}
              onSkillClick={handleSkillClick}
              infiniteScroll={true}
              step={21}
            />  
          )}
        </>
      ) : (
        /* РЕЖИМ СЕКЦИЙ (БЕЗ ФИЛЬТРОВ) */
        <>
          {isAuthenticated() ? (
            /* АВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ */
            <ul className={styles.sectionList}>
              {/* Секция 1: Точные совпадения */}
              {(!selectedSection || selectedSection === 'perfect') && (
                <li className={styles.sectionListItem}>
                  <SectionHeader
                    title="Точное совпадение"
                    className={styles.sectionHeader}
                    showAction={!selectedSection && perfectMatchSkillIds.length > 3}
                    actionLabel="Смотреть все"
                    onActionClick={() => setSelectedSection('perfect')}
                    isBackMode={selectedSection === 'perfect'}
                    onBackClick={handleBackToMain}
                  />
                  <SectionGrid
                    skillIds={selectedSection === 'perfect' ? perfectMatchSkillIds : perfectMatchPreview}
                    onSkillClick={handleSkillClick}
                    variant={selectedSection === 'perfect' ? 'full' : 'preview'}
                    limit={selectedSection === 'perfect' ? undefined : 3}
                    infiniteScroll={selectedSection === 'perfect'}
                    step={21}
                  />
                </li>
              )}
              {/* Секция 2: Новые идеи */}
              {(!selectedSection || selectedSection === 'new') && (
                <li className={styles.sectionListItem}>
                  <SectionHeader
                    title="Новые идеи"
                    className={styles.sectionHeader}
                    showAction={!selectedSection && allNewSkills.length > 3}
                    actionLabel="Смотреть все"
                    onActionClick={() => setSelectedSection('new')}
                    isBackMode={selectedSection === 'new'}
                    onBackClick={handleBackToMain}
                  />
                  <SectionGrid
                    skillIds={selectedSection === 'new' ? allNewSkills : previewNewSkills}
                    onSkillClick={handleSkillClick}
                    variant={selectedSection === 'new' ? 'full' : 'preview'}
                    limit={selectedSection === 'new' ? undefined : 3}
                    infiniteScroll={selectedSection === 'new'}
                    step={21}
                  />
                </li>
              )}
              {/* Секция 3: Рекомендуем */}
              {(!selectedSection || selectedSection === 'recommended') && (
                <li className={styles.sectionListItem}>
                  <SectionHeader
                    title="Рекомендуем"
                    className={styles.sectionHeader}
                  />
                  <SectionGrid
                    skillIds={personalizedRecommendations}
                    onSkillClick={handleSkillClick}
                    variant="full"
                    limit={RECOMMENDED_SECTION_LIMIT}
                  />
                </li>
              )}
            </ul>
          ) : (
            /* НЕАВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ */
            <ul className={styles.sectionList}>
              {/* Секция 1: Популярное */}
              {(!selectedSection || selectedSection === 'popular') && (
                <li className={styles.sectionListItem}>
                  <SectionHeader
                    title="Популярное"
                    className={styles.sectionHeader}
                    showAction={!selectedSection && allPopularSkills.length > 3}
                    actionLabel="Смотреть все"
                    onActionClick={() => setSelectedSection('popular')}
                    isBackMode={selectedSection === 'popular'}
                    onBackClick={handleBackToMain}
                  />
                  <SectionGrid
                    skillIds={selectedSection === 'popular' ? allPopularSkills : previewPopularSkills}
                    onSkillClick={handleSkillClick}
                    variant={selectedSection === 'popular' ? 'full' : 'preview'}
                    limit={selectedSection === 'popular' ? undefined : 3}
                    infiniteScroll={selectedSection === 'popular'}
                    step={21}
                  />
                </li>
              )}
              {/* Секция 2: Новое */}
              {(!selectedSection || selectedSection === 'new') && (
                <li className={styles.sectionListItem}>
                  <SectionHeader
                    title="Новое"
                    className={styles.sectionHeader}
                    showAction={!selectedSection && allNewSkills.length > 3}
                    actionLabel="Смотреть все"
                    onActionClick={() => setSelectedSection('new')}
                    isBackMode={selectedSection === 'new'}
                    onBackClick={handleBackToMain}
                  />
                  <SectionGrid
                    skillIds={selectedSection === 'new' ? allNewSkills : previewNewSkills}
                    onSkillClick={handleSkillClick}
                    variant={selectedSection === 'new' ? 'full' : 'preview'}
                    limit={selectedSection === 'new' ? undefined : 3}
                    infiniteScroll={selectedSection === 'new'}
                    step={21}
                  />
                </li>
              )}
              {/* Секция 3: Рекомендуем */}
              {(!selectedSection || selectedSection === 'recommended') && (
                <li className={styles.sectionListItem}>
                  <SectionHeader
                    title="Рекомендуем"
                    className={styles.sectionHeader}
                  />
                  <SectionGrid
                    skillIds={recommendedSkills}
                    onSkillClick={handleSkillClick}
                    variant="full"
                    limit={RECOMMENDED_SECTION_LIMIT}
                  />
                </li>
              )}
            </ul>
          )}
        </>
      )}
    </section>
  );
};