import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/features/notifications/types';
import { getNotificationDisplayMessage } from '@/features/notifications';
import { Icon } from '@/shared/ui/Icon';
import clsx from 'clsx';
import styles from './NotificationToast.module.css';

const AUTO_CLOSE_MS = 30000;
const HIDE_ANIMATION_MS = 350;
// Вычисляем отступ слева, чтобы меню было прижато к левому краю layout
const layoutLeftOffset = Math.max(0, (window.innerWidth - 1440) / 2);

export interface NotificationToastProps {
  notification: Notification;
  /** Вызывается при закрытии тоста (авто или крестик). Уведомление НЕ помечается прочитанным — только скрывается тост. */
  onClose?: (notificationId: string) => void;
}

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setHiding(true);
    setTimeout(() => {
      onClose?.(notification.id);
    }, HIDE_ANIMATION_MS);
  }, [notification.id, onClose]);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    autoCloseTimerRef.current = setTimeout(handleClose, AUTO_CLOSE_MS);
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };
  }, [handleClose]);

  const handleClick = () => {
    if (notification.exchangeId) {
      navigate(`/exchange/${notification.exchangeId}`);
    } else if (notification.type.startsWith('exchange_')) {
      navigate('/requests');
    }
    handleClose();
  };

  const handleCloseBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
  };

  return (
    <div
      role="alert"
      className={clsx(styles.toast, visible && styles.visible, hiding && styles.hiding)}
      style={{
        left: layoutLeftOffset,
      }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
    >
      <Icon name="bulb" size={24} className={styles.icon} aria-hidden="true" />
      <span className={styles.message}>{getNotificationDisplayMessage(notification)}</span>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={handleCloseBtnClick}
        aria-label="Close notification"
      >
        <Icon name="close-thin" size={10} className={styles.closeIcon} aria-hidden="true" />
      </button>
    </div>
  );
}
