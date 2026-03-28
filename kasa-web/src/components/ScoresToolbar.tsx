import Link from "next/link";
import { officialTypeLabel } from "@/lib/demo-officials";

const SCORE_TYPES = [
  "all",
  "district_assembly",
  "mp",
  "agency",
  "utility",
] as const;

const SCORE_VIEWS = ["rankings", "map", "data"] as const;

function buildHref(params: {
  view: (typeof SCORE_VIEWS)[number];
  type: (typeof SCORE_TYPES)[number];
  q: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.view !== "rankings") searchParams.set("view", params.view);
  if (params.type !== "all") searchParams.set("type", params.type);
  if (params.q.trim()) searchParams.set("q", params.q.trim());
  const query = searchParams.toString();
  return query ? `/scores?${query}` : "/scores";
}

export function ScoresToolbar({
  view,
  type,
  q,
}: {
  view: (typeof SCORE_VIEWS)[number];
  type: (typeof SCORE_TYPES)[number];
  q: string;
}) {
  return (
    <section className="space-y-3 rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 shadow-[var(--kasa-shadow-1)]">
      <div className="flex flex-wrap gap-2">
        {SCORE_VIEWS.map((nextView) => {
          const active = nextView === view;
          return (
            <Link
              key={nextView}
              href={buildHref({ view: nextView, type, q })}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                active
                  ? "bg-[var(--kasa-forest)] text-black"
                  : "bg-[var(--kasa-muted-bg)] text-[var(--kasa-text-secondary)] ring-1 ring-[var(--kasa-divider)]"
              }`}
            >
              {nextView === "rankings"
                ? "Rankings"
                : nextView === "map"
                  ? "Map view"
                  : "Data view"}
            </Link>
          );
        })}
      </div>

      <form action="/scores" className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input type="hidden" name="view" value={view} />
        {type !== "all" ? <input type="hidden" name="type" value={type} /> : null}
        <label className="flex-1">
          <span className="sr-only">Search officials or entities</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search an official, assembly, district, or constituency"
            className="w-full rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-muted-bg)] px-4 py-3 text-sm text-[var(--kasa-text-primary)] outline-none transition focus:border-[var(--kasa-forest)]"
          />
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-[var(--kasa-forest)] px-4 py-3 text-sm font-semibold text-black"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {SCORE_TYPES.map((nextType) => {
          const active = nextType === type;
          return (
            <Link
              key={nextType}
              href={buildHref({ view, type: nextType, q })}
              className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                active
                  ? "bg-[var(--kasa-accent-wash)] text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-forest)]"
                  : "bg-transparent text-[var(--kasa-text-secondary)] ring-1 ring-[var(--kasa-divider)]"
              }`}
            >
              {officialTypeLabel(nextType)}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
