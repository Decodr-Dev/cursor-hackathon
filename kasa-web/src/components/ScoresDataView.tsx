import Link from "next/link";
import { PROGRESS_STAGE_META, type ProblemProgressStage } from "@/lib/problem-progress";

const MONEY_FORMATTER = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0,
});

export function ScoresDataView({
  categoryBreakdown,
  stageFunnel,
  topProblems,
}: {
  categoryBreakdown: Array<{
    category: string;
    label: string;
    totalProblems: number;
    resolutionRatePct: number;
    avgSeverity: number;
    estimatedCostPerDay: number;
  }>;
  stageFunnel: Record<ProblemProgressStage, number>;
  topProblems: Array<{
    id: string;
    district: string;
    region: string;
    description: string;
    severityScore: number;
    costOfInactionPerDay: number;
    progressStage: ProblemProgressStage;
  }>;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <article className="rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-1)]">
          <p className="text-sm font-semibold text-[var(--kasa-text-primary)]">
            Resolution funnel
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {Object.entries(stageFunnel).map(([stage, count]) => (
              <div key={stage} className="rounded-2xl bg-[var(--kasa-muted-bg)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
                  {PROGRESS_STAGE_META[stage as ProblemProgressStage].shortLabel}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--kasa-text-primary)]">
                  {count}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-1)]">
          <p className="text-sm font-semibold text-[var(--kasa-text-primary)]">
            Category breakdown
          </p>
          <div className="mt-4 space-y-3">
            {categoryBreakdown.map((category) => (
              <div
                key={category.category}
                className="rounded-2xl bg-[var(--kasa-muted-bg)] p-4 ring-1 ring-[var(--kasa-divider)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[var(--kasa-text-primary)]">
                      {category.label}
                    </p>
                    <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
                      {category.totalProblems} tracked issues
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--kasa-text-primary)]">
                      Severity {category.avgSeverity}
                    </p>
                    <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
                      Resolution {category.resolutionRatePct}%
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[var(--kasa-text-secondary)]">
                  Estimated cost of inaction per day:{" "}
                  <span className="font-semibold text-[var(--kasa-text-primary)]">
                    {MONEY_FORMATTER.format(category.estimatedCostPerDay)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="space-y-4">
        <article className="rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-1)]">
          <p className="text-sm font-semibold text-[var(--kasa-text-primary)]">
            Top unresolved problems
          </p>
          <div className="mt-4 space-y-3">
            {topProblems.map((problem) => (
              <Link
                key={problem.id}
                href={`/problems/${problem.id}`}
                className="block rounded-2xl bg-[var(--kasa-muted-bg)] p-4 ring-1 ring-[var(--kasa-divider)] transition hover:ring-[var(--kasa-forest)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--kasa-text-primary)]">
                      {problem.district}, {problem.region}
                    </p>
                    <p className="mt-1 line-clamp-3 text-sm text-[var(--kasa-text-secondary)]">
                      {problem.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[var(--kasa-text-primary)]">
                      {problem.severityScore}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--kasa-text-muted)]">
                      severity
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[var(--kasa-text-secondary)]">
                  {PROGRESS_STAGE_META[problem.progressStage].label} -{" "}
                  {MONEY_FORMATTER.format(problem.costOfInactionPerDay)} / day
                </p>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 text-sm text-[var(--kasa-text-secondary)] shadow-[var(--kasa-shadow-1)]">
          <p className="font-semibold text-[var(--kasa-text-primary)]">
            Algorithm notes
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              Accountability score = 20% acknowledgement, 40% resolution,
              25% timeliness, 15% response quality.
            </li>
            <li>
              Severity score uses reporter volume, district spread, time open,
              acceleration, and escalation state.
            </li>
            <li>
              Cost of inaction is a demo estimate that scales with severity and
              affected reporters by category.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
