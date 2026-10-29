import { CapabilityCard } from './CapabilityCard.js';

export default function Activities() {
  return (
    <CapabilityCard
      title="Activities"
      description="Track student activity minutes and points."
      path="/api/activities"
      dataKey="activities"
      emptyMessage="No activities"
      itemRenderer={(item) => String((item as { type?: string; minutes?: number; points?: number }).type ?? 'Activity') + ` ${String((item as { minutes?: number }).minutes ?? '')}` + ((item as { points?: number }).points !== undefined ? ` (${String((item as { points?: number }).points)} pts)` : '')}
    />
  );
}
