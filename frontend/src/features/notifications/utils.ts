import type { Notification } from './types';

/** Для отображения напротив уведомления: «сегодня», «вчера» или «12 мая» и т.д */
export function formatNotificationDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((todayStart.getTime() - dateStart.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return 'сегодня';
    if (diffDays === 1) return 'вчера';
    return d.toLocaleDateString('ru-RU', {
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
      return `${n.fromUserName} предлагает вам обмен`;
    case 'exchange_accepted':
      return `${n.fromUserName} принял ваш обмен`;
    case 'exchange_rejected':
      return `${n.fromUserName} отклонил обмен`;
    default:
      return n.fromUserName;
  }
}

/** Подсказка под текстом: разная для «мне предложили» и «приняли мой обмен» */
export function getNotificationHint(n: Notification): string {
  switch (n.type) {
    case 'exchange_offer':
      return 'Перейдите в профиль, чтобы обсудить детали';
    case 'exchange_accepted':
    case 'exchange_rejected':
      return 'Перейдите в профиль, чтобы обсудить детали';
    default:
      return 'Перейдите в профиль, чтобы обсудить детали';
  }
}
