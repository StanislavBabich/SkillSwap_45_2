export type NotificationType = 'exchange_offer' | 'exchange_accepted' | 'exchange_rejected';

export interface Notification {
  id: string;
  type: NotificationType;
  userId: number;           // Кому адресовано уведомление
  fromUserId: number;       // От кого
  fromUserName: string;     // Имя отправителя
  exchangeId?: string;      // ID обмена (опционально)
  skillId: number;          // ID навыка, на который предлагают обмен (навык получателя)
  targetSkillId?: number;   // ID навыка, который предлагают в обмен (навык отправителя)
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