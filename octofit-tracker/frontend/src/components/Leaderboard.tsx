import { CapabilityCard } from './CapabilityCard.js';

export default function Leaderboard() {
  return (
    <CapabilityCard
      title="Leaderboard"
      description="Compare team point totals."
      path="/api/leaderboard"
      dataKey="leaderboard"
      emptyMessage="No leaderboard"
      itemRenderer={(item) => `${String((item as { teamName?: string }).teamName ?? 'Team')}: ${String((item as { totalPoints?: number }).totalPoints ?? 0)}`}
    />
  );
}
