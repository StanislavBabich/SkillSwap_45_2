import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Tag.module.css';

export type TagVariant = 
  | 'business'      // Бизнес и карьера
  | 'art'    // Творчество и искусство  
  | 'language'     // Иностранные языки
  | 'education'     // Образование и развитие
  | 'home'          // Дом и уют
  | 'health'        // Здоровье и лайфстайл
  | 'tech'        // IT 
  | 'sport'         // спорт
  | 'overflow'      // +N индикатор
  | 'default';      // Серый по умолчанию

export interface TagProps {
  /** Текст тега */
  children: ReactNode;
  
  /** Визуальный вариант тега */
  variant?: TagVariant;
  
  /** Число для overflow тега (+2, +3) */
  overflow?: number;
  
  /** Дополнительные CSS классы */
  className?: string;
  
}

export const Tag = ({
  children,
  overflow,
  variant = 'default',
  className = '',
  ...rest
}: TagProps) => {
  const isOverflow = typeof overflow === 'number';
  const displayText = isOverflow ? `+${overflow}` : children;
  
  // Для overflow всегда используем overflow стиль
  const effectiveVariant = isOverflow ? 'overflow' : variant;

  return (
    <span
      className={clsx(styles.tag, styles[`tag_${effectiveVariant}`], className)}
      {...rest}
    >
      {displayText}
    </span>
  );
};