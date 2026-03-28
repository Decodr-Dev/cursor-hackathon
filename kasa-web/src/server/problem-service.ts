import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import type { Prisma } from "@prisma/client";
import { ProblemStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PROBLEM_CATEGORIES } from "@/lib/categories";
import {
  buildProblemSeveritySnapshots,
  calculateTrendPulse,
  daysOpenSince,
  type ProblemSeveritySnapshot,
} from "@/lib/civic-metrics";
import type { ProblemProgressStage } from "@/lib/problem-progress";
import {
  getProblemProgressMap,
  setProblemProgressStage,
} from "@/server/problem-progress";

const DESC_MAX = 2000;
const UPLOAD_MAX = 5 * 1024 * 1024;
const CATEGORY_SLUGS = new Set(PROBLEM_CATEGORIES.map((c) => c.slug));

const allowedMime = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

/** v2 spec §4.3 — home feed sort (Trending is its own tab/screen). */
export const FEED_SORTS = [
  "for_you",
  "latest",
  "most_upvoted",
  "most_severe",
] as const;

export type FeedSort = (typeof FEED_SORTS)[number];

export function parseFeedSort(raw: string | undefined): FeedSort {
  if (raw && (FEED_SORTS as readonly string[]).includes(raw)) {
    return raw as FeedSort;
  }
  return "latest";
}

export type ProblemListRow = Awaited<
  ReturnType<typeof listProblemsForFeed>
>[number];

type ProblemSeverityRow = {
  id: string;
  category: string;
  region: string;
  district: string;
  createdAt: Date;
  status: ProblemStatus;
  _count: { upvotes: number };
};

type ProblemProgressMap = Record<
  string,
  {
    stage: ProblemProgressStage;
    updatedAt: string;
  }
>;

function toSeverityRecord(
  row: ProblemSeverityRow,
  progressStage?: ProblemProgressStage,
) {
  return {
    id: row.id,
    category: row.category,
    region: row.region,
    district: row.district,
    createdAt: row.createdAt,
    status: row.status,
    upvoteCount: row._count.upvotes,
    progressStage,
  };
}

export function buildSeverityMapForRows(
  rows: Array<{
    id: string;
    category: string;
    region: string;
    district: string;
    createdAt: Date;
    status: ProblemStatus;
    _count: { upvotes: number };
  }>,
  progressMap?: ProblemProgressMap,
) {
  return buildProblemSeveritySnapshots(
    rows.map((row) => toSeverityRecord(row, progressMap?.[row.id]?.stage)),
  );
}

const feedInclude = {
  evidence: { take: 1, orderBy: { createdAt: "asc" as const } },
  _count: { select: { upvotes: true } },
};

export async function listProblemsForFeed(params: {
  sort: FeedSort;
  category?: string;
  status?: "all" | "pending" | "verified";
  q?: string;
  /** Exact match on `Problem.district` - use for the user's nearby community feed. */
  district?: string;
  /** Exact match on `Problem.region` — omit for all Ghana (v2 location pill). */
  region?: string;
  take?: number;
}) {
  const take = Math.min(params.take ?? 50, 100);
  const currentDistrict = params.district?.trim() ?? "";
  const currentRegion = params.region?.trim() ?? "";

  if (!currentDistrict) {
    return findProblemsForScope(
      buildFeedWhere(params, {
        region: currentRegion || undefined,
      }),
      params.sort,
      take,
    );
  }

  const rows: Awaited<ReturnType<typeof findProblemsForScope>> = [];
  const seenIds = new Set<string>();
  const appendScope = async (where: Prisma.ProblemWhereInput) => {
    const nextRows = await findProblemsForScope(
      where,
      params.sort,
      Math.min(Math.max(take * 2, 24), 100),
    );

    for (const row of nextRows) {
      if (seenIds.has(row.id)) continue;
      seenIds.add(row.id);
      rows.push(row);
      if (rows.length >= take) break;
    }
  };

  await appendScope(
    buildFeedWhere(params, {
      district: currentDistrict,
      region: currentRegion || undefined,
    }),
  );

  if (rows.length < take && currentRegion) {
    await appendScope(
      buildFeedWhere(params, {
        region: currentRegion,
        excludeDistrict: currentDistrict,
      }),
    );
  }

  if (rows.length < take) {
    await appendScope(
      buildFeedWhere(params, {
        excludeDistrict: currentDistrict,
        excludeRegion: currentRegion || undefined,
      }),
    );
  }

  return rows.slice(0, take);
}

