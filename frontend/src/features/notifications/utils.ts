import type { Notification } from './types';

/** Для отображения напротив уведомления: «сегодня», «вчера» или «12 мая» и т.д */
export function formatNotificationDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((todayStart.getTime() - dateStart.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      ...(d.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}),
    });
  } catch {
    return iso;
  }
}

/** Текст уведомления для отображения (тост и модалка) */
export function getNotificationDisplayMessage(n: Notification): string {
  if (n.message) return n.message;
  switch (n.type) {
    case 'exchange_offer':
      return `${n.fromUserName} is offering you a swap`;
    case 'exchange_accepted':
      return `${n.fromUserName} accepted your swap`;
    case 'exchange_rejected':
      return `${n.fromUserName} declined the swap`;
    default:
      return n.fromUserName;
  }
}

/** Подсказка под текстом: разная для «мне предложили» и «приняли мой обмен» */
export function getNotificationHint(n: Notification): string {
  switch (n.type) {
    case 'exchange_offer':
      return 'Go to the profile to discuss the details';
    case 'exchange_accepted':
    case 'exchange_rejected':
      return 'Go to the profile to discuss the details';
    default:
      return 'Go to the profile to discuss the details';
  }
}
