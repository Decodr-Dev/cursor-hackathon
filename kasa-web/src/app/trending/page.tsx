import Link from "next/link";
import { categoryEmoji, categoryLabel } from "@/lib/categories";
import { demoSeverityScore } from "@/lib/civic-metrics";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { getTrendingSnapshot } from "@/server/problem-service";

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  const snap = await getTrendingSnapshot();
  const ranked = [...snap.categories]
    .sort((a, b) => b._count.id - a._count.id)
    .slice(0, 8);

  return (
    <main className="space-y-8 px-4 py-6">
      <p className="text-sm text-[var(--kasa-text-secondary)]">
        v2 · What&apos;s spiking — demo data from your local database.
      </p>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--kasa-trending)]">
          Right now
        </h2>
        <ol className="mt-3 space-y-4">
          {ranked.map((c, i) => {
            const sev = Math.min(
              99,
              38 + c._count.id * 4 + (i === 0 ? 14 : 0),
            );
            return (
              <li
                key={c.category}
                className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 shadow-[var(--kasa-shadow-1)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-lg font-bold text-[var(--kasa-gold)]">
                    {i + 1}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-[var(--kasa-text-primary)]">
                      {categoryEmoji(c.category)} {categoryLabel(c.category)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
                      {c._count.id} reports in this demo
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--kasa-leaf)]">
                      Severity (demo): {sev}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/?category=${encodeURIComponent(c.category)}&sort=most_upvoted`}
                  className="mt-3 inline-block text-sm font-bold text-[var(--kasa-forest)] hover:underline"
                >
                  Open feed →
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--kasa-text-secondary)]">
          Rising categories
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ranked.slice(0, 6).map((c) => (
            <Link
              key={c.category}
              href={`/?category=${encodeURIComponent(c.category)}`}
              className="rounded-full bg-[var(--kasa-gold-light)] px-3 py-2 text-xs font-bold text-[var(--kasa-leaf)] ring-1 ring-[var(--kasa-forest)]/35"
            >
              🔥 {categoryLabel(c.category)} +{c._count.id}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--kasa-text-secondary)]">
          Most voices
        </h2>
        <ul className="mt-3 space-y-3">
          {snap.topVoices.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-3 py-3"
            >
              <Link
                href={`/problems/${p.id}`}
                className="font-semibold text-[var(--kasa-text-primary)] hover:underline"
              >
                {p.district} · {p.region}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--kasa-text-secondary)]">
                {p.description}
              </p>
              <p className="mt-2 text-xs font-bold text-[var(--kasa-forest)]">
                👆 {p._count.upvotes} ·{" "}
                {formatRelativeTime(p.createdAt.toISOString())}
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
          {snap.longestOpen.map(({ problem: p, daysOpen }) => {
            const sev = demoSeverityScore({
              createdAt: p.createdAt,
              status: p.status,
              upvoteCount: p._count.upvotes,
            });
            return (
              <li
                key={p.id}
                className="rounded-xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-3 py-3"
              >
                <Link
                  href={`/problems/${p.id}`}
                  className="font-semibold text-[var(--kasa-text-primary)] hover:underline"
                >
                  {p.district}
                </Link>
                <p className="text-xs text-[var(--kasa-text-secondary)]">
                  Open {daysOpen}d · severity {sev}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
