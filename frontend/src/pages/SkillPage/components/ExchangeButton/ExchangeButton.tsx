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
  pending: 'Request awaiting response',
  accepted: 'Request accepted',
  inProgress: 'Swap started',
};

export const ExchangeButton = ({ onClick, isOwner, activeStatus, hasOfferedSkill }: Props) => {
  const { user: authUser } = useAuth();

  if (isOwner) {
    return (
      <Button variant="secondary" size="large" fullWidth disabled className={styles.exchangeButton}>
        This is your skill
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
        Log in to propose a swap
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
        Add your skill to swap
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
      Propose a swap
    </Button>
  );
};
