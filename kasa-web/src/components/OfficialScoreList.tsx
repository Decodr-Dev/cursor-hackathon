import { OfficialScoreCard } from "@/components/OfficialScoreCard";
import type { OfficialScorecard } from "@/server/accountability-service";

export function OfficialScoreList({
  scorecards,
}: {
  scorecards: OfficialScorecard[];
}) {
  if (scorecards.length === 0) {
    return (
      <section className="rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-6 text-sm text-[var(--kasa-text-secondary)] shadow-[var(--kasa-shadow-1)]">
        No officials match that search yet. Try a region, district, or entity
        name instead.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {scorecards.map((scorecard) => (
        <OfficialScoreCard key={scorecard.id} scorecard={scorecard} />
      ))}
    </section>
  );
}
