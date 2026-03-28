import { OfficialScoreList } from "@/components/OfficialScoreList";
import { RegionScoreGrid } from "@/components/RegionScoreGrid";
import { ScoresDashboardHeader } from "@/components/ScoresDashboardHeader";
import { ScoresDataView } from "@/components/ScoresDataView";
import { ScoreSummaryStrip } from "@/components/ScoreSummaryStrip";
import { ScoresToolbar } from "@/components/ScoresToolbar";
import { parseOfficialType } from "@/lib/demo-officials";
import { getPublicScoreDashboard } from "@/server/accountability-service";

export const dynamic = "force-dynamic";

function parseView(raw: string | undefined) {
  if (raw === "map" || raw === "data") return raw;
  return "rankings";
}

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const type = parseOfficialType(params.type);
  const view = parseView(params.view);
  const dashboard = await getPublicScoreDashboard({
    q: q || undefined,
    type,
  });

  return (
    <main className="space-y-4 px-4 py-6">
      <ScoresDashboardHeader
        nationalAverageScore={dashboard.summary.nationalAverageScore}
        topPerformer={dashboard.summary.topPerformer}
      />

      <ScoresToolbar view={view} type={type} q={q} />

      <ScoreSummaryStrip summary={dashboard.summary} />

      {view === "rankings" ? (
        <OfficialScoreList scorecards={dashboard.scorecards} />
      ) : null}

      {view === "map" ? (
        <RegionScoreGrid regions={dashboard.regionAverages} />
      ) : null}

      {view === "data" ? (
        <ScoresDataView
          categoryBreakdown={dashboard.categoryBreakdown}
          stageFunnel={dashboard.stageFunnel}
          topProblems={dashboard.topProblems}
        />
      ) : null}
    </main>
  );
}
