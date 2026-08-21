import clsx from 'clsx';
import { Button, Headline } from '@/shared/ui';
import { Icon } from '@/shared/ui/Icon';
import { useAppSelector } from '@/app/store/hooks';
import { selectHasAnyFilters } from '@/features/filters/selectors';
import { selectFilteredSkillsCount } from '@/features/skills/selectors'; 
import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  title: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  actionLabel?: string;
  onActionClick?: () => void;
  showAction?: boolean;
  appearance?: 'default' | 'filtered';
  className?: string;
  isBackMode?: boolean;
  onBackClick?: () => void;
}

export const SectionHeader = ({
  title,
  level = 2,
  actionLabel,
  onActionClick,
  showAction = false,
  appearance = 'default',
  className,
  isBackMode = false,
  onBackClick,
}: SectionHeaderProps) => {
  const hasFilters = useAppSelector(selectHasAnyFilters);
  const filteredCount = useAppSelector(selectFilteredSkillsCount); 

  const displayTitle = hasFilters
    ? `Подходящие предложения: ${filteredCount}`
    : title;
  const effectiveAppearance = hasFilters ? 'filtered' : appearance;

  // В режиме "назад" показываем левую иконку и меняем текст
  const buttonLabel = isBackMode ? 'На главную' : actionLabel;
  
  // Определяем иконку для начала кнопки
  const getButtonStartIcon = () => {
    if (isBackMode) {
      return <Icon name="chevron-left" size={20} className={styles.actionIcon} />;
    }
    if (effectiveAppearance === 'filtered') {
      return <Icon name="sort" size={20} className={styles.actionIcon} />;
    }
    return undefined;
  };

  // Определяем иконку для конца кнопки
  const getButtonEndIcon = () => {
    if (!isBackMode && effectiveAppearance === 'default') {
      return <Icon name="chevron-right" size={20} className={styles.actionChevron} />;
    }
    return undefined;
  };

  const handleClick = isBackMode ? onBackClick : onActionClick;
  const showButton = (isBackMode || (showAction && actionLabel && onActionClick)) && buttonLabel;

  const buttonClassName = clsx(
    styles.actionButton,
    isBackMode && styles.actionButtonBack,
    !isBackMode && effectiveAppearance === 'filtered' && styles.actionButtonFiltered
  );

  return (
    <header className={styles.root}>
      <div className={clsx(styles.inner, className)}>
        <Headline level={level} className={styles.title}>
          {displayTitle}
        </Headline>
        
        {showButton && (
          <Button
            variant="secondary"
            size="medium"
            className={buttonClassName}
            onClick={handleClick}
            startIcon={getButtonStartIcon()}
            endIcon={getButtonEndIcon()}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </header>
  );
};