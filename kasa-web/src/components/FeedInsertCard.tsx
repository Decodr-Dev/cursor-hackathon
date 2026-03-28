import Link from "next/link";
import type { FeedSearchState } from "@/lib/feed-url";
import { feedPathHref } from "@/lib/feed-url";

type InsertKind = "trending" | "scores" | "report";

export function FeedInsertCard({
  kind,
  state,
}: {
  kind: InsertKind;
  state: FeedSearchState;
}) {
  if (kind === "trending") {
    return (
      <div className="mx-3 my-2 rounded-2xl border border-[var(--kasa-divider)] bg-gradient-to-br from-[var(--kasa-muted-bg)] to-[var(--kasa-card)] p-4 sm:mx-0">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-trending)]">
          Trending in your area
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--kasa-text-primary)]">
          See what categories are spiking and which reports have the most
          voices.
        </p>
        <Link
          href="/trending"
          className="mt-3 inline-block text-sm font-semibold text-[var(--kasa-forest)] hover:underline"
        >
          Open trending →
        </Link>
      </div>
    );
  }
  if (kind === "scores") {
    return (
      <div className="mx-3 my-2 rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 shadow-[var(--kasa-shadow-1)] sm:mx-0">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-secondary)]">
          Accountability spotlight
        </p>
        <p className="mt-2 text-sm text-[var(--kasa-text-primary)]">
          Officials get a public scorecard. Explore how the full product surfaces
          performance.
        </p>
        <Link
          href="/scores"
          className="mt-3 inline-block text-sm font-semibold text-[var(--kasa-forest)] hover:underline"
        >
          See scores →
        </Link>
      </div>
    );
  }
  const href = feedPathHref({ ...state, category: "", sort: "latest" });
  return (
    <div className="mx-3 my-2 rounded-2xl border border-dashed border-[var(--kasa-gold)]/60 bg-[var(--kasa-gold-light)]/40 p-4 sm:mx-0">
      <p className="text-sm font-semibold text-[var(--kasa-text-primary)]">
        Something missing from the stream?
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/problems/new"
          className="rounded-xl bg-[var(--kasa-gold)] px-4 py-2 text-sm font-semibold text-[var(--kasa-gold-on)]"
        >
          Report it
        </Link>
        <Link
          href={href}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--kasa-forest)] ring-1 ring-[var(--kasa-forest)]"
        >
          Clear filters
        </Link>
      </div>
    </div>
  );
}

const ROTATION: InsertKind[] = ["trending", "scores", "report"];

export function pickFeedInsert(i: number): InsertKind {
  return ROTATION[i % ROTATION.length]!;
}
