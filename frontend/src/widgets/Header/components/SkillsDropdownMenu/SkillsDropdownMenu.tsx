import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { initializeCategories, selectCategories } from '@/features/categories/slice';
import { 
  setSkillTypeFilter, 
  setCategoryFilters,
} from '@/features/filters/slice';
import { closeSkillsMenu } from '@/features/ui/slice'; 
import type { EntityId } from '@/entities/base';
import { MenuPanel } from './components/MenuPanel';
import { Icon } from '@/shared/ui/Icon'; 
import styles from './SkillsDropdownMenu.module.css';

export interface SkillsDropdownMenuProps {
  className?: string;
}

export const SkillsDropdownMenu = ({ className = '' }: SkillsDropdownMenuProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const categories = useAppSelector(selectCategories);
  
  const shouldOpenFromRedux = useAppSelector(state => state.ui?.isSkillsMenuOpen);
  
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(initializeCategories());
  }, [dispatch]);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideButton = buttonRef.current?.contains(target);
      const isClickInsideMenu = menuRef.current?.contains(target);
      if (!isClickInsideButton && !isClickInsideMenu) handleClose();
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => updatePosition();
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    updatePosition();
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (shouldOpenFromRedux) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      handleOpen();
      dispatch(closeSkillsMenu());
    }
  }, [shouldOpenFromRedux, dispatch, handleOpen]);

  const handleClose = () => setIsOpen(false);

  const handleCategorySelect = (categoryId: EntityId) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;
    const subcategoryIds = category.children?.map((child) => child.id) ?? [];
    dispatch(setSkillTypeFilter('all'));
    dispatch(setCategoryFilters(subcategoryIds.length > 0 ? subcategoryIds : [categoryId]));
    handleClose();
    if (location.pathname !== '/') navigate('/');
  };

  const handleSubcategorySelect = (subcategoryId: EntityId) => {
    dispatch(setSkillTypeFilter('all'));
    dispatch(setCategoryFilters([subcategoryId]));
    handleClose();
    if (location.pathname !== '/') navigate('/');
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={clsx(styles.dropdownButton, className)}
        onClick={isOpen ? handleClose : handleOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="All skills"
      >
        <span>All skills</span>
        <Icon name="chevron-down" className={clsx(styles.chevron, isOpen && styles.chevronOpen)} size={24} />
      </button>
      <MenuPanel
        ref={menuRef}
        categories={categories}
        isOpen={isOpen}
        position={position}
        onCategoryClick={handleCategorySelect}
        onSubcategoryClick={handleSubcategorySelect}
        onClose={handleClose}
      />
    </>
  );
};