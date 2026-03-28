"use client";

import { useEffect } from "react";
import {
  FeedCategoryChips,
  FeedSortTabs,
  FeedStatusChips,
} from "@/components/FeedDiscoverRail";
import { FeedSearchBar } from "@/components/FeedSearchBar";
import { feedPathHref, type FeedSearchState } from "@/lib/feed-url";

type Props = {
  open: boolean;
  onClose: () => void;
  state: FeedSearchState;
};

export function FeedFiltersSheet({ open, onClose, state }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  if (!open) return null;

  const clearState: FeedSearchState = {
    ...state,
    sort: "latest",
    category: "",
    status: "all",
    q: "",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/45">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close filters"
        onClick={onClose}
      />
      <aside
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-4 py-5 shadow-[var(--kasa-shadow-3)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-filters-title"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--kasa-text-muted)]">
              Feed
            </p>
            <h2
              id="feed-filters-title"
              className="mt-1 text-lg font-semibold text-[var(--kasa-text-primary)]"
            >
              Filters
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--kasa-divider)] px-3 py-1.5 text-sm font-semibold text-[var(--kasa-text-secondary)] hover:bg-[var(--kasa-muted-bg)]"
          >
            Close
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-muted-bg)] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[var(--kasa-text-primary)]">
              Narrow what you see
            </p>
            <a
              href={feedPathHref(clearState)}
              className="text-sm font-semibold text-[var(--kasa-forest)] hover:underline"
            >
              Reset
            </a>
          </div>
          <div className="mt-4">
            <FeedSearchBar state={state} />
          </div>
        </div>

        <section className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
            Sort
          </p>
          <FeedSortTabs state={state} />
        </section>

        <section className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
            Status
          </p>
          <FeedStatusChips state={state} />
        </section>

        <section className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
            Category
          </p>
          <FeedCategoryChips state={state} />
        </section>
      </aside>
    </div>
  );
}
