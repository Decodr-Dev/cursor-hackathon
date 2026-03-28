import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import type { Prisma } from "@prisma/client";
import { ProblemStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PROBLEM_CATEGORIES } from "@/lib/categories";
import { daysOpenSince, demoSeverityScore } from "@/lib/civic-metrics";

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
  if (params.district?.trim()) {
    where.district = params.district.trim();
  }
  if (params.region?.trim()) {
    where.region = params.region.trim();
  }

  if (params.sort === "most_severe") {
    const rows = await prisma.problem.findMany({
      where,
      take: 100,
      include: feedInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows
      .map((p) => ({
        p,
        s: demoSeverityScore({
          createdAt: p.createdAt,
          status: p.status,
          upvoteCount: p._count.upvotes,
        }),
      }))
      .sort((a, b) => b.s - a.s)
      .slice(0, take)
      .map((x) => x.p);
  }

  let orderBy: Prisma.ProblemOrderByWithRelationInput[] = [
    { createdAt: "desc" },
  ];
  if (params.sort === "most_upvoted") {
    orderBy = [{ upvotes: { _count: "desc" } }, { createdAt: "desc" }];
  } else if (params.sort === "for_you" || params.sort === "latest") {
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
  const byCat = await prisma.problem.groupBy({
    by: ["category"],
    _count: { id: true },
  });
  const categories = [...byCat].sort(
    (a, b) => b._count.id - a._count.id,
  );

  const topVoices = await prisma.problem.findMany({
    orderBy: [{ upvotes: { _count: "desc" } }, { createdAt: "desc" }],
    take: 6,
    include: feedInclude,
  });

  const longestOpenRows = await prisma.problem.findMany({
    where: { status: ProblemStatus.PENDING_VERIFICATION },
    orderBy: { createdAt: "asc" },
    take: 5,
    include: feedInclude,
  });

  const longestOpen = longestOpenRows.map((p) => ({
    problem: p,
    daysOpen: daysOpenSince(p.createdAt),
  }));

  return { categories, topVoices, longestOpen };
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

  const file = formData.get("evidence");
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

export function problemToJson(p: ProblemListRow) {
  const thumb = p.evidence[0];
  const severityScore = demoSeverityScore({
    createdAt: p.createdAt,
    status: p.status,
    upvoteCount: p._count.upvotes,
  });
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
    severityScore,
    previewImageUrl: thumb?.type === "photo" ? thumb.fileUrl : null,
  };
}
