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
  const [offeredSkillId, setOfferedSkillId] = useState<number | undefined>();

  const skillId: EntityId | null = useMemo(() => {
    const num = Number(id);
    return id && !Number.isNaN(num) ? (num as EntityId) : null;
  }, [id]);

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
  () => (skill?.userId ? (state: RootState) => selectUserById(state, skill.userId) : () => null),
  [skill?.userId]
  );
  const toUser = useAppSelector(toUserSelector);

  // получаем навык пользователя напрямую из store
  const proposerSkillId = useAppSelector(
  useMemo(() => {
    if (!authUser) return () => undefined;
    return (state: RootState) => {
      const userSkills = state.skills.items.filter(
        (s: Skill) => s.userId === authUser.id
      );
      return userSkills[0]?.id;
    };
  }, [authUser])
);

  const allRequests = useAppSelector(selectAllExchangeRequests);

  const incomingRequest = useMemo(() => {
    if (!authUser || !skillId) return null;
    return allRequests.find(
      (req) => req.toUserId === authUser.id && req.skillId === skillId && req.status === 'pending'
    );
  }, [allRequests, authUser, skillId]);

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
    setOfferedSkillId(incomingRequest.fromUserId);
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
          toUserId={skill.userId}
          mode={modalMode}
          offeredSkillId={offeredSkillId}
          fromUserName={fromUser?.name}
          toUserName={toUser?.name}
          skillName={skill.name}
          proposerSkillId={proposerSkillId}
        />
      )}
    </div>
  );
};