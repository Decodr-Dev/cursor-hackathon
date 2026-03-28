import { NextResponse } from "next/server";
import { getProblemById } from "@/server/problem-service";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const problem = await getProblemById(id);
  if (!problem) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    data: {
      id: problem.id,
      category: problem.category,
      subcategory: problem.subcategory,
      region: problem.region,
      district: problem.district,
      description: problem.description,
      status: problem.status,
      latitude: problem.latitude,
      longitude: problem.longitude,
      createdAt: problem.createdAt.toISOString(),
      upvoteCount: problem._count.upvotes,
      evidence: problem.evidence.map((e) => ({
        id: e.id,
        type: e.type,
        fileUrl: e.fileUrl,
        createdAt: e.createdAt.toISOString(),
      })),
    },
  });
}
