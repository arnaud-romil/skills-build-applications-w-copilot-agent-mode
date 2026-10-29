import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Workouts() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getJson<{ suggestions?: Record<string, unknown>[] }>('/api/workouts/suggestions/mona@example.com')
      .then((payload) => {
        if (!isMounted) return;
        setItems(Array.isArray(payload.suggestions) ? payload.suggestions : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Unable to load workout suggestions');
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
      title="Workout suggestions"
      description="Recommend workouts from activity patterns."
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No workout suggestions"
      itemRenderer={(item) => String((item as { title?: string }).title ?? 'Workout') + ((item as { reason?: string }).reason ? ` - ${String((item as { reason?: string }).reason)}` : '')}
    />
  );
}
