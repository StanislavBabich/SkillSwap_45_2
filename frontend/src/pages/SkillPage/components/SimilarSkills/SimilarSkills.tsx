import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import type { EntityId } from '@/entities/base';
import { SkillCard } from '@/widgets/SkillCard';
import type { Skill } from '@/entities/skill/types';

import styles from './SimilarSkills.module.css';

export interface SimilarSkillsProps {
  skills: Skill[];
  limit?: number;
}

const VISIBLE_COUNT = 4;
const CARD_WIDTH = 20.25;
const GAP = 1.5;
const TOTAL_WIDTH = CARD_WIDTH + GAP;

export const SimilarSkills = ({ skills, limit }: SimilarSkillsProps) => {
  const navigate = useNavigate();

  const items = limit != null ? skills.slice(0, limit) : skills;
  const maxOffset = Math.max(0, items.length - VISIBLE_COUNT);

  const [offset, setOffset] = useState(0);

  if (!items.length) {
    return null;
  }

  const handleCardClick = (skillId: EntityId) => {
    navigate(`/skill/${skillId}`);
  };

  const showLeftButton = offset > 0;
  const showRightButton = offset < maxOffset;

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Похожие предложения</h2>

      <div className={styles.gridWrapper}>
        {showLeftButton && (
          <button
            type="button"
            className={clsx(styles.navButton, styles.navButtonLeft)}
            aria-label="Предыдущие"
            onClick={() => setOffset((o) => o - 1)}
          >
            ‹
          </button>
        )}

        <div className={styles.gridViewport}>
          <div
            className={styles.gridTrack}
            style={{ transform: `translateX(-${offset * TOTAL_WIDTH}rem)` }}
          >
            {items.map((skill) => (
              <div key={skill.id} className={styles.gridCell}>
                <SkillCard skillId={skill.id} onClick={handleCardClick} />
              </div>
            ))}
          </div>
        </div>

        {showRightButton && (
          <button
            type="button"
            className={clsx(styles.navButton, styles.navButtonRight)}
            aria-label="Следующие"
            onClick={() => setOffset((o) => o + 1)}
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
};