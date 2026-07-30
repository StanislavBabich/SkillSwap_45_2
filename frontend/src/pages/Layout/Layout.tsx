import { useState, useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';
import { selectUnreadNotifications } from '@/features/notifications';
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';
import { NotificationToast } from '@/widgets/Notifications';
import { storage } from '@/shared/lib/storage';
import styles from './Layout.module.css';

export const Layout = () => {
  const allUnread = useAppSelector(selectUnreadNotifications);
  const [dismissedFromToastIds, setDismissedFromToastIds] = useState<string[]>([]);
  
  const currentUser = storage.getCurrentUser();
  const currentUserId = currentUser?.id;

  // Используем useMemo чтобы избежать лишних ререндеров
  const unread = useMemo(() => {
    return currentUserId 
      ? allUnread.filter(n => n.userId === currentUserId)
      : [];
  }, [allUnread, currentUserId]);

  // useMemo для toast
  const toastToShow = useMemo(() => {
    return unread
      .filter((n) => !dismissedFromToastIds.includes(n.id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }, [unread, dismissedFromToastIds]);

  // Очищаем dismissed от уведомлений, которых больше нет в списке
  useEffect(() => {
    setDismissedFromToastIds((prev) => 
      prev.filter((id) => unread.some((n) => n.id === id))
    );
  }, [unread]); // Зависимость только от unread

  const handleToastClose = (notificationId: string) => {
    setDismissedFromToastIds((prev) => [...prev, notificationId]);
  };

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.layout__main}>
        <Outlet />
      </main>
      <Footer />
      {toastToShow && (
        <NotificationToast notification={toastToShow} onClose={handleToastClose} />
      )}
    </div>
  );
};