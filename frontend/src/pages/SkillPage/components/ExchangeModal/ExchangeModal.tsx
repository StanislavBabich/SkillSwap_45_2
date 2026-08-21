import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Icon } from '@/shared/ui/Icon';
import { requestsApi } from '@/entities/request/api';
import type { SkillShareRequest } from '@/entities/request/types';
import styles from './ExchangeModal.module.css';

export type ExchangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  skillId: string;
  toUserId: string;
  mode?: 'create' | 'incoming';
  offeredSkillId?: string;
  fromUserName?: string;
  toUserName?: string;
  proposerSkillId?: string;
  onCreated?: (request: SkillShareRequest) => void;
};

export const ExchangeModal = ({
  isOpen,
  onClose,
  skillId,
  toUserId,
  mode = 'create',
  offeredSkillId,
  fromUserName = 'Пользователь',
  toUserName = 'Пользователь',
  proposerSkillId,
  onCreated,
}: ExchangeModalProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {
    setResult('idle');
    setErrorMessage('');
    onClose();
  };

  const handleConfirm = async () => {
    if (mode === 'create') {
      if (result === 'success') {
        setResult('idle');
        handleClose();
        return;
      }
      if (!proposerSkillId) return;
      setIsSubmitting(true);
      setResult('idle');
      try {
        const request = await requestsApi.create({
          receiverId: toUserId,
          offeredSkillId: proposerSkillId,
          requestedSkillId: skillId,
        });
        setResult('success');
        onCreated?.(request);
      } catch (error) {
        setResult('error');
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось отправить заявку');
      } finally {
        setIsSubmitting(false);
      }
    } else if (mode === 'incoming' && offeredSkillId) {
      navigate(`/skill/${offeredSkillId}`);
      handleClose();
    }
  };

  const getTitle = () => {
    if (mode === 'incoming') return 'Вам предложили обмен';
    if (result === 'success') return 'Заявка отправлена';
    if (result === 'error') return 'Не удалось отправить заявку';
    return 'Предложить обмен';
  };

  const getDescription = () => {
    if (mode === 'incoming') {
      return `Пользователь ${fromUserName} хочет обменяться с вами. Нажмите «Перейти», чтобы посмотреть его навык.`;
    }
    if (result === 'success')
      return `Заявка отправлена пользователю ${toUserName}. Дождитесь ответа.`;
    if (result === 'error') return errorMessage;
    return 'После отправки получатель увидит заявку во входящих и получит уведомление.';
  };

  const getButtonText = () => {
    if (mode === 'incoming') return 'Перейти';
    if (result === 'success') return 'Готово';
    if (result === 'error') return 'Повторить';
    return 'Отправить заявку';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={styles.customModal}
      icon={<Icon name="notification" size={24} aria-hidden="true" />}
      title={getTitle()}
      description={getDescription()}
      buttonText={getButtonText()}
      buttonVariant="primary"
      buttonFullWidth
      onButtonClick={handleConfirm}
      buttonDisabled={mode === 'create' && !proposerSkillId}
      buttonLoading={isSubmitting}
    />
  );
};