function buildFeedWhere(
  params: {
    category?: string;
    status?: "all" | "pending" | "verified";
    q?: string;
  },
  scope: {
    district?: string;
    region?: string;
    excludeDistrict?: string;
    excludeRegion?: string;
  } = {},
) {
  const where: Prisma.ProblemWhereInput = {};
  const status = params.status ?? "all";

  if (status === "pending") {
    where.status = ProblemStatus.PENDING_VERIFICATION;
  } else if (status === "verified") {
    where.status = ProblemStatus.COMMUNITY_VERIFIED;
  }

  if (params.category?.trim()) {
    where.category = params.category.trim();
  }

  const q = params.q?.trim();
  if (q) {
    where.OR = [
      { district: { contains: q } },
      { description: { contains: q } },
      { region: { contains: q } },
    ];
  }

  if (scope.district?.trim()) {
    where.district = scope.district.trim();
  }
  if (scope.region?.trim()) {
    where.region = scope.region.trim();
  }

  const not: Prisma.ProblemWhereInput[] = [];
  if (scope.excludeDistrict?.trim()) {
    not.push({ district: scope.excludeDistrict.trim() });
  }
  if (scope.excludeRegion?.trim()) {
    not.push({ region: scope.excludeRegion.trim() });
  }
  if (not.length > 0) {
    where.NOT = not;
  }

  return where;
}

async function findProblemsForScope(
  where: Prisma.ProblemWhereInput,
  sort: FeedSort,
  take: number,
) {
  if (sort === "most_severe") {
    const rows = await prisma.problem.findMany({
      where,
      take: 100,
      include: feedInclude,
      orderBy: { createdAt: "desc" },
    });
    const progressMap = await getProblemProgressMap(
      rows.map((row) => ({
        id: row.id,
        status: row.status,
      })),
    );
    const severityMap = buildSeverityMapForRows(rows, progressMap);
    return rows
      .map((p) => ({
        p,
        s: severityMap[p.id]?.severityScore ?? 0,
      }))
      .sort((a, b) => b.s - a.s)
      .slice(0, take)
      .map((x) => x.p);
  }

  let orderBy: Prisma.ProblemOrderByWithRelationInput[] = [
    { createdAt: "desc" },
  ];
  if (sort === "most_upvoted") {
    orderBy = [{ upvotes: { _count: "desc" } }, { createdAt: "desc" }];
  } else if (sort === "for_you" || sort === "latest") {
    orderBy = [{ createdAt: "desc" }];
  }

  return prisma.problem.findMany({
    where,
    orderBy,
    take,
    include: feedInclude,
  });
}

export async function getPublicFeedStats(params?: {
  district?: string;
  region?: string;
}) {
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  const startWeek = new Date();
  startWeek.setDate(startWeek.getDate() - 7);
  const scopeWhere: Prisma.ProblemWhereInput = {};
  if (params?.district?.trim()) {
    scopeWhere.district = params.district.trim();
  }
  if (params?.region?.trim()) {
    scopeWhere.region = params.region.trim();
  }
  const [todayReports, weekVerified, totalOpen] = await Promise.all([
    prisma.problem.count({
      where: { ...scopeWhere, createdAt: { gte: startToday } },
    }),
    prisma.problem.count({
      where: {
        ...scopeWhere,
        status: ProblemStatus.COMMUNITY_VERIFIED,
        updatedAt: { gte: startWeek },
      },
    }),
    prisma.problem.count({
      where: {
        ...scopeWhere,
        status: ProblemStatus.PENDING_VERIFICATION,
      },
    }),
  ]);
  return { todayReports, weekVerified, totalOpen };
}

