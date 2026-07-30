import clsx from 'clsx';
import type { EntityId } from '@/entities/base';
import { SkillCard } from '@/widgets/SkillCard';
import { useInfiniteScroll, INITIAL_VISIBLE_ITEMS } from '@/shared/hooks/useInfiniteScroll';
import styles from './SectionGrid.module.css';

export interface SectionGridProps {
  skillIds: EntityId[];
  limit?: number;
  variant?: 'preview' | 'full';
  className?: string;
  infiniteScroll?: boolean;
  step?: number;
  onSkillClick?: (skillId: EntityId) => void; 
}

export const SectionGrid = ({
  skillIds,
  limit,
  variant = 'full',
  className,
  infiniteScroll = false,
  step = 21,
  onSkillClick,
}: SectionGridProps) => {
  
  const { displayedItems, hasMore, isLoading, lastElementRef } = useInfiniteScroll({
      items: skillIds,
      initialLimit: INITIAL_VISIBLE_ITEMS,
      step,
    });

  // 1. Бесконечный скролл (наивысший приоритет)
  if (infiniteScroll) {
    return (
      <div className={clsx(styles.root, className)}>
        {displayedItems.map((skillId) => (
          <SkillCard 
          key={skillId} 
          skillId={skillId}
          onClick={onSkillClick} />
        ))}
        {hasMore && (
          <div ref={lastElementRef} className={styles.trigger}>
            {isLoading && <div className={styles.loader}>Загрузка...</div>}
          </div>
        )}
      </div>
    );
  }

  // 2. Preview режим (для главной страницы)
  if (variant === 'preview') {
    const idsToRender = limit != null ? skillIds.slice(0, limit) : skillIds;
    
    return (
      <div className={clsx(styles.root, className)}>
        {idsToRender.map((skillId) => (
          <SkillCard 
          key={skillId} 
          skillId={skillId}
          onClick={onSkillClick} />
        ))}
      </div>
    );
  }

  // 3. Обычный режим (full)
  return (
    <div className={clsx(styles.root, className)}>
      {skillIds.map((skillId) => (
        <SkillCard 
        key={skillId} 
        skillId={skillId} 
        onClick={onSkillClick} />
      ))}
    </div>
  );
};