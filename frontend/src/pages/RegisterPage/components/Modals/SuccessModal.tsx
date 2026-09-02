import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/ui/Modal';
import { Icon } from '@/shared/ui/Icon';
import styles from './SuccessModal.module.css';

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal = ({
  isOpen,
  onClose,
}: SuccessModalProps) => {
  const navigate = useNavigate();

  const handleDone = useCallback(() => {
    onClose();
    navigate('/profile');
  }, [onClose, navigate]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={
        <Icon name="done" size={48} className={styles.icon} aria-hidden="true" />
      }
      title="Sign-up complete!"
      description="Your profile has been created."
      buttonText="Done"
      onButtonClick={handleDone}
      closeOnEscape
      closeOnOverlayClick
      className={styles.modal}
    />
  );
};