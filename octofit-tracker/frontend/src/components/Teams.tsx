import { CapabilityCard } from './CapabilityCard.js';

export default function Teams() {
  return (
    <CapabilityCard
      title="Teams"
      description="Manage teams and members."
      path="/api/teams"
      dataKey="teams"
      emptyMessage="No teams"
      itemRenderer={(item) => String((item as { name?: string }).name ?? 'Team') + ((item as { members?: unknown[] }).members ? ` (${String((item as { members?: unknown[] }).members?.length ?? 0)} members)` : '')}
    />
  );
}
