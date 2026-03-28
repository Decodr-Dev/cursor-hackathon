"use client";

import type { FeedSearchState } from "@/lib/feed-url";

export function FeedSearchBar({ state }: { state: FeedSearchState }) {
  return (
    <form method="get" action="/" className="flex gap-2">
      {state.sort !== "latest" ? (
        <input type="hidden" name="sort" value={state.sort} />
      ) : null}
      {state.category ? (
        <input type="hidden" name="category" value={state.category} />
      ) : null}
      {state.status !== "all" ? (
        <input type="hidden" name="status" value={state.status} />
      ) : null}
      {state.district.trim() ? (
        <input type="hidden" name="district" value={state.district.trim()} />
      ) : null}
      {state.region.trim() ? (
        <input type="hidden" name="region" value={state.region.trim()} />
      ) : null}
      <input
        name="q"
        defaultValue={state.q}
        placeholder="Search problems, places…"
        className="min-w-0 flex-1 rounded-lg border border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-3 py-2 text-sm text-[var(--kasa-text-primary)] outline-none focus:ring-2 focus:ring-[var(--kasa-forest)]"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-[var(--kasa-deep-green)] px-4 py-2 text-sm font-semibold text-white"
      >
        Search
      </button>
    </form>
  );
}
