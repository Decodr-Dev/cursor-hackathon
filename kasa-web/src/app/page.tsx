import { FeedInsertCard, pickFeedInsert } from "@/components/FeedInsertCard";
import { ProblemFeedStream } from "@/components/ProblemFeedStream";
import { ProblemPostCard } from "@/components/ProblemPostCard";
import { WelcomeFeedHeader } from "@/components/WelcomeFeedHeader";
import type { FeedSearchState } from "@/lib/feed-url";
import type { ReactNode } from "react";
import { getProblemProgressMap } from "@/server/problem-progress";
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
  const progressMap = await getProblemProgressMap(
    problems.map((problem) => ({
      id: problem.id,
      status: problem.status,
    })),
  );

  const feedNodes: ReactNode[] = [];
  problems.forEach((p, i) => {
    feedNodes.push(
      <ProblemPostCard
        key={p.id}
        problem={p}
        progressStage={progressMap[p.id].stage}
      />,
    );
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
      <main className="space-y-3 px-0 pb-6 pt-2 sm:px-0">
        <div className="px-3 sm:px-0">
          <WelcomeFeedHeader
            district={state.district || undefined}
            region={state.region || undefined}
          />
        </div>

        <ProblemFeedStream hasItems={problems.length > 0}>
          {feedNodes}
        </ProblemFeedStream>
      </main>
    </div>
  );
}
