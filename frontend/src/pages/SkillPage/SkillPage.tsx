import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import type { EntityId } from '@/entities/base';
import type { RootState } from '@/app/store';
import type { Skill } from '@/entities/skill/types';
import { useAppSelector } from '@/app/store/hooks';

import { 
  selectSkillWithDetails, 
  selectSimilarSkills
} from '@/features/skills/selectors';
import { useAuth } from '@/features/auth';
import { selectAllExchangeRequests } from '@/features/exchangeRequests/selectors';
import { selectUserById } from '@/features/users/slice';

import { UserSidebar } from './components/UserSidebar';
import { SkillInfo } from './components/SkillInfo';
import { SimilarSkills } from './components/SimilarSkills';
import { ExchangeModal } from './components/ExchangeModal';

import styles from './SkillPage.module.css';

export const SkillPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { user: authUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'incoming'>('create');

  const skillId: EntityId | null = id ?? null;

  // Селекторы
  const skillSelector = useMemo(
    () => (skillId ? selectSkillWithDetails(skillId) : () => null),
    [skillId]
  );
  const skill = useAppSelector(skillSelector);

  const similarSkillsSelector = useMemo(
    () => (skillId ? selectSimilarSkills(skillId) : () => []),
    [skillId]
  );
  const similarSkills = useAppSelector(similarSkillsSelector);

  const fromUserSelector = useMemo(
    () => (authUser ? (state: RootState) => selectUserById(state, authUser.id) : () => null),
    [authUser]
  );
  const fromUser = useAppSelector(fromUserSelector);

  const toUserSelector = useMemo(
    () => (skill?.owner?.id ? (state: RootState) => selectUserById(state, skill.owner.id) : () => null),
    [skill?.owner?.id]
  );
  const toUser = useAppSelector(toUserSelector);

  // Навык текущего пользователя для предложения обмена
  const proposerSkillId = useAppSelector(
    useMemo(() => {
      if (!authUser) return () => undefined;
      return (state: RootState) => {
        const userSkills = state.skills.items.filter(
          (s: Skill) => s.owner?.id === authUser.id
        );
        return userSkills[0]?.id;
      };
    }, [authUser])
  );

  // TODO: адаптировать под новую модель Request
  const incomingRequest = useMemo(() => null, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (skillId == null) return <div>Некорректный id</div>;
  if (!skill) return <div>Навык не найден</div>;

  const handleExchangeClick = () => {
    if (!authUser) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleIncomingClick = () => {
    if (!authUser || !incomingRequest) return;
    setModalMode('incoming');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <aside className={styles.sidebar}>
          <UserSidebar skillId={skillId} />
        </aside>
        <main className={styles.main}>
          <SkillInfo
            skillId={skillId}
            onExchangeClick={handleExchangeClick}
            onIncomingClick={incomingRequest ? handleIncomingClick : undefined}
          />
        </main>
      </section>
      <section className={styles.similar}>
        <SimilarSkills skills={similarSkills} />
      </section>
      {authUser && skill && (
        <ExchangeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          skillId={skillId}
          fromUserId={authUser.id}
          toUserId={skill.owner.id}
          mode={modalMode}
          fromUserName={fromUser?.name}
          toUserName={toUser?.name}
          skillName={skill.title}
          proposerSkillId={proposerSkillId}
        />
      )}
    </div>
  );
};