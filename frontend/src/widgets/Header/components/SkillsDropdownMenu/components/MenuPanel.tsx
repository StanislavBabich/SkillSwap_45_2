import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import type { EntityId } from '@/entities/base';
import styles from '../SkillsDropdownMenu.module.css';

export interface MenuPanelProps {
  /** Данные категорий с подкатегориями */
  categories: Array<{
    id: EntityId;
    name: string;
    icon: string;
    color: string;
    subcategories: Array<{
      id: EntityId;
      name: string;
    }>;
  }>;

  /** Флаг видимости меню */
  isOpen: boolean;

  /** Позиция для портала (координаты кнопки) */
  position: { top: number; left: number; width: number } | null;

  /** Обработчик клика по категории */
  onCategoryClick: (categoryId: EntityId) => void;

  /** Обработчик клика по подкатегории */
  onSubcategoryClick: (subcategoryId: EntityId) => void;

  /** Обработчик запроса закрытия */
  onClose: () => void;

  /** Дополнительные классы */
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

  // Вычисляем отступ слева, чтобы меню было прижато к левому краю layout
  const layoutLeftOffset = Math.max(0, (window.innerWidth - 1440) / 2);

  // Разделяем категории на две колонки
  const midIndex = Math.ceil(categories.length / 2);
  const leftColumnCategories = categories.slice(0, midIndex);
  const rightColumnCategories = categories.slice(midIndex);

  // Типизированная функция для рендера категории
  const renderCategoryRow = (category: MenuPanelProps['categories'][0]) => (
    <div key={category.id} className={styles.categoryRow}>
      {/* Иконка */}
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => onCategoryClick(category.id)}
        role="menuitem"
        title={category.name}
      >
        <span
          className={styles.categoryIcon}
          style={{ backgroundColor: category.color }}
        >
          <img
            src={category.icon}
            alt=""
            className={styles.categoryIconImage}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Категория и подкатегории */}
      <div className={styles.contentColumn}>
        <button
          type="button"
          className={styles.categoryButton}
          onClick={() => onCategoryClick(category.id)}
          role="menuitem"
        >
          <span className={styles.categoryName}>{category.name}</span>
        </button>

        {category.subcategories.length > 0 && (
          <ul className={styles.subcategoryList}>
            {category.subcategories.map((sub: { id: EntityId; name: string }) => (
              <li key={sub.id}>
                <button
                  type="button"
                  className={styles.subcategoryButton}
                  onClick={() => onSubcategoryClick(sub.id)}
                  role="menuitem"
                >
                  {sub.name}
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
          {/* Левая колонка */}
          <div className={styles.column}>
            {leftColumnCategories.map(renderCategoryRow)}
          </div>

          {/* Правая колонка */}
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