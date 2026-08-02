import clsx from 'clsx';
import { useAuth } from '@/features/auth';

import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';

import styles from './ExchangeButton.module.css';

type Props = {
  skillId: string;
  onClick: () => void;
  onIncomingClick?: () => void;
};

export const ExchangeButton = ({ skillId, onClick, onIncomingClick }: Props) => {
  const { user: authUser } = useAuth();
  const currentUserId = authUser?.id ?? null;

  // TODO: заменить на API-запросы для проверки заявок
  const isOwner = false; // временно
  const outgoingRequest = null;
  const incomingRequest = null;

  if (isOwner) {
    return (
      <Button
        variant="secondary"
        size="large"
        fullWidth
        disabled
        className={styles.exchangeButton}
      >
        Это ваш навык
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="large"
      fullWidth
      className={styles.exchangeButton}
      onClick={onClick}
    >
      Предложить обмен
    </Button>
  );
};