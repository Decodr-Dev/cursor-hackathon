import { NextResponse } from "next/server";
import { categoryLabel } from "@/lib/categories";
import { demoSeverityScore } from "@/lib/civic-metrics";
import { getTrendingSnapshot, problemToJson } from "@/server/problem-service";

export async function GET() {
  const snap = await getTrendingSnapshot();
  const ranked = snap.categories.map((c, i) => ({
    rank: i + 1,
    category: c.category,
    label: categoryLabel(c.category),
    reports: c._count.id,
    severityDemo: Math.min(
      99,
      40 + Math.min(c._count.id * 3, 50) + (i === 0 ? 12 : 0),
    ),
  }));
  return NextResponse.json({
    rightNow: ranked.slice(0, 8),
    risingCategories: ranked.slice(0, 6),
    mostUpvoted: snap.topVoices.map(problemToJson),
    longestUnresolved: snap.longestOpen.map(({ problem: p, daysOpen }) => ({
      ...problemToJson(p),
      daysOpen,
      severityScore: demoSeverityScore({
        createdAt: p.createdAt,
        status: p.status,
        upvoteCount: p._count.upvotes,
      }),
    })),
  });
}
