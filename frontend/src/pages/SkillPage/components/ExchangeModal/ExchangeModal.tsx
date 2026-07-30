import { useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Icon } from '@/shared/ui/Icon';
import { useAppDispatch } from '@/app/store/hooks';
import { createExchangeRequest } from '@/features/exchangeRequests/slice';
import { addNotification } from '@/features/notifications/slice';
import styles from './ExchangeModal.module.css';

export type ExchangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  skillId: number;
  fromUserId: number;
  toUserId: number;
  /** Режим модалки: 'create' - создание новой заявки, 'incoming' - просмотр входящей */
  mode?: 'create' | 'incoming';
  /** ID навыка, который предложили (для режима incoming) */
  offeredSkillId?: number;
  /** Имя пользователя, который предлагает обмен */
  fromUserName?: string;
  /** Имя пользователя, которому предлагают обмен */
  toUserName?: string;
  /** Название навыка */
  skillName?: string;
  /** ID навыка, который предлагает отправитель (для уведомлений) */
  proposerSkillId?: number;
};

export const ExchangeModal = ({
  isOpen,
  onClose,
  skillId,
  fromUserId,
  toUserId,
  mode = 'create',
  offeredSkillId,
  fromUserName = 'Пользователь',
  toUserName = 'Пользователь',
  proposerSkillId,
}: ExchangeModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (mode === 'create') {
      // Создаем заявку
      dispatch(
        createExchangeRequest({
          skillId,
          fromUserId,
          toUserId,
          status: 'pending',
        })
      );

      // Уведомление для ПОЛУЧАТЕЛЯ (toUserId)
      dispatch(
        addNotification({
          id: `notif-${Date.now()}-${toUserId}`,
          type: 'exchange_offer',
          userId: toUserId,                // Кому адресовано - получатель
          fromUserId: fromUserId,           // От кого - отправитель
          fromUserName: fromUserName,
          skillId: skillId,                 // ID навыка получателя (на который предлагают обмен)
          targetSkillId: proposerSkillId,    // ID навыка отправителя (который предлагают)
          message: `${fromUserName} предлагает вам обмен`,
          isRead: false,
          createdAt: new Date().toISOString(),
        })
      );

      // Уведомление для ОТПРАВИТЕЛЯ (fromUserId)
      dispatch(
        addNotification({
          id: `notif-${Date.now()}-${fromUserId}`,
          type: 'exchange_offer',
          userId: fromUserId,               // Кому адресовано - отправитель
          fromUserId: fromUserId,            // От кого - отправитель (для единообразия)
          fromUserName: fromUserName,
          skillId: skillId,                  // ID навыка получателя (на который предложили обмен)
          targetSkillId: proposerSkillId,     // ID навыка отправителя (который предлагает)
          message: `Вы предложили обмен пользователю ${toUserName}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        })
      );

      onClose();
    } else if (mode === 'incoming' && offeredSkillId) {
      navigate(`/skill/${offeredSkillId}`);
      onClose();
    }
  };

  const getTitle = () => {
    if (mode === 'incoming') {
      return 'Вам предложили обмен';
    }
    return 'Вы предложили обмен';
  };

  const getDescription = () => {
    if (mode === 'incoming') {
      return `Пользователь ${fromUserName} хочет обменяться с вами. Нажмите «Перейти», чтобы посмотреть его навык.`;
    }
    return 'Теперь дождитесь подтверждения. Вам придёт уведомление';
  };

  const getButtonText = () => {
    if (mode === 'incoming') {
      return 'Перейти';
    }
    return 'Готово';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={styles.customModal}
      icon={<Icon name="notification" size={24} aria-hidden="true" />}
      title={getTitle()}
      description={getDescription()}
      buttonText={getButtonText()}
      buttonVariant="primary"
      buttonFullWidth
      onButtonClick={handleConfirm}
    />
  );
};