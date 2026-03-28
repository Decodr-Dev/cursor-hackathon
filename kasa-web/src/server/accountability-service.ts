import { prisma } from "@/lib/prisma";
import { categoryLabel } from "@/lib/categories";
import {
  accountabilityBandMeta,
  buildScoreHistory,
  calculateAccountabilityScore,
} from "@/lib/accountability-algorithms";
import {
  buildProblemSeveritySnapshots,
  type ProblemSeverityRecord,
} from "@/lib/civic-metrics";
import {
  DEMO_OFFICIALS,
  type DemoOfficialSeed,
  type DemoOfficialType,
} from "@/lib/demo-officials";
import type { ProblemProgressStage } from "@/lib/problem-progress";
import { PROGRESS_STAGES } from "@/lib/problem-progress";
import { getProblemProgressMap } from "@/server/problem-progress";

type LoadedProblem = Awaited<ReturnType<typeof loadProblems>>[number];

export type OfficialScorecard = {
  id: string;
  slug: string;
  name: string;
  title: string;
  entity: string;
  type: DemoOfficialType;
  region: string;
  district: string;
  constituency?: string;
  focusCategory?: string;
  rank: number;
  score: number;
  trendDelta: number;
  scoreHistory: number[];
  bandLabel: string;
  bandClassName: string;
  linkedProblemIds: string[];
  stageCounts: Record<ProblemProgressStage, number>;
  metrics: {
    problemsReceived: number;
    problemsAcknowledged: number;
    problemsResolved: number;
    openProblems: number;
    avgResolutionDays: number;
    responseQualityRating: number;
    acknowledgementRatePct: number;
    resolutionRatePct: number;
    timelinessScore: number;
    responseQualityScore: number;
  };
};

export type PublicScoreDashboard = {
  summary: {
    nationalAverageScore: number;
    totalOfficials: number;
    districtsRepresented: number;
    totalTrackedProblems: number;
    totalOpenProblems: number;
    nationalResolutionRate: number;
    estimatedCostOfInactionPerDay: number;
    topPerformer?: {
      name: string;
      entity: string;
      score: number;
    };
  };
  scorecards: OfficialScorecard[];
  regionAverages: Array<{
    region: string;
    averageScore: number;
    resolutionRatePct: number;
    openProblems: number;
    officialCount: number;
    topEntity?: string;
  }>;
  categoryBreakdown: Array<{
    category: string;
    label: string;
    totalProblems: number;
    resolutionRatePct: number;
    avgSeverity: number;
    estimatedCostPerDay: number;
  }>;
  stageFunnel: Record<ProblemProgressStage, number>;
  topProblems: Array<{
    id: string;
    district: string;
    region: string;
    description: string;
    severityScore: number;
    costOfInactionPerDay: number;
    progressStage: ProblemProgressStage;
  }>;
};

