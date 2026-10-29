import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Leaderboard() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getJson<{ leaderboard?: Record<string, unknown>[] }>('/api/leaderboard')
      .then((payload) => {
        if (!isMounted) return;
        setItems(Array.isArray(payload.leaderboard) ? payload.leaderboard : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Unable to load leaderboard');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CapabilityCard
      title="Leaderboard"
      description="Compare team point totals."
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No leaderboard"
      itemRenderer={(item) => `${String((item as { teamName?: string }).teamName ?? 'Team')}: ${String((item as { totalPoints?: number }).totalPoints ?? 0)}`}
    />
  );
}
