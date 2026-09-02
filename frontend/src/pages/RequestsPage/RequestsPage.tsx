import { useCallback, useEffect, useState } from 'react';
import type { SkillShareRequest } from '@/entities/request/types';
import { requestsApi } from '@/entities/request/api';
import { ProfileMenu } from '@/pages/ProfilePage/components/ProfileMenu/ProfileMenu';
import { RequestCard } from '@/widgets/RequestCard';
import styles from './RequestsPage.module.css';

type Tab = 'incoming' | 'outgoing';

export const RequestsPage = () => {
  const [tab, setTab] = useState<Tab>('incoming');
  const [requests, setRequests] = useState<SkillShareRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const items =
        tab === 'incoming' ? await requestsApi.getIncoming() : await requestsApi.getOutgoing();
      setRequests(items);
      if (tab === 'incoming') {
        const unread = items.filter((item) => !item.isRead);
        await Promise.allSettled(unread.map((item) => requestsApi.markAsRead(item.id)));
        if (unread.length)
          setRequests((current) => current.map((item) => ({ ...item, isRead: true })));
      }
    } catch (error) {
      setMessage({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Failed to load requests',
      });
    } finally {
      setIsLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const performAction = async (
    id: SkillShareRequest['id'],
    action: 'accept' | 'reject' | 'delete'
  ) => {
    setUpdatingId(id);
    setMessage(null);
    try {
      if (action === 'accept') await requestsApi.accept(id);
      if (action === 'reject') await requestsApi.reject(id);
      if (action === 'delete') await requestsApi.remove(id);
      setMessage({
        kind: 'success',
        text:
          action === 'accept'
            ? 'Request accepted, skills added to favorites'
            : action === 'reject'
              ? 'Request declined'
              : 'Request deleted',
      });
      const items =
        tab === 'incoming' ? await requestsApi.getIncoming() : await requestsApi.getOutgoing();
      setRequests(items);
    } catch (error) {
      setMessage({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Failed to perform action',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className={styles.page}>
      <aside className={styles.menuCard}>
        <ProfileMenu />
      </aside>
      <div className={styles.content}>
        <h1 className={styles.title}>Requests</h1>
        <div className={styles.tabs} role="tablist" aria-label="Request type">
          <button
            className={tab === 'incoming' ? styles.activeTab : styles.tab}
            role="tab"
            aria-selected={tab === 'incoming'}
            onClick={() => setTab('incoming')}
          >
            Incoming
          </button>
          <button
            className={tab === 'outgoing' ? styles.activeTab : styles.tab}
            role="tab"
            aria-selected={tab === 'outgoing'}
            onClick={() => setTab('outgoing')}
          >
            Outgoing
          </button>
        </div>
        {message && (
          <p className={message.kind === 'error' ? styles.error : styles.success} role="status">
            {message.text}
          </p>
        )}
        {isLoading ? (
          <p className={styles.state}>Loading...</p>
        ) : requests.length === 0 ? (
          <p className={styles.state}>
            {tab === 'incoming'
              ? 'You have no active incoming requests'
              : 'You have no active outgoing requests'}
          </p>
        ) : (
          <div className={styles.list}>
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                direction={tab}
                isUpdating={updatingId === request.id}
                onAccept={() => void performAction(request.id, 'accept')}
                onReject={() => void performAction(request.id, 'reject')}
                onDelete={() => void performAction(request.id, 'delete')}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
