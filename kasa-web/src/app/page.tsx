import {
  FeedCategoryChips,
  FeedSortTabs,
  FeedStatusChips,
} from "@/components/FeedDiscoverRail";
import { FeedInsertCard, pickFeedInsert } from "@/components/FeedInsertCard";
import { FeedSearchBar } from "@/components/FeedSearchBar";
import { ProblemPostCard } from "@/components/ProblemPostCard";
import { WelcomeFeedHeader } from "@/components/WelcomeFeedHeader";
import type { FeedSearchState } from "@/lib/feed-url";
import type { ReactNode } from "react";
import {
  listProblemsForFeed,
  parseFeedSort,
} from "@/server/problem-service";

export const dynamic = "force-dynamic";

function parseFeedState(sp: {
  sort?: string;
  category?: string;
  status?: string;
  q?: string;
  district?: string;
  region?: string;
}): FeedSearchState {
  const sort = parseFeedSort(sp.sort);
  const category = sp.category?.trim() ?? "";
  const statusRaw = sp.status ?? "all";
  const status =
    statusRaw === "pending" || statusRaw === "verified" ? statusRaw : "all";
  const q = sp.q ?? "";
  const district = sp.district?.trim() ?? "";
  const region = sp.region?.trim() ?? "";
  return { sort, category, status, q, district, region };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string;
    category?: string;
    status?: string;
    q?: string;
    district?: string;
    region?: string;
  }>;
}) {
  const raw = await searchParams;
  const state = parseFeedState(raw);

  const problems = await listProblemsForFeed({
    sort: state.sort,
    category: state.category || undefined,
    status: state.status,
    q: state.q || undefined,
    district: state.district || undefined,
    region: state.region || undefined,
    take: 50,
  });

  const feedNodes: ReactNode[] = [];
  problems.forEach((p, i) => {
    feedNodes.push(<ProblemPostCard key={p.id} problem={p} />);
    if ((i + 1) % 5 === 0) {
      feedNodes.push(
        <FeedInsertCard
          key={`ins-${i}`}
          kind={pickFeedInsert(Math.floor(i / 5))}
          state={state}
        />,
      );
    }
  });

  return (
    <div className="bg-[var(--kasa-bg)]">
      <main className="space-y-4 px-0 pb-6 pt-2 sm:px-0">
        <div className="px-3 sm:px-0">
          <WelcomeFeedHeader
            district={state.district || undefined}
            region={state.region || undefined}
          />
        </div>

        <div className="sticky top-[52px] z-20 border-y border-[var(--kasa-divider)] bg-[color-mix(in_oklab,var(--kasa-bg)_92%,transparent)] px-3 py-3 backdrop-blur-md lg:static lg:top-auto lg:z-auto lg:rounded-2xl lg:border lg:bg-[var(--kasa-card)] lg:shadow-[var(--kasa-shadow-1)]">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
            Categories
          </p>
          <FeedCategoryChips state={state} />
          <p className="mb-1 mt-4 text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
            Sort
          </p>
          <FeedSortTabs state={state} />
          <div className="mt-4">
            <FeedSearchBar state={state} />
          </div>
          <div className="mt-3">
            <FeedStatusChips state={state} />
          </div>
        </div>

        <section
          aria-label="Problem stream"
          className="overflow-hidden rounded-none border-y border-[var(--kasa-divider)] bg-[var(--kasa-card)] shadow-[var(--kasa-shadow-1)] sm:rounded-2xl sm:border"
        >
          {problems.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-[var(--kasa-text-secondary)]">
              Nothing matches these filters. Be the first to speak up.
            </div>
          ) : (
            feedNodes
          )}
        </section>
      </main>
    </div>
  );
}
