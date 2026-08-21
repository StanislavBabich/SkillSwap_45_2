import { useAuth } from '@/features/auth';

import { Button } from '@/shared/ui/Button';
import type { SkillShareRequestStatus } from '@/entities/request/types';

import styles from './ExchangeButton.module.css';

type Props = {
  skillId: string;
  onClick: () => void;
  onIncomingClick?: () => void;
  isOwner: boolean;
  activeStatus?: SkillShareRequestStatus | null;
  hasOfferedSkill: boolean;
};

const statusText: Partial<Record<SkillShareRequestStatus, string>> = {
  pending: 'Заявка ожидает ответа',
  accepted: 'Заявка принята',
  inProgress: 'Обмен начат',
};

export const ExchangeButton = ({ onClick, isOwner, activeStatus, hasOfferedSkill }: Props) => {
  const { user: authUser } = useAuth();

  if (isOwner) {
    return (
      <Button variant="secondary" size="large" fullWidth disabled className={styles.exchangeButton}>
        Это ваш навык
      </Button>
    );
  }

  if (!authUser) {
    return (
      <Button
        variant="primary"
        size="large"
        fullWidth
        className={styles.exchangeButton}
        onClick={onClick}
      >
        Войти, чтобы предложить обмен
      </Button>
    );
  }

  if (activeStatus && statusText[activeStatus]) {
    return (
      <Button variant="secondary" size="large" fullWidth disabled className={styles.exchangeButton}>
        {statusText[activeStatus]}
      </Button>
    );
  }

  if (!hasOfferedSkill) {
    return (
      <Button variant="secondary" size="large" fullWidth disabled className={styles.exchangeButton}>
        Добавьте свой навык для обмена
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
