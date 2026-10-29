import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Props = {
  title: string;
  description: string;
  path: string;
  dataKey: 'activities' | 'teams' | 'leaderboard' | 'suggestions';
  emptyMessage: string;
  itemRenderer?: (item: Record<string, unknown>, index: number) => string;
};

export function CapabilityCard({ title, description, path, dataKey, emptyMessage, itemRenderer }: Props) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getJson<Record<string, unknown>>(path)
      .then((payload) => {
        if (!isMounted) return;
        const nextItems = Array.isArray((payload as Record<string, unknown>)[dataKey])
          ? ((payload as Record<string, unknown>)[dataKey] as Record<string, unknown>[])
          : [];
        setItems(nextItems);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Unable to load data');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dataKey, path]);

  if (loading) {
    return <section className="card h-100"><div className="card-body"><h2 className="h4">{title}</h2><p>{description}</p><p role="status">Loading...</p></div></section>;
  }

  if (error) {
    return <section className="card h-100"><div className="card-body"><h2 className="h4">{title}</h2><p>{description}</p><p role="alert">{error}</p></div></section>;
  }

  if (items.length === 0) {
    return <section className="card h-100"><div className="card-body"><h2 className="h4">{title}</h2><p>{description}</p><p>{emptyMessage}</p></div></section>;
  }

  return <section className="card h-100"><div className="card-body"><h2 className="h4">{title}</h2><p>{description}</p><ul>{items.map((item, index) => <li key={index}>{itemRenderer ? itemRenderer(item, index) : String((item as { [key: string]: unknown }).title ?? (item as { [key: string]: unknown }).name ?? (item as { [key: string]: unknown }).teamName ?? JSON.stringify(item))}</li>)}</ul></div></section>;
}
