import { accountabilityBandMeta } from "@/lib/accountability-algorithms";

export function RegionScoreGrid({
  regions,
}: {
  regions: Array<{
    region: string;
    averageScore: number;
    resolutionRatePct: number;
    openProblems: number;
    officialCount: number;
    topEntity?: string;
  }>;
}) {
  return (
    <section className="space-y-4">
      <p className="text-sm text-[var(--kasa-text-secondary)]">
        A lightweight map-style view for the demo. Each tile shows a regional
        average from the public scorecards and the live issue load behind it.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {regions.map((region) => {
          const band = accountabilityBandMeta(region.averageScore);
          return (
            <article
              key={region.region}
              className="rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-1)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-[var(--kasa-text-primary)]">
                    {region.region}
                  </p>
                  <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
                    {region.officialCount} public scorecards
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${band.className}`}>
                  {band.label}
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-[var(--kasa-muted-bg)] p-4 ring-1 ring-[var(--kasa-divider)]">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
                  Average accountability
                </p>
                <p className="mt-2 text-4xl font-semibold text-[var(--kasa-text-primary)]">
                  {region.averageScore}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[var(--kasa-muted-bg)] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
                    Resolution
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--kasa-text-primary)]">
                    {region.resolutionRatePct}%
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--kasa-muted-bg)] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
                    Open issues
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--kasa-text-primary)]">
                    {region.openProblems}
                  </p>
                </div>
              </div>

              {region.topEntity ? (
                <p className="mt-4 text-sm text-[var(--kasa-text-secondary)]">
                  Leading entity:{" "}
                  <span className="font-semibold text-[var(--kasa-text-primary)]">
                    {region.topEntity}
                  </span>
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
