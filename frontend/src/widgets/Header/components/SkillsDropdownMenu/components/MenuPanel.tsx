import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import type { EntityId } from '@/entities/base';
import type { Category } from '@/entities/category/types';
import styles from '../SkillsDropdownMenu.module.css';

export interface MenuPanelProps {
  categories: Category[];
  isOpen: boolean;
  position: { top: number; left: number; width: number } | null;
  onCategoryClick: (categoryId: EntityId) => void;
  onSubcategoryClick: (subcategoryId: EntityId) => void;
  onClose: () => void;
  className?: string;
}

export const MenuPanel = forwardRef<HTMLDivElement, MenuPanelProps>(({
  categories,
  isOpen,
  position,
  onCategoryClick,
  onSubcategoryClick,
  onClose: _onClose,
  className = '',
}, ref) => {
  if (!isOpen || !position) return null;

  const layoutLeftOffset = Math.max(0, (window.innerWidth - 1440) / 2);
  const midIndex = Math.ceil(categories.length / 2);
  const leftColumnCategories = categories.slice(0, midIndex);
  const rightColumnCategories = categories.slice(midIndex);

  const renderCategoryRow = (category: Category) => (
    <div key={category.id} className={styles.categoryRow}>
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => onCategoryClick(category.id)}
        role="menuitem"
        title={category.name}
      >
        <span className={styles.categoryIcon}>
          {category.name.charAt(0)}
        </span>
      </button>

      <div className={styles.contentColumn}>
        <button
          type="button"
          className={styles.categoryButton}
          onClick={() => onCategoryClick(category.id)}
          role="menuitem"
        >
          <span className={styles.categoryName}>{category.name}</span>
        </button>

        {category.children && category.children.length > 0 && (
          <ul className={styles.subcategoryList}>
            {category.children.map((child) => (
              <li key={child.id}>
                <button
                  type="button"
                  className={styles.subcategoryButton}
                  onClick={() => onSubcategoryClick(child.id)}
                  role="menuitem"
                >
                  {child.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return createPortal(
    <div
      ref={ref}
      className={clsx(styles.menuPanel, className)}
      style={{
        top: position.top,
        left: layoutLeftOffset,
        width: '1136px',
      }}
      role="menu"
      aria-orientation="vertical"
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            {leftColumnCategories.map(renderCategoryRow)}
          </div>
          <div className={styles.column}>
            {rightColumnCategories.map(renderCategoryRow)}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

MenuPanel.displayName = 'MenuPanel';