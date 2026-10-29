type Props = {
  title: string;
  description: string;
  items: Record<string, unknown>[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  itemRenderer?: (item: Record<string, unknown>, index: number) => string;
};

export function CapabilityCard({ title, description, items, loading, error, emptyMessage, itemRenderer }: Props) {
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
