import clsx from 'clsx';
import { useAppSelector } from '@/app/store/hooks';
import { useAuth } from '@/features/auth';
import { selectAllExchangeRequests } from '@/features/exchangeRequests/selectors';
import { selectSkillById } from '@/features/skills/selectors';

import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';

import styles from './ExchangeButton.module.css';

type Props = {
  skillId: number;
  onClick: () => void;
  onIncomingClick?: () => void;
};

export const ExchangeButton = ({ skillId, onClick, onIncomingClick }: Props) => {
  const { user: authUser } = useAuth();
  const currentUserId = authUser?.id ?? null;

  const skill = useAppSelector(selectSkillById(skillId));
  const ownerId = skill?.userId ?? null;

  const allRequests = useAppSelector(selectAllExchangeRequests);
  
  // Исходящая заявка от текущего пользователя на этот навык
  const outgoingRequest = allRequests.find(
    req => req.fromUserId === currentUserId && req.skillId === skillId && req.status === 'pending'
  );

  // Входящая заявка для текущего пользователя на этот навык
  const incomingRequest = allRequests.find(
    req => req.toUserId === currentUserId && req.skillId === skillId && req.status === 'pending'
  );

  // Проверяем, есть ли заявка от владельца этого навыка на любой навык текущего пользователя
  const ownerProposedToMe = ownerId ? allRequests.find(
    req => req.fromUserId === ownerId && req.toUserId === currentUserId && req.status === 'pending'
  ) : null;

  const isOwner = currentUserId !== null && ownerId === currentUserId;

  // Владелец навыка
  if (isOwner) {
    if (incomingRequest) {
      return (
        <Button
          variant="secondary"
          size="large"
          fullWidth
          className={clsx(styles.exchangeButton, styles.incoming)}
          startIcon={<Icon name="clock" size={20} className={styles.clockIcon} />}
          onClick={onIncomingClick || onClick}
        >
          Есть предложение обмена
        </Button>
      );
    }

    if (outgoingRequest) {
      return (
        <Button
          variant="secondary"
          size="large"
          fullWidth
          disabled
          className={clsx(styles.exchangeButton, styles.requested)}
          startIcon={<Icon name="clock" size={20} className={styles.clockIcon} />}
        >
          Вы предложили обмен
        </Button>
      );
    }

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

  // Обычный пользователь (не владелец)
  
  // Если владелец этого навыка предложил нам обмен (на любой наш навык)
  if (ownerProposedToMe) {
    return (
      <Button
        variant="secondary"
        size="large"
        fullWidth
        className={clsx(styles.exchangeButton, styles.incoming)}
        startIcon={<Icon name="clock" size={20} className={styles.clockIcon} />}
        onClick={onIncomingClick || onClick}
      >
        Вам предложили обмен
      </Button>
    );
  }

  // Проверяем входящие заявки (кто-то предложил обмен этому пользователю на этот навык)
  if (incomingRequest) {
    return (
      <Button
        variant="secondary"
        size="large"
        fullWidth
        className={clsx(styles.exchangeButton, styles.incoming)}
        startIcon={<Icon name="clock" size={20} className={styles.clockIcon} />}
        onClick={onIncomingClick || onClick}
      >
        Вам предложили обмен
      </Button>
    );
  }

  // Проверяем исходящие заявки (пользователь сам предложил обмен)
  if (outgoingRequest) {
    return (
      <Button
        variant="secondary"
        size="large"
        fullWidth
        className={clsx(styles.exchangeButton, styles.requested)}
        startIcon={<Icon name="clock" size={20} className={styles.clockIcon} />}
      >
        Обмен предложен
      </Button>
    );
  }

  // Нет заявок
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