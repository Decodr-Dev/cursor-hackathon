import { formatTrendDelta } from "@/lib/accountability-algorithms";
import type { OfficialScorecard } from "@/server/accountability-service";

function singularTypeLabel(type: OfficialScorecard["type"]) {
  if (type === "district_assembly") return "Assembly";
  if (type === "mp") return "MP";
  if (type === "agency") return "Agency";
  return "Utility";
}

export function OfficialScoreCard({
  scorecard,
}: {
  scorecard: OfficialScorecard;
}) {
  return (
    <article className="rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-1)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--kasa-muted-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--kasa-text-secondary)]">
              #{scorecard.rank}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${scorecard.bandClassName}`}
            >
              {scorecard.bandLabel}
            </span>
            <span className="rounded-full bg-[var(--kasa-accent-wash)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--kasa-text-primary)]">
              {singularTypeLabel(scorecard.type)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--kasa-text-primary)]">
              {scorecard.name}
            </h2>
            <p className="text-sm text-[var(--kasa-text-secondary)]">
              {scorecard.title} · {scorecard.entity}
            </p>
            <p className="mt-1 text-sm text-[var(--kasa-text-muted)]">
              {scorecard.district}, {scorecard.region}
              {scorecard.constituency ? ` · ${scorecard.constituency}` : ""}
            </p>
          </div>
        </div>

        <div className="min-w-[120px] rounded-2xl bg-[var(--kasa-muted-bg)] p-4 text-right ring-1 ring-[var(--kasa-divider)]">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
            Score
          </p>
          <p className="mt-2 text-4xl font-semibold text-[var(--kasa-text-primary)]">
            {scorecard.score}
          </p>
          <p
            className={`mt-1 text-sm font-semibold ${
              scorecard.trendDelta >= 0
                ? "text-[var(--kasa-accent)]"
                : "text-[var(--kasa-text-secondary)]"
            }`}
          >
            {formatTrendDelta(scorecard.trendDelta)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-[var(--kasa-muted-bg)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
            Resolution
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--kasa-text-primary)]">
            {scorecard.metrics.resolutionRatePct}%
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--kasa-muted-bg)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
            Acknowledged
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--kasa-text-primary)]">
            {scorecard.metrics.acknowledgementRatePct}%
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--kasa-muted-bg)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
            Avg days
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--kasa-text-primary)]">
            {scorecard.metrics.avgResolutionDays}
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--kasa-muted-bg)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
            Quality
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--kasa-text-primary)]">
            {scorecard.metrics.responseQualityRating}/5
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <p className="text-sm text-[var(--kasa-text-muted)]">
          {scorecard.linkedProblemIds.length} linked ·{" "}
          {scorecard.metrics.openProblems} open
        </p>

        <div className="flex items-end gap-1">
          {scorecard.scoreHistory.map((value, index) => (
            <span
              key={`${scorecard.id}-${index}`}
              className="w-3 rounded-full bg-[var(--kasa-accent)]/70"
              style={{ height: `${Math.max(20, value)}px` }}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </article>
  );
}
