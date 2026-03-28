import { NextResponse } from "next/server";
import { categoryLabel } from "@/lib/categories";
import { getTrendingSnapshot, problemToJson } from "@/server/problem-service";

export async function GET() {
  const snap = await getTrendingSnapshot();
  const ranked = snap.categories.map((category, index) => ({
    rank: index + 1,
    category: category.category,
    label: categoryLabel(category.category),
    reports: category.reports,
    avgSeverity: category.avgSeverity,
    trendScore: category.trendPulse,
  }));
  return NextResponse.json({
    rightNow: ranked.slice(0, 8),
    risingCategories: ranked.slice(0, 6),
    mostUpvoted: snap.topVoices.map((problem) =>
      problemToJson(problem, snap.severityMap[problem.id]),
    ),
    longestUnresolved: snap.longestOpen.map(({ problem: p, daysOpen }) => ({
      ...problemToJson(p, snap.severityMap[p.id]),
      daysOpen,
      severityScore: snap.severityMap[p.id]?.severityScore ?? 0,
    })),
  });
}
