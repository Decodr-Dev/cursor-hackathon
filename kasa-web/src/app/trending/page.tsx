import Link from "next/link";
import { categoryEmoji, categoryLabel } from "@/lib/categories";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { getTrendingSnapshot } from "@/server/problem-service";

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  const snap = await getTrendingSnapshot();
  const ranked = snap.categories.slice(0, 8);

  return (
    <main className="space-y-8 px-4 py-6">
      <p className="text-sm text-[var(--kasa-text-secondary)]">
        v2 - Live category momentum using report volume, recent activity, and
        verification signals.
      </p>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--kasa-trending)]">
          Right now
        </h2>
        <ol className="mt-3 space-y-4">
          {ranked.map((category, index) => (
            <li
              key={category.category}
              className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 shadow-[var(--kasa-shadow-1)]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-lg font-bold text-[var(--kasa-gold)]">
                  {index + 1}.
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-[var(--kasa-text-primary)]">
                    {categoryEmoji(category.category)}{" "}
                    {categoryLabel(category.category)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
                    {category.reports} reports in this demo
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--kasa-leaf)]">
                    Pulse {category.trendPulse} | avg severity {category.avgSeverity}
                  </p>
                </div>
              </div>
              <Link
                href={`/?category=${encodeURIComponent(category.category)}&sort=most_upvoted`}
                className="mt-3 inline-block text-sm font-bold text-[var(--kasa-forest)] hover:underline"
              >
                Open feed {"->"}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--kasa-text-secondary)]">
          Rising categories
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ranked.slice(0, 6).map((category) => (
            <Link
              key={category.category}
              href={`/?category=${encodeURIComponent(category.category)}`}
              className="rounded-full bg-[var(--kasa-gold-light)] px-3 py-2 text-xs font-bold text-[var(--kasa-leaf)] ring-1 ring-[var(--kasa-forest)]/35"
            >
              Rising {categoryLabel(category.category)} +{category.reports}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--kasa-text-secondary)]">
          Most voices
        </h2>
        <ul className="mt-3 space-y-3">
          {snap.topVoices.map((problem) => (
            <li
              key={problem.id}
              className="rounded-xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-3 py-3"
            >
              <Link
                href={`/problems/${problem.id}`}
                className="font-semibold text-[var(--kasa-text-primary)] hover:underline"
              >
                {problem.district} - {problem.region}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--kasa-text-secondary)]">
                {problem.description}
              </p>
              <p className="mt-2 text-xs font-bold text-[var(--kasa-forest)]">
                Voices {problem._count.upvotes} -{" "}
                {formatRelativeTime(problem.createdAt.toISOString())}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--kasa-text-secondary)]">
          Longest unresolved
        </h2>
        <ul className="mt-3 space-y-3">
          {snap.longestOpen.map(({ problem, daysOpen }) => {
            const severity = snap.severityMap[problem.id]?.severityScore ?? 0;

            return (
              <li
                key={problem.id}
                className="rounded-xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-3 py-3"
              >
                <Link
                  href={`/problems/${problem.id}`}
                  className="font-semibold text-[var(--kasa-text-primary)] hover:underline"
                >
                  {problem.district}
                </Link>
                <p className="text-xs text-[var(--kasa-text-secondary)]">
                  Open {daysOpen}d - severity {severity}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
