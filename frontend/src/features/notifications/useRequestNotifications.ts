import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppDispatch } from '@/app/store/hooks';
import { AUTH_SESSION_EVENT, storage } from '@/shared/lib/storage';
import { addNotification } from './slice';
import type { NotificationType } from './types';

type RequestNotificationPayload = {
  type: 'newRequest' | 'requestAccepted' | 'requestRejected';
  skillName: string;
  user: { id: string; name: string };
};

const notificationTypes: Record<RequestNotificationPayload['type'], NotificationType> = {
  newRequest: 'exchange_offer',
  requestAccepted: 'exchange_accepted',
  requestRejected: 'exchange_rejected',
};

const getMessage = (payload: RequestNotificationPayload) => {
  if (payload.type === 'newRequest') return `${payload.user.name} is offering you a swap`;
  if (payload.type === 'requestAccepted') return `${payload.user.name} accepted your request`;
  return `${payload.user.name} declined your request`;
};

export const useRequestNotifications = () => {
  const dispatch = useAppDispatch();
  const [sessionVersion, setSessionVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setSessionVersion((version) => version + 1);
    window.addEventListener(AUTH_SESSION_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  useEffect(() => {
    const token = storage.getToken();
    const currentUser = storage.getCurrentUser();
    if (!token || !currentUser) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const socket = io(apiUrl.replace(/\/api\/?$/, ''), { query: { token } });

    socket.on('notificateNewRequest', (payload: RequestNotificationPayload) => {
      dispatch(
        addNotification({
          id: `request-notification-${Date.now()}-${payload.user.id}`,
          type: notificationTypes[payload.type],
          userId: currentUser.id,
          fromUserId: payload.user.id,
          fromUserName: payload.user.name,
          skillId: '',
          message: getMessage(payload),
          isRead: false,
          createdAt: new Date().toISOString(),
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, sessionVersion]);
};
