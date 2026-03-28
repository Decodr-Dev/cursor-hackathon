"use client";

import Link from "next/link";
import { PROBLEM_CATEGORIES } from "@/lib/categories";
import { feedPathHref, type FeedSearchState } from "@/lib/feed-url";
import type { FeedSort } from "@/server/problem-service";

const SORT_TABS: { id: FeedSort; label: string }[] = [
  { id: "for_you", label: "For you" },
  { id: "latest", label: "Latest" },
  { id: "most_upvoted", label: "Most upvoted" },
  { id: "most_severe", label: "Most severe" },
];

export function FeedSortTabs({ state }: { state: FeedSearchState }) {
  return (
    <div
      className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Sort feed"
    >
      {SORT_TABS.map((t) => {
        const next = { ...state, sort: t.id };
        const href = feedPathHref(next);
        const on = state.sort === t.id;
        return (
          <Link
            key={t.id}
            href={href}
            role="tab"
            aria-selected={on}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold sm:text-sm ${
              on
                ? "bg-[var(--kasa-gold)] text-[var(--kasa-gold-on)] shadow-[var(--kasa-shadow-1)]"
                : "text-[var(--kasa-text-secondary)] hover:bg-[var(--kasa-muted-bg)]"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}

export function FeedStatusChips({ state }: { state: FeedSearchState }) {
  const chips: { id: FeedSearchState["status"]; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Unresolved" },
    { id: "verified", label: "Verified" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => {
        const next = { ...state, status: c.id };
        const href = feedPathHref(next);
        const on = state.status === c.id;
        return (
          <Link
            key={c.id}
            href={href}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              on
                ? "bg-[var(--kasa-forest)] text-white shadow-[var(--kasa-shadow-1)]"
                : "bg-[var(--kasa-card)] text-[var(--kasa-text-secondary)] ring-1 ring-[var(--kasa-divider)]"
            }`}
          >
            {c.label}
          </Link>
        );
      })}
    </div>
  );
}

export function FeedCategoryChips({ state }: { state: FeedSearchState }) {
  const clearCat = { ...state, category: "" };
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Categories"
    >
      <Link
        href={feedPathHref(clearCat)}
        className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold sm:text-sm ${
          !state.category
            ? "bg-[var(--kasa-gold-light)] text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-gold)]/40"
            : "bg-[var(--kasa-card)] text-[var(--kasa-text-secondary)] ring-1 ring-[var(--kasa-divider)]"
        }`}
      >
        All
      </Link>
      {PROBLEM_CATEGORIES.map((c) => {
        const next = { ...state, category: c.slug };
        const href = feedPathHref(next);
        const on = state.category === c.slug;
        return (
          <Link
            key={c.slug}
            href={href}
            className={`max-w-[11rem] shrink-0 truncate rounded-full px-3 py-2 text-xs font-semibold sm:text-sm ${
              on
                ? "bg-[var(--kasa-gold-light)] text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-gold)]/40"
                : "bg-[var(--kasa-card)] text-[var(--kasa-text-secondary)] ring-1 ring-[var(--kasa-divider)]"
            }`}
          >
            {c.emoji} {c.label}
          </Link>
        );
      })}
    </div>
  );
}
