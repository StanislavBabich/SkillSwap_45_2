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
  skillId: string;
  fromUserId: string;
  toUserId: string;
  mode?: 'create' | 'incoming';
  offeredSkillId?: string;
  fromUserName?: string;
  toUserName?: string;
  skillName?: string;
  proposerSkillId?: string;
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
      dispatch(
  createExchangeRequest({
    receiverId: toUserId,
    offeredSkillId: proposerSkillId ?? '',
    requestedSkillId: skillId,
  })
);

      dispatch(
        addNotification({
          id: `notif-${Date.now()}-${toUserId}`,
          type: 'exchange_offer',
          userId: toUserId,
          fromUserId: fromUserId,
          fromUserName: fromUserName,
          skillId: skillId,
          targetSkillId: proposerSkillId,
          message: `${fromUserName} предлагает вам обмен`,
          isRead: false,
          createdAt: new Date().toISOString(),
        })
      );

      dispatch(
        addNotification({
          id: `notif-${Date.now()}-${fromUserId}`,
          type: 'exchange_offer',
          userId: fromUserId,
          fromUserId: fromUserId,
          fromUserName: fromUserName,
          skillId: skillId,
          targetSkillId: proposerSkillId,
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
    if (mode === 'incoming') return 'Вам предложили обмен';
    return 'Вы предложили обмен';
  };

  const getDescription = () => {
    if (mode === 'incoming') {
      return `Пользователь ${fromUserName} хочет обменяться с вами. Нажмите «Перейти», чтобы посмотреть его навык.`;
    }
    return 'Теперь дождитесь подтверждения. Вам придёт уведомление';
  };

  const getButtonText = () => {
    if (mode === 'incoming') return 'Перейти';
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