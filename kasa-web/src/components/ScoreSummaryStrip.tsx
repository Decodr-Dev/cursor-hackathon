const MONEY_FORMATTER = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0,
});

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 shadow-[var(--kasa-shadow-1)]">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--kasa-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[var(--kasa-text-primary)]">
        {value}
      </p>
    </article>
  );
}

export function ScoreSummaryStrip({
  summary,
}: {
  summary: {
    totalOfficials: number;
    districtsRepresented: number;
    nationalResolutionRate: number;
    estimatedCostOfInactionPerDay: number;
  };
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Officials"
        value={String(summary.totalOfficials)}
      />
      <SummaryCard
        label="Districts"
        value={String(summary.districtsRepresented)}
      />
      <SummaryCard
        label="Resolution rate"
        value={`${summary.nationalResolutionRate}%`}
      />
      <SummaryCard
        label="Cost / day"
        value={MONEY_FORMATTER.format(summary.estimatedCostOfInactionPerDay)}
      />
    </section>
  );
}
