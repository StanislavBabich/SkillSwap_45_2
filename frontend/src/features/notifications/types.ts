export type NotificationType = 'exchange_offer' | 'exchange_accepted' | 'exchange_rejected';

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  fromUserId: string;
  fromUserName: string;
  exchangeId?: string;
  skillId: string;
  targetSkillId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

export interface NotificationsStorage {
  version: number;
  updatedAt: string;
  data: Notification[];
}