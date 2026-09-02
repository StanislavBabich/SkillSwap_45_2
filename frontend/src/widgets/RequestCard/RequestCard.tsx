import { useAvatar } from '@/shared/hooks/useAvatar';
import { Button, Headline, Tag } from '@/shared/ui';
import type { SkillShareRequest, SkillShareRequestStatus } from '@/entities/request/types';
import styles from './RequestCard.module.css';

type RequestCardProps = {
  request: SkillShareRequest;
  direction: 'incoming' | 'outgoing';
  isUpdating?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
};

const statusLabels: Record<SkillShareRequestStatus, string> = {
  pending: 'Awaiting response',
  accepted: 'Accepted',
  rejected: 'Declined',
  inProgress: 'Swap started',
  done: 'Completed',
};

const RequestAvatar = ({
  email,
  src,
  name,
}: {
  email: string;
  src: string | null;
  name: string;
}) => {
  const fallback = useAvatar({ email, size: 64 });
  return <img className={styles.avatar} src={src || fallback} alt={`Avatar: ${name}`} />;
};

export const RequestCard = ({
  request,
  direction,
  isUpdating = false,
  onAccept,
  onReject,
  onDelete,
}: RequestCardProps) => {
  const person = direction === 'incoming' ? request.sender : request.receiver;
  const isPending = request.status === 'pending';
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(request.createdAt));

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <RequestAvatar email={person.email} src={person.avatar} name={person.name} />
        <div className={styles.person}>
          <Headline level={3} className={styles.name}>
            {person.name}
          </Headline>
          <time className={styles.date} dateTime={request.createdAt}>
            {formattedDate}
          </time>
        </div>
      </div>

      <div className={styles.skillsSections}>
        <div className={styles.section}>
          <Headline level={4} className={styles.sectionTitle}>
            Offers:
          </Headline>
          <Tag className={styles.skillTag}>{request.offeredSkill.title}</Tag>
        </div>

        <div className={styles.section}>
          <Headline level={4} className={styles.sectionTitle}>
            Wants to learn:
          </Headline>
          <Tag className={styles.skillTag}>{request.requestedSkill.title}</Tag>
        </div>
      </div>

      <div className={styles.statusRow}>
        <span className={styles.statusLabel}>Status</span>
        <Tag className={`${styles.status} ${styles[request.status]}`}>
          {statusLabels[request.status]}
        </Tag>
      </div>

      <div className={styles.actions}>
        {direction === 'incoming' && isPending && (
          <>
            <Button fullWidth variant="primary" disabled={isUpdating} onClick={onAccept}>
              Accept
            </Button>
            <Button fullWidth variant="secondary" disabled={isUpdating} onClick={onReject}>
              Decline
            </Button>
          </>
        )}
        {direction === 'outgoing' && (
          <Button fullWidth variant="secondary" disabled={isUpdating} onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </article>
  );
};