async function loadProblems() {
  return prisma.problem.findMany({
    include: {
      _count: { select: { upvotes: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toSeverityRecord(problem: LoadedProblem): ProblemSeverityRecord {
  return {
    id: problem.id,
    category: problem.category,
    region: problem.region,
    district: problem.district,
    createdAt: problem.createdAt,
    status: problem.status,
    upvoteCount: problem._count.upvotes,
  };
}

function matchesOfficial(official: DemoOfficialSeed, problem: LoadedProblem) {
  if (official.focusCategory && problem.category !== official.focusCategory) {
    return false;
  }
  if (official.type === "agency" || official.type === "utility") {
    return problem.region === official.region;
  }
  return problem.region === official.region && problem.district === official.district;
}

function emptyStageCounts() {
  return Object.fromEntries(
    PROGRESS_STAGES.map((stage) => [stage, 0]),
  ) as Record<ProblemProgressStage, number>;
}

function buildOfficialScorecard(
  official: DemoOfficialSeed,
  problems: LoadedProblem[],
  progressMap: Record<
    string,
    {
      stage: ProblemProgressStage;
      updatedAt: string;
    }
  >,
) {
  const linkedProblems = problems.filter((problem) => matchesOfficial(official, problem));
  const stageCounts = emptyStageCounts();

  for (const problem of linkedProblems) {
    const stage = progressMap[problem.id]?.stage ?? "community_review";
    stageCounts[stage] += 1;
  }

  const intensity = linkedProblems.reduce(
    (sum, problem) => sum + Math.min(problem._count.upvotes + 1, 20),
    0,
  );

  const problemsReceived =
    official.scoreSeed.baseVolume +
    linkedProblems.length * 3 +
    Math.round(intensity / 10);

  const acknowledgementRatePct = clamp(
    official.scoreSeed.acknowledgementRatePct +
      stageCounts.verified * 3 +
      stageCounts.in_progress * 5 +
      stageCounts.resolved * 6 -
      stageCounts.reported * 2 -
      stageCounts.community_review,
    8,
    99,
  );

  const resolutionRatePct = clamp(
    Math.min(
      acknowledgementRatePct - 1,
      official.scoreSeed.resolutionRatePct +
        stageCounts.in_progress * 2 +
        stageCounts.resolved * 7 -
        stageCounts.reported * 2,
    ),
    4,
    96,
  );

  const avgResolutionDays = roundOne(
    clamp(
      official.scoreSeed.avgResolutionDays -
        stageCounts.resolved * 2.8 -
        stageCounts.in_progress * 1.4 +
        stageCounts.reported * 1.6 +
        stageCounts.community_review * 0.8 +
        intensity / 24,
      6,
      110,
    ),
  );

  const responseQualityRating = roundOne(
    clamp(
      official.scoreSeed.responseQualityRating +
        stageCounts.resolved * 0.08 +
        stageCounts.in_progress * 0.04 -
        stageCounts.reported * 0.04 -
        stageCounts.community_review * 0.02,
      1,
      5,
    ),
  );

  const scoreBreakdown = calculateAccountabilityScore({
    problemsReceived,
    problemsAcknowledged: Math.round((problemsReceived * acknowledgementRatePct) / 100),
    problemsResolved: Math.round((problemsReceived * resolutionRatePct) / 100),
    avgResolutionDays,
    responseQualityRating,
  });

  const trendDelta = Math.round(
    clamp(
      official.scoreSeed.momentum +
        stageCounts.resolved * 1.2 +
        stageCounts.in_progress * 0.4 -
        stageCounts.reported * 0.8 -
        stageCounts.community_review * 0.3,
      -12,
      12,
    ),
  );

  const bandMeta = accountabilityBandMeta(scoreBreakdown.accountabilityScore);

  return {
    id: official.id,
    slug: official.slug,
    name: official.name,
    title: official.title,
    entity: official.entity,
    type: official.type,
    region: official.region,
    district: official.district,
    constituency: official.constituency,
    focusCategory: official.focusCategory,
    rank: 0,
    score: scoreBreakdown.accountabilityScore,
    trendDelta,
    scoreHistory: buildScoreHistory(
      scoreBreakdown.accountabilityScore,
      Math.round(trendDelta / 2),
    ),
    bandLabel: bandMeta.label,
    bandClassName: bandMeta.className,
    linkedProblemIds: linkedProblems.map((problem) => problem.id),
    stageCounts,
    metrics: {
      problemsReceived,
      problemsAcknowledged: Math.round((problemsReceived * acknowledgementRatePct) / 100),
      problemsResolved: Math.round((problemsReceived * resolutionRatePct) / 100),
      openProblems: Math.max(
        0,
        problemsReceived - Math.round((problemsReceived * resolutionRatePct) / 100),
      ),
      avgResolutionDays,
      responseQualityRating,
      acknowledgementRatePct: scoreBreakdown.acknowledgementRatePct,
      resolutionRatePct: scoreBreakdown.resolutionRatePct,
      timelinessScore: scoreBreakdown.timelinessScore,
      responseQualityScore: scoreBreakdown.responseQualityScore,
    },
  } satisfies OfficialScorecard;
}

function filterScorecards(
  scorecards: OfficialScorecard[],
  filters?: {
    q?: string;
    type?: DemoOfficialType | "all";
  },
) {
  const q = filters?.q?.trim().toLowerCase();
  const requestedType = filters?.type ?? "all";

  return scorecards.filter((scorecard) => {
    if (requestedType !== "all" && scorecard.type !== requestedType) {
      return false;
    }
    if (!q) return true;
    return [
      scorecard.name,
      scorecard.entity,
      scorecard.region,
      scorecard.district,
      scorecard.constituency ?? "",
    ].some((value) => value.toLowerCase().includes(q));
  });
}

export async function getPublicScoreDashboard(filters?: {
  q?: string;
  type?: DemoOfficialType | "all";
}): Promise<PublicScoreDashboard> {
  const problems = await loadProblems();
  const progressMap = await getProblemProgressMap(
    problems.map((problem) => ({ id: problem.id, status: problem.status })),
  );
  const severityMap = buildProblemSeveritySnapshots(
    problems.map((problem) => ({
      ...toSeverityRecord(problem),
      progressStage: progressMap[problem.id]?.stage,
    })),
  );

  const rankedScorecards = DEMO_OFFICIALS.map((official) =>
    buildOfficialScorecard(official, problems, progressMap),
  )
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (right.metrics.resolutionRatePct !== left.metrics.resolutionRatePct) {
        return right.metrics.resolutionRatePct - left.metrics.resolutionRatePct;
      }
      return left.name.localeCompare(right.name);
    })
    .map((scorecard, index) => ({
      ...scorecard,
      rank: index + 1,
    }));

  const scorecards = filterScorecards(rankedScorecards, filters);

  const stageFunnel = problems.reduce((accumulator, problem) => {
    const stage = progressMap[problem.id]?.stage ?? "community_review";
    accumulator[stage] += 1;
    return accumulator;
  }, emptyStageCounts());

  const regionAverages = Array.from(
    new Set(rankedScorecards.map((scorecard) => scorecard.region)),
  )
    .map((region) => {
      const regionScorecards = rankedScorecards.filter(
        (scorecard) => scorecard.region === region,
      );
      const regionProblems = problems.filter((problem) => problem.region === region);
      const resolvedCount = regionProblems.filter((problem) => {
        const stage = progressMap[problem.id]?.stage ?? "community_review";
        return stage === "resolved";
      }).length;

      return {
        region,
        averageScore: average(regionScorecards.map((scorecard) => scorecard.score)),
        resolutionRatePct:
          regionProblems.length > 0
            ? Math.round((resolvedCount / regionProblems.length) * 100)
            : 0,
        openProblems: Math.max(0, regionProblems.length - resolvedCount),
        officialCount: regionScorecards.length,
        topEntity: regionScorecards[0]?.entity,
      };
    })
    .sort((left, right) => right.averageScore - left.averageScore);

  const categoryBreakdown = Array.from(
    new Set(problems.map((problem) => problem.category)),
  )
    .map((category) => {
      const categoryProblems = problems.filter((problem) => problem.category === category);
      const resolvedCount = categoryProblems.filter((problem) => {
        const stage = progressMap[problem.id]?.stage ?? "community_review";
        return stage === "resolved";
      }).length;
      const severityValues = categoryProblems.map(
        (problem) => severityMap[problem.id]?.severityScore ?? 0,
      );
      const costValues = categoryProblems.map(
        (problem) => severityMap[problem.id]?.costOfInactionPerDay ?? 0,
      );

      return {
        category,
        label: categoryLabel(category),
        totalProblems: categoryProblems.length,
        resolutionRatePct:
          categoryProblems.length > 0
            ? Math.round((resolvedCount / categoryProblems.length) * 100)
            : 0,
        avgSeverity: average(severityValues),
        estimatedCostPerDay: costValues.reduce((sum, value) => sum + value, 0),
      };
    })
    .sort((left, right) => right.avgSeverity - left.avgSeverity);

  const topProblems = problems
    .map((problem) => ({
      id: problem.id,
      district: problem.district,
      region: problem.region,
      description: problem.description,
      severityScore: severityMap[problem.id]?.severityScore ?? 0,
      costOfInactionPerDay: severityMap[problem.id]?.costOfInactionPerDay ?? 0,
      progressStage: progressMap[problem.id]?.stage ?? "community_review",
    }))
    .filter((problem) => problem.progressStage !== "resolved")
    .sort((left, right) => right.severityScore - left.severityScore)
    .slice(0, 10);

  const resolvedProblems = stageFunnel.resolved;
  const openProblems = problems.filter((problem) => {
    const stage = progressMap[problem.id]?.stage ?? "community_review";
    return stage !== "resolved";
  });
  const summary = {
    nationalAverageScore: average(rankedScorecards.map((scorecard) => scorecard.score)),
    totalOfficials: rankedScorecards.length,
    districtsRepresented: new Set(
      rankedScorecards.map((scorecard) => scorecard.district),
    ).size,
    totalTrackedProblems: problems.length,
    totalOpenProblems: Math.max(0, problems.length - resolvedProblems),
    nationalResolutionRate:
      problems.length > 0 ? Math.round((resolvedProblems / problems.length) * 100) : 0,
    estimatedCostOfInactionPerDay: openProblems.reduce(
      (sum, problem) => sum + (severityMap[problem.id]?.costOfInactionPerDay ?? 0),
      0,
    ),
    topPerformer: rankedScorecards[0]
      ? {
          name: rankedScorecards[0].name,
          entity: rankedScorecards[0].entity,
          score: rankedScorecards[0].score,
        }
      : undefined,
  };

  return {
    summary,
    scorecards,
    regionAverages,
    categoryBreakdown,
    stageFunnel,
    topProblems,
  };
}
