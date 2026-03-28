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
      <div className="mx-3 my-2 rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 sm:mx-0">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-accent-soft)]">
          Trending
        </p>
        <p className="mt-1.5 text-sm text-[var(--kasa-text-secondary)]">
          See what categories are rising and which reports have the most voices.
        </p>
        <Link
          href="/trending"
          className="mt-3 inline-block text-sm font-semibold text-[var(--kasa-accent)] hover:underline"
        >
          Open trending →
        </Link>
      </div>
    );
  }

  if (kind === "scores") {
    return (
      <div className="mx-3 my-2 rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 sm:mx-0">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-secondary)]">
          Accountability
        </p>
        <p className="mt-1.5 text-sm text-[var(--kasa-text-secondary)]">
          Public scorecards for officials, assemblies, and agencies.
        </p>
        <Link
          href="/scores"
          className="mt-3 inline-block text-sm font-semibold text-[var(--kasa-accent)] hover:underline"
        >
          See scores →
        </Link>
      </div>
    );
  }

  const href = feedPathHref({ ...state, category: "", sort: "latest" });

  return (
    <div className="mx-3 my-2 rounded-2xl border border-[var(--kasa-accent)]/30 bg-[var(--kasa-accent-wash)] p-4 sm:mx-0">
      <p className="text-sm font-semibold text-[var(--kasa-text-primary)]">
        Not seeing your issue?
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/problems/new"
          className="rounded-xl bg-[var(--kasa-accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Report it
        </Link>
        <Link
          href={href}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--kasa-text-secondary)] ring-1 ring-[var(--kasa-divider)]"
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
