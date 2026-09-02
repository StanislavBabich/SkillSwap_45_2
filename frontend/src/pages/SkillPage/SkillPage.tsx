import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import type { EntityId } from '@/entities/base';
import type { RootState } from '@/app/store';
import type { Skill } from '@/entities/skill/types';
import type { User } from '@/entities/user/types';
import { useAppSelector } from '@/app/store/hooks';

import { useAuth } from '@/features/auth';
import { selectUserById } from '@/features/users/slice';
import { requestsApi } from '@/entities/request/api';
import type { SkillShareRequest } from '@/entities/request/types';

import { UserSidebar } from './components/UserSidebar';
import { SkillInfo } from './components/SkillInfo';
import { SimilarSkills } from './components/SimilarSkills';
import { ExchangeModal } from './components/ExchangeModal';

import styles from './SkillPage.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const SkillPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { user: authUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'incoming'>('create');

  const [skill, setSkill] = useState<Skill | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [similarSkills, setSimilarSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [proposerSkillId, setProposerSkillId] = useState<string | undefined>();
  const [activeRequest, setActiveRequest] = useState<SkillShareRequest | null>(null);

  const skillId: EntityId | null = id ?? null;

  // Загружаем навык напрямую с API
  useEffect(() => {
    if (!skillId) {
      setIsLoading(false);
      return;
    }

    const loadSkill = async () => {
      try {
        const res = await fetch(`${API_URL}/skills/${skillId}`);
        if (!res.ok) throw new Error('Skill not found');
        const data = await res.json();
        setSkill(data);
      } catch {
        setSkill(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadSkill();
  }, [skillId]);

  // Загружаем владельца навыка
  useEffect(() => {
    if (!skill?.owner?.id) return;
    fetch(`${API_URL}/users/${skill.owner.id}`)
      .then((r) => r.json())
      .then(setOwner)
      .catch(() => {});
  }, [skill?.owner?.id]);

  // Загружаем похожие навыки
  useEffect(() => {
    if (!skill?.category?.id) return;

    const loadSimilar = async () => {
      try {
        const res = await fetch(`${API_URL}/skills?category=${skill.category!.id}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSimilarSkills(data.data?.filter((s: Skill) => s.id !== skill.id) ?? []);
        }
      } catch {
        // ignore
      }
    };
    loadSimilar();
  }, [skill?.category?.id]);

  const fromUserSelector = useMemo(
    () => (authUser ? (state: RootState) => selectUserById(state, authUser.id) : () => null),
    [authUser]
  );
  const fromUser = useAppSelector(fromUserSelector);

  useEffect(() => {
    if (!authUser || !skillId) return;
    const loadExchangeState = async () => {
      try {
        const [skillsResponse, outgoing] = await Promise.all([
          fetch(`${API_URL}/skills?limit=200`).then((response) => response.json()),
          requestsApi.getOutgoing(),
        ]);
        const ownSkill = (skillsResponse.data ?? []).find(
          (item: Skill) => item.owner?.id === authUser.id
        );
        setProposerSkillId(ownSkill?.id);
        setActiveRequest(outgoing.find((request) => request.requestedSkill.id === skillId) ?? null);
      } catch {
        setProposerSkillId(undefined);
      }
    };
    void loadExchangeState();
  }, [authUser, skillId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (skillId == null) return <div>Invalid id</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!skill) return <div>Skill not found</div>;

  const handleExchangeClick = () => {
    if (!authUser) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <aside className={styles.sidebar}>
          <UserSidebar skillId={skillId} skill={skill} user={owner} />
        </aside>
        <main className={styles.main}>
          <SkillInfo
            skillId={skillId}
            skill={skill}
            onExchangeClick={handleExchangeClick}
            isOwner={authUser?.id === skill.owner.id}
            activeRequestStatus={activeRequest?.status}
            hasOfferedSkill={Boolean(proposerSkillId)}
          />
        </main>
      </section>
      {similarSkills.length > 0 && (
        <section className={styles.similar}>
          <SimilarSkills skills={similarSkills} />
        </section>
      )}
      {authUser && skill && (
        <ExchangeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          skillId={skillId}
          toUserId={skill.owner.id}
          mode={modalMode}
          fromUserName={fromUser?.name}
          toUserName={owner?.name}
          proposerSkillId={proposerSkillId}
          onCreated={setActiveRequest}
        />
      )}
    </div>
  );
};
