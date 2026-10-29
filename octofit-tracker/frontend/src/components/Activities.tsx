import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Activities() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getJson<{ activities?: Record<string, unknown>[] }>('/api/activities')
      .then((payload) => {
        if (!isMounted) return;
        setItems(Array.isArray(payload.activities) ? payload.activities : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Unable to load activities');
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
      title="Activities"
      description="Track student activity minutes and points."
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No activities"
      itemRenderer={(item) => String((item as { type?: string; minutes?: number; points?: number }).type ?? 'Activity') + ` ${String((item as { minutes?: number }).minutes ?? '')}` + ((item as { points?: number }).points !== undefined ? ` (${String((item as { points?: number }).points)} pts)` : '')}
    />
  );
}
