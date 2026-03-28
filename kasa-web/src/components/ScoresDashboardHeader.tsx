export function ScoresDashboardHeader({
  nationalAverageScore,
  topPerformer,
}: {
  nationalAverageScore: number;
  topPerformer?: {
    name: string;
    entity: string;
    score: number;
  };
}) {
  return (
    <section className="rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-1)]">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--kasa-accent-soft)]">
        Accountability
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--kasa-ink)]">
            Officials &amp; agencies, scored in public
          </h1>
        </div>
        <div className="min-w-[200px] rounded-2xl bg-[var(--kasa-muted-bg)] p-4 ring-1 ring-[var(--kasa-divider)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--kasa-text-muted)]">
            National avg
          </p>
          <p className="mt-2 text-4xl font-semibold text-[var(--kasa-text-primary)]">
            {nationalAverageScore}
            <span className="text-lg text-[var(--kasa-text-secondary)]">/100</span>
          </p>
          {topPerformer ? (
            <p className="mt-2 text-xs text-[var(--kasa-text-secondary)]">
              Top:{" "}
              <span className="font-semibold text-[var(--kasa-text-primary)]">
                {topPerformer.name}
              </span>{" "}
              ({topPerformer.score})
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
