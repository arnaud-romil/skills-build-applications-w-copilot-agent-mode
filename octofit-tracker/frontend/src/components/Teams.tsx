import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Teams() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getJson<{ teams?: Record<string, unknown>[] }>('/api/teams')
      .then((payload) => {
        if (!isMounted) return;
        setItems(Array.isArray(payload.teams) ? payload.teams : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Unable to load teams');
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
      title="Teams"
      description="Manage teams and members."
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No teams"
      itemRenderer={(item) => String((item as { name?: string }).name ?? 'Team') + ((item as { members?: unknown[] }).members ? ` (${String((item as { members?: unknown[] }).members?.length ?? 0)} members)` : '')}
    />
  );
}
