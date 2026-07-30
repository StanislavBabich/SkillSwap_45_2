import type { EntityId } from '@/entities/base.ts';
import { SubcategoryList } from './SubcategoryList';
import styles from '../SkillsDropdownMenu.module.css';

export interface CategoryColumnProps {
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

  onCategoryClick: (categoryId: EntityId) => void;
  onSubcategoryClick: (subcategoryId: EntityId) => void;
  columnIndex: 0 | 1;
}

export const CategoryColumn = ({
  categories,
  onCategoryClick,
  onSubcategoryClick,
  columnIndex,
}: CategoryColumnProps) => {
  return (
    <div
      className={styles.categoryColumn}
      data-column={columnIndex}
    >
      {categories.map((category) => (
        <div key={category.id} className={styles.categoryBlock}>
          <button
            type="button"
            className={styles.categoryButton}
            onClick={() => onCategoryClick(category.id)}
          >
            <span
              className={styles.categoryIcon}
              style={{ backgroundColor: category.color }}
            >
              <img
                src={category.icon}
                alt=""
                className={styles.categoryIconImage}
              />
            </span>

            <span className={styles.categoryName}>
              {category.name}
            </span>
          </button>

          <SubcategoryList
            subcategories={category.subcategories}
            onSubcategoryClick={onSubcategoryClick}
          />
        </div>
      ))}
    </div>
  );
};