export async function getTrendingSnapshot() {
  const problems = await prisma.problem.findMany({
    include: feedInclude,
    orderBy: { createdAt: "desc" },
  });
  const progressMap = await getProblemProgressMap(
    problems.map((problem) => ({
      id: problem.id,
      status: problem.status,
    })),
  );
  const severityMap = buildSeverityMapForRows(problems, progressMap);

  const categoryBuckets = new Map<string, typeof problems>();
  for (const problem of problems) {
    const current = categoryBuckets.get(problem.category) ?? [];
    current.push(problem);
    categoryBuckets.set(problem.category, current);
  }

  const categories = Array.from(categoryBuckets.entries())
    .map(([category, rows]) => {
      const recentReports = rows.filter(
        (row) => daysOpenSince(row.createdAt) <= 7,
      ).length;
      const verifiedReports = rows.filter((row) => {
        const stage = progressMap[row.id]?.stage;
        return (
          stage === "verified" ||
          stage === "in_progress" ||
          stage === "resolved"
        );
      }).length;
      const avgSeverity = Math.round(
        rows.reduce(
          (sum, row) => sum + (severityMap[row.id]?.severityScore ?? 0),
          0,
        ) / Math.max(rows.length, 1),
      );

      return {
        category,
        reports: rows.length,
        recentReports,
        verifiedReports,
        avgSeverity,
        trendPulse: calculateTrendPulse({
          totalReports: rows.length,
          recentReports,
          verifiedReports,
        }),
      };
    })
    .sort((left, right) => {
      if (right.trendPulse !== left.trendPulse) {
        return right.trendPulse - left.trendPulse;
      }
      if (right.avgSeverity !== left.avgSeverity) {
        return right.avgSeverity - left.avgSeverity;
      }
      return right.reports - left.reports;
    });

  const topVoices = [...problems]
    .sort((left, right) => {
      if (right._count.upvotes !== left._count.upvotes) {
        return right._count.upvotes - left._count.upvotes;
      }
      return right.createdAt.getTime() - left.createdAt.getTime();
    })
    .slice(0, 6);

  const longestOpen = [...problems]
    .filter((problem) => progressMap[problem.id]?.stage !== "resolved")
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
    .slice(0, 5)
    .map((problem) => ({
      problem,
      daysOpen: daysOpenSince(problem.createdAt),
    }));

  return { categories, topVoices, longestOpen, severityMap };
}

export async function getProblemById(id: string) {
  return prisma.problem.findUnique({
    where: { id },
    include: {
      evidence: { orderBy: { createdAt: "asc" } },
      _count: { select: { upvotes: true } },
    },
  });
}

export async function getProblemSeveritySnapshot(
  problem: ProblemSeverityRow,
  progressStage?: ProblemProgressStage,
): Promise<ProblemSeveritySnapshot> {
  const relatedProblems = await prisma.problem.findMany({
    where: {
      category: problem.category,
      region: problem.region,
    },
    include: {
      _count: { select: { upvotes: true } },
    },
  });
  const progressMap = await getProblemProgressMap(
    relatedProblems.map((row) => ({
      id: row.id,
      status: row.status,
    })),
  );

  if (progressStage) {
    progressMap[problem.id] = {
      stage: progressStage,
      updatedAt: progressMap[problem.id]?.updatedAt ?? new Date().toISOString(),
    };
  }

  return (
    buildSeverityMapForRows(relatedProblems, progressMap)[problem.id] ??
    buildSeverityMapForRows([problem], progressMap)[problem.id]
  );
}

