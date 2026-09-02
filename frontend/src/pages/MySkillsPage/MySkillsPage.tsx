import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/shared/lib/storage';
import { SkillCard } from '@/widgets/SkillCard';
import { Button } from '@/shared/ui/Button';
import type { Skill } from '@/entities/skill/types';
import styles from './MySkillsPage.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const MySkillsPage = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const stored = storage.getCurrentUser();
        if (!stored) return;

        const res = await fetch(`${API_URL}/skills?limit=200`);
        if (res.ok) {
          const data = await res.json();
          const mySkills = (data.data || []).filter(
            (s: Skill) => s.owner?.id === stored.id
          );
          setSkills(mySkills);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    loadSkills();
  }, []);

  const handleSkillClick = (skillId: string) => {
    navigate(`/skill/${skillId}`);
  };

  const handleAddSkill = () => {
    navigate('/create-skill');
  };

  if (isLoading) {
    return (
      <section className={styles.page}>
        <h1 className={styles.title}>My skills</h1>
        <p className={styles.state}>Loading...</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>My skills</h1>

      {skills.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>You don't have any skills yet</p>
          <Button variant="primary" onClick={handleAddSkill}>
            Add a skill
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skillId={skill.id}
              onClick={handleSkillClick}
            />
          ))}
          {/* Карточка-заглушка для добавления нового навыка */}
          <button
            type="button"
            className={styles.addCard}
            onClick={handleAddSkill}
            aria-label="Add a skill"
          >
            <span className={styles.addIcon}>+</span>
            <span className={styles.addText}>Add a skill</span>
          </button>
        </div>
      )}
    </section>
  );
};