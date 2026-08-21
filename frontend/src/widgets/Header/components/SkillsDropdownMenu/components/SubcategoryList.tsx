import type { EntityId } from '@/entities/base.ts';
import styles from '../SkillsDropdownMenu.module.css';

export interface SubcategoryListProps {
  subcategories: Array<{
    id: EntityId;
    name: string;
  }>;
  onSubcategoryClick: (subcategoryId: EntityId) => void;
}

export const SubcategoryList = ({
  subcategories,
  onSubcategoryClick,
}: SubcategoryListProps) => {
  return (
    <ul className={styles.subcategoryList}>
      {subcategories.map((subcategory) => (
        <li key={subcategory.id}>
          <button
            type="button"
            className={styles.subcategoryButton}
            onClick={() => onSubcategoryClick(subcategory.id)}
          >
            {subcategory.name}
          </button>
        </li>
      ))}
    </ul>
  );
};
