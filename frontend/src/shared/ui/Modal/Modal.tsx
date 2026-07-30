import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { Button } from '@/shared/ui/Button'; 
import styles from './Modal.module.css';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  /** Открыта ли модалка */
  isOpen: boolean;
  
  /** Закрытие модалки */
  onClose: () => void;
  
  /** Иконка  */
  icon?: ReactNode;
  
  /** Заголовок */
  title?: string;
  
  /** Текст описания */
  description?: string;
  
  /** Контент (если нужен кастомный) */
  children?: ReactNode;
  
  /** Текст кнопки */
  buttonText?: string;
  
  /** Вариант кнопки */
  buttonVariant?: 'primary' | 'secondary' | 'text';
  
  /** Размер кнопки */
  buttonFullWidth?: boolean;
  
  /** Обработчик кнопки */
  onButtonClick?: () => void;
  
  /** Закрывать по Escape */
  closeOnEscape?: boolean;
  
  /** Закрывать по клику на оверлей */
  closeOnOverlayClick?: boolean;
  
  /** Дополнительные классы */
  className?: string;

  /** Скрывать системную кнопку */
  hideButton?: boolean;  // ← ДОБАВЛЕНО
}

export const Modal = ({
  isOpen,
  onClose,
  icon,
  title,
  description,
  children,
  buttonText = 'Готово',
  buttonVariant = 'primary',
  buttonFullWidth = true,
  onButtonClick,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  className,
  hideButton,                 // ← ДОБАВЛЕНО
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Блокировка скролла и фокус на кнопку
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    // Фокус на кнопку при открытии (после отрисовки модалки)
    const raf = requestAnimationFrame(() => {
      const btn = modalRef.current?.querySelector<HTMLButtonElement>('button');
      btn?.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen]);

  // Focus-trap внутри модалки (Tab / Shift+Tab)
  useEffect(() => {
    if (!isOpen) return;
    const root = modalRef.current;
    if (!root) return;

    const getFocusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1
      );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || active == null || !root.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    root.addEventListener('keydown', handleKeyDown);
    return () => root.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Обработчик клика по оверлею
  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={clsx(styles.modal, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {icon && <div className={styles.iconWrapper}>{icon}</div>}
        
        {title && (
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
        )}
        
        {description && (
          <p id="modal-description" className={styles.description}>
            {description}
          </p>
        )}
        
        {children}
        
      
        {!hideButton && (           /* ← ДОБАВЛЕНО УСЛОВИЕ */
          <Button
            variant={buttonVariant}
            fullWidth={buttonFullWidth}
            onClick={onButtonClick || onClose}
            className={styles.button}
            autoFocus
          >
            {buttonText}
          </Button>
        )}

      </div>
    </div>,
    document.body
  );
};
