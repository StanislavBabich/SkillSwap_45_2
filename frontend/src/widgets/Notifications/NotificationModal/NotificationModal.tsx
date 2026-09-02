import { useEffect, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import {
  selectUnreadNotifications,
  selectReadNotifications,
  markAllAsRead,
  clearRead,
  getNotificationDisplayMessage,
  formatNotificationDate,
  getNotificationHint,
} from '@/features/notifications';
import type { Notification } from '@/features/notifications/types';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import styles from './NotificationModal.module.css';
import { storage } from '@/shared/lib/storage';

export interface NotificationModalSectionOptions {
  title: string;
  titleId?: string;
  actionLabel: string | null;
  onAction: (() => void) | null;
  items: Notification[];
  emptyText: string;
  showGoButton: boolean;
}

export interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal = forwardRef<HTMLDivElement, NotificationModalProps>(
  function NotificationModal({ isOpen, onClose }, ref) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const currentUser = storage.getCurrentUser();
    const currentUserId = currentUser?.id;

    const allUnread = useAppSelector(selectUnreadNotifications);
    const allRead = useAppSelector(selectReadNotifications);

    const unread = currentUserId ? allUnread.filter((n) => n.userId === currentUserId) : [];

    const read = currentUserId ? allRead.filter((n) => n.userId === currentUserId) : [];

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
      }
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleMarkAllRead = () => {
      if (currentUserId) {
        dispatch(markAllAsRead(currentUserId));
      }
    };

    const handleClearRead = () => {
      if (currentUserId) {
        dispatch(clearRead(currentUserId));
      }
    };

    const handleGoClick = (notification: Notification) => {
      if (!notification.skillId) {
        navigate('/requests');
        onClose();
        return;
      }
      if (notification.message.startsWith('You')) {
        navigate(`/skill/${notification.skillId}`);
      } else {
        if (notification.targetSkillId) {
          navigate(`/skill/${notification.targetSkillId}`);
        } else {
          navigate(`/skill/${notification.skillId}`);
        }
      }
      onClose();
    };

    function renderNotificationItem(n: Notification, showGoButton: boolean) {
      return (
        <div key={n.id} className={styles.item}>
          <div className={styles.itemRow}>
            <div className={styles.itemContent}>
              <Icon name="bulb" size={33} className={styles.itemIcon} aria-hidden="true" />
              <div className={styles.itemMain}>
                <p className={styles.itemMessage}>{getNotificationDisplayMessage(n)}</p>
                <p className={styles.itemHint}>{getNotificationHint(n)}</p>
              </div>
            </div>
            <span className={styles.itemDate}>{formatNotificationDate(n.createdAt)}</span>
          </div>
          {showGoButton && (
            <Button
              type="button"
              variant="secondary"
              className={styles.goBtn}
              onClick={() => handleGoClick(n)}
            >
              Go
            </Button>
          )}
        </div>
      );
    }

    function renderSection(options: NotificationModalSectionOptions) {
      const { title, titleId, actionLabel, onAction, items, emptyText, showGoButton } = options;
      return (
        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {actionLabel && items.length > 0 && (
              <button type="button" className={styles.actionBtn} onClick={onAction ?? undefined}>
                {actionLabel}
              </button>
            )}
          </header>
          <div className={styles.list}>
            {items.length === 0 ? (
              <p className={styles.empty}>{emptyText}</p>
            ) : (
              items.map((n) => renderNotificationItem(n, showGoButton))
            )}
          </div>
        </section>
      );
    }

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-modal-title"
      >
        {renderSection({
          title: 'New notifications',
          titleId: 'notifications-modal-title',
          actionLabel: 'Mark all as read',
          onAction: handleMarkAllRead,
          items: unread,
          emptyText: 'No new notifications',
          showGoButton: true,
        })}
        {renderSection({
          title: 'Viewed',
          actionLabel: 'Clear',
          onAction: handleClearRead,
          items: read,
          emptyText: 'No viewed notifications',
          showGoButton: false,
        })}
      </div>
    );
  }
);
