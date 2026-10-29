import { CapabilityCard } from './CapabilityCard.js';

export default function Workouts() {
  return (
    <CapabilityCard
      title="Workout suggestions"
      description="Recommend workouts from activity patterns."
      path="/api/workouts/suggestions/mona@example.com"
      dataKey="suggestions"
      emptyMessage="No workout suggestions"
      itemRenderer={(item) => String((item as { title?: string }).title ?? 'Workout') + ((item as { reason?: string }).reason ? ` - ${String((item as { reason?: string }).reason)}` : '')}
    />
  );
}