export type CreateProblemResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function createProblemFromFormData(
  formData: FormData,
): Promise<CreateProblemResult> {
  const category = String(formData.get("category") ?? "").trim();
  const subcategory = String(formData.get("subcategory") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const latRaw = String(formData.get("latitude") ?? "").trim();
  const lngRaw = String(formData.get("longitude") ?? "").trim();

  if (!category || !CATEGORY_SLUGS.has(category)) {
    return { ok: false, error: "Choose a valid category." };
  }
  if (!region || !district) {
    return { ok: false, error: "Region and district are required." };
  }
  if (!description || description.length > DESC_MAX) {
    return {
      ok: false,
      error: `Description is required (max ${DESC_MAX} characters).`,
    };
  }

  let latitude: number | undefined;
  let longitude: number | undefined;
  if (latRaw || lngRaw) {
    latitude = latRaw ? Number(latRaw) : undefined;
    longitude = lngRaw ? Number(lngRaw) : undefined;
    if (
      latitude === undefined ||
      longitude === undefined ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return {
        ok: false,
        error:
          "If you add GPS coordinates, include both latitude and longitude.",
      };
    }
  }

  const file =
    formData.get("evidenceCamera") ??
    formData.get("evidenceFile") ??
    formData.get("evidence");
  let evidence:
    | { type: string; relativeUrl: string }
    | undefined;

  if (file instanceof File && file.size > 0) {
    if (file.size > UPLOAD_MAX) {
      return { ok: false, error: "File must be 5MB or smaller." };
    }
    if (!allowedMime.has(file.type)) {
      return { ok: false, error: "Use a JPEG, PNG, WebP, or PDF for evidence." };
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const ext =
      file.type === "image/jpeg"
        ? ".jpg"
        : file.type === "image/png"
          ? ".png"
          : file.type === "image/webp"
            ? ".webp"
            : ".pdf";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, name), buf);
    const type = file.type.startsWith("image/") ? "photo" : "document";
    evidence = { type, relativeUrl: `/uploads/${name}` };
  }

  const problem = await prisma.problem.create({
    data: {
      category,
      subcategory,
      region,
      district,
      description,
      status: ProblemStatus.PENDING_VERIFICATION,
      latitude,
      longitude,
      evidence: evidence
        ? {
            create: {
              type: evidence.type,
              fileUrl: evidence.relativeUrl,
            },
          }
        : undefined,
    },
  });

  return { ok: true, id: problem.id };
}

export async function addUpvote(problemId: string, sessionId: string) {
  try {
    await prisma.upvote.create({
      data: { problemId, sessionId },
    });
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "already_upvoted" as const };
  }
}

export async function removeUpvote(problemId: string, sessionId: string) {
  await prisma.upvote.deleteMany({
    where: { problemId, sessionId },
  });
}

export async function demoMarkProblemVerified(problemId: string) {
  if (process.env.NODE_ENV === "production") {
    return { ok: false as const, error: "Unavailable in production." };
  }
  await prisma.problem.update({
    where: { id: problemId },
    data: { status: ProblemStatus.COMMUNITY_VERIFIED },
  });
  return { ok: true as const };
}

export async function demoUpdateProblemProgress(
  problemId: string,
  stage: ProblemProgressStage,
) {
  if (process.env.NODE_ENV === "production") {
    return { ok: false as const, error: "Unavailable in production." };
  }

  const status =
    stage === "reported" || stage === "community_review"
      ? ProblemStatus.PENDING_VERIFICATION
      : ProblemStatus.COMMUNITY_VERIFIED;

  await prisma.problem.update({
    where: { id: problemId },
    data: { status },
  });

  await setProblemProgressStage(problemId, stage);
  return { ok: true as const };
}

export function problemToJson(
  p: ProblemListRow,
  severitySnapshot?: ProblemSeveritySnapshot,
) {
  const thumb = p.evidence[0];
  const snapshot = severitySnapshot ?? buildSeverityMapForRows([p])[p.id];
  return {
    id: p.id,
    category: p.category,
    subcategory: p.subcategory,
    region: p.region,
    district: p.district,
    description: p.description,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    upvoteCount: p._count.upvotes,
    severityScore: snapshot?.severityScore ?? 0,
    costOfInactionPerDay: snapshot?.costOfInactionPerDay ?? 0,
    previewImageUrl: thumb?.type === "photo" ? thumb.fileUrl : null,
  };
}
