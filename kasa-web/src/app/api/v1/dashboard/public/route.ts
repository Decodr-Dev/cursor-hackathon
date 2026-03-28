import { NextResponse } from "next/server";
import { parseOfficialType } from "@/lib/demo-officials";
import { getPublicScoreDashboard } from "@/server/accountability-service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const type = parseOfficialType(searchParams.get("type") ?? undefined);
  const data = await getPublicScoreDashboard({
    q: q || undefined,
    type,
  });

  return NextResponse.json({ data });
}
