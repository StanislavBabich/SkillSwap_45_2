import React from 'react';

import type { EntityId } from '@/entities/base';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { LikeButton } from '@/widgets/SkillCard/components/LikeButton';

import styles from './ActionButtons.module.css';

type ActionButtonsProps = {
  skillId: EntityId;
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({ skillId }) => {
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      // eslint-disable-next-line no-console
      console.log('Ссылка скопирована:', url);
    } catch {
      window.prompt('Скопируй ссылку:', url);
    }
  };

  const handleMore = () => {
    // eslint-disable-next-line no-console
    console.log('More actions');
  };

  return (
    <div className={styles.root}>
      <LikeButton skillId={skillId} size="md" />

      <Button
        variant="text"
        type="button"
        className={styles.iconButton}
        aria-label="Поделиться"
        onClick={handleShare}
      >
        <Icon 
          name="share" 
          size={24} 
          className={styles.icon}
        />
      </Button>

      <Button
        variant="text"
        type="button"
        className={styles.iconButton}
        aria-label="Ещё"
        onClick={handleMore}
      >
        <Icon 
          name="more" 
          size={24} 
          className={styles.icon}
        />
      </Button>
    </div>
  );
};