import { useEffect, useState, useMemo } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { EntityId } from '@/entities/base';
import styles from './MainContent.module.css';
import { selectSkillsError, selectSkillsStatus } from '@/features/skills/slice';
import { selectUsersError, selectUsersStatus } from '@/features/users/slice';
import { selectFilteredUsers } from '@/features/users/selectors';
import { ActiveFilters } from '@widgets/MainContent/components/ActiveFilters';
import { SectionGrid } from '@widgets/MainContent/components/SectionGrid';
import { SectionHeader } from '@widgets/MainContent/components/SectionHeader';
import { useSidebarMode } from '@widgets/MainContent/hooks/useSidebarMode';
import { EmptyState } from '@widgets/MainContent/components/EmptyState';
import {
  selectPopularSkills,
  selectNewSkills,
  selectRecommendedSkills,
  selectAllSkillsSorted,
  selectFilteredSkillIds,
  selectSortedSkillIds,
  selectSortedUserSkills,
  SortType,
} from '@/features/skills/selectors';
import { selectSkillType } from '@/features/filters/selectors';

const RECOMMENDED_SECTION_LIMIT = 9;

type SectionKey = 'popular' | 'new' | 'recommended' | null;

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
  const sortedSkillIds = useAppSelector((state) => selectSortedSkillIds(state, sortType));
  const filteredUsers = useAppSelector(selectFilteredUsers);

  const usersStatus = useAppSelector(selectUsersStatus);
  const usersError = useAppSelector(selectUsersError);
  const skillsStatus = useAppSelector(selectSkillsStatus);
  const skillsError = useAppSelector(selectSkillsError);

  const allSkillsSorted = useAppSelector(selectAllSkillsSorted).map((s) => s.id);
  const previewPopularSkills = useAppSelector(selectPopularSkills).map((s) => s.id);
  const previewNewSkills = useAppSelector(selectNewSkills).map((s) => s.id);
  const recommendedSkills = useAppSelector(selectRecommendedSkills).map((s) => s.id);

  const handleBackToMain = () => setSelectedSection(null);
  const handleSortChange = () => setSortType((prev) => (prev === 'new' ? 'default' : 'new'));

  useEffect(() => {
    if (mode === 'single') setSelectedSection(null);
  }, [mode]);

  const isLoading =
    users.length === 0 && skills.length === 0 && (usersStatus === 'loading' || skillsStatus === 'loading');
  const errorMessage = usersError ?? skillsError;

  const userIds = useMemo(() => filteredUsers.map((u) => u.id), [filteredUsers]);
  const sortedUserSkillIds = useAppSelector((state) => selectSortedUserSkills(state, userIds, sortType));

  const displaySkillIds = useMemo(() => {
    if (skillType === 'learn') return sortedUserSkillIds;
    return sortType === 'default' ? filteredSkillIds : sortedSkillIds;
  }, [skillType, sortedUserSkillIds, filteredSkillIds, sortedSkillIds, sortType]);

  return (
    <section className={styles.content}>
      {isLoading ? <p className={styles.stateMessage}>Загрузка данных...</p> : null}
      {errorMessage ? <p className={styles.errorMessage}>Ошибка: {errorMessage}</p> : null}
      {mode === 'single' ? (
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
            <EmptyState title="Ничего не найдено" description="Попробуйте изменить фильтры или поисковый запрос." />
          ) : (
            <SectionGrid skillIds={displaySkillIds} onSkillClick={handleSkillClick} infiniteScroll step={21} />
          )}
        </>
      ) : (
        <ul className={styles.sectionList}>
          {(!selectedSection || selectedSection === 'popular') && (
            <li className={styles.sectionListItem}>
              <SectionHeader
                title="Популярное"
                className={styles.sectionHeader}
                showAction={!selectedSection && allSkillsSorted.length > 3}
                actionLabel="Смотреть все"
                onActionClick={() => setSelectedSection('popular')}
                isBackMode={selectedSection === 'popular'}
                onBackClick={handleBackToMain}
              />
              <SectionGrid
                skillIds={selectedSection === 'popular' ? allSkillsSorted : previewPopularSkills}
                onSkillClick={handleSkillClick}
                variant={selectedSection === 'popular' ? 'full' : 'preview'}
                limit={selectedSection === 'popular' ? undefined : 3}
                infiniteScroll={selectedSection === 'popular'}
                step={21}
              />
            </li>
          )}
          {(!selectedSection || selectedSection === 'new') && (
            <li className={styles.sectionListItem}>
              <SectionHeader
                title="Новое"
                className={styles.sectionHeader}
                showAction={!selectedSection && allSkillsSorted.length > 3}
                actionLabel="Смотреть все"
                onActionClick={() => setSelectedSection('new')}
                isBackMode={selectedSection === 'new'}
                onBackClick={handleBackToMain}
              />
              <SectionGrid
                skillIds={selectedSection === 'new' ? allSkillsSorted : previewNewSkills}
                onSkillClick={handleSkillClick}
                variant={selectedSection === 'new' ? 'full' : 'preview'}
                limit={selectedSection === 'new' ? undefined : 3}
                infiniteScroll={selectedSection === 'new'}
                step={21}
              />
            </li>
          )}
          {(!selectedSection || selectedSection === 'recommended') && (
            <li className={styles.sectionListItem}>
              <SectionHeader title="Рекомендуем" className={styles.sectionHeader} />
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
    </section>
  );
};