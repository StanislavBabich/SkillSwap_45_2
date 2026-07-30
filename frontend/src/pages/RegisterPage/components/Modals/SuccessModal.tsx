import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/ui/Modal';
import { Icon } from '@/shared/ui/Icon';
import styles from './SuccessModal.module.css';

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillId: string;
}

export const SuccessModal = ({
  isOpen,
  onClose,
  skillId,
}: SuccessModalProps) => {
  const navigate = useNavigate();

  const handleDone = useCallback(() => {
    onClose();
    navigate(`/skill/${skillId}`);
  }, [onClose, navigate, skillId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={
        <Icon name="done" size={48} className={styles.icon} aria-hidden="true" />
      }
      title="Ваше предложение создано"
      description="Теперь вы можете предложить обмен"
      buttonText="Готово"
      onButtonClick={handleDone}
      closeOnEscape
      closeOnOverlayClick
      className={styles.modal}
    />
  );
};