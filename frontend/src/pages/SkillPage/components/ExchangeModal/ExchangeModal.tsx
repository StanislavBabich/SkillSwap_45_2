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
  fromUserName = 'User',
  toUserName = 'User',
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
        setErrorMessage(error instanceof Error ? error.message : 'Failed to send request');
      } finally {
        setIsSubmitting(false);
      }
    } else if (mode === 'incoming' && offeredSkillId) {
      navigate(`/skill/${offeredSkillId}`);
      handleClose();
    }
  };

  const getTitle = () => {
    if (mode === 'incoming') return 'You have been offered a swap';
    if (result === 'success') return 'Request sent';
    if (result === 'error') return 'Failed to send request';
    return 'Propose a swap';
  };

  const getDescription = () => {
    if (mode === 'incoming') {
      return `${fromUserName} wants to swap with you. Click “Go” to view their skill.`;
    }
    if (result === 'success')
      return `Request sent to ${toUserName}. Please wait for a response.`;
    if (result === 'error') return errorMessage;
    return 'After sending, the recipient will see the request in Incoming and get a notification.';
  };

  const getButtonText = () => {
    if (mode === 'incoming') return 'Go';
    if (result === 'success') return 'Done';
    if (result === 'error') return 'Try again';
    return 'Send request';
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
