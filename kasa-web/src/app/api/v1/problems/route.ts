import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getProblemProgressMap } from "@/server/problem-progress";
import {
  buildSeverityMapForRows,
  listProblemsForFeed,
  createProblemFromFormData,
  parseFeedSort,
  problemToJson,
} from "@/server/problem-service";
import { READ_ONLY_DEMO_MESSAGE, isReadOnlyDemo } from "@/lib/demo-mode";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = parseFeedSort(searchParams.get("sort") ?? undefined);
  const category = searchParams.get("category") ?? undefined;
  const statusRaw = searchParams.get("status") ?? "all";
  const status =
    statusRaw === "pending" || statusRaw === "verified" ? statusRaw : "all";
  const q = searchParams.get("q") ?? undefined;
  const district = searchParams.get("district") ?? undefined;
  const region = searchParams.get("region") ?? undefined;
  const take = Number(searchParams.get("limit") ?? "50");

  const rows = await listProblemsForFeed({
    sort,
    category: category ?? undefined,
    status,
    q: q ?? undefined,
    district: district ?? undefined,
    region: region ?? undefined,
    take: Number.isFinite(take) ? take : 50,
  });
  const progressMap = await getProblemProgressMap(
    rows.map((row) => ({
      id: row.id,
      status: row.status,
    })),
  );
  const severityMap = buildSeverityMapForRows(rows, progressMap);

  return NextResponse.json({
    data: rows.map((row) => problemToJson(row, severityMap[row.id])),
    meta: { sort, count: rows.length },
  });
}

export async function POST(req: Request) {
  if (isReadOnlyDemo()) {
    return NextResponse.json(
      { error: READ_ONLY_DEMO_MESSAGE },
      { status: 403 },
    );
  }
  const formData = await req.formData();
  const result = await createProblemFromFormData(formData);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  revalidatePath("/");
  revalidatePath(`/problems/${result.id}`);
  return NextResponse.json({ id: result.id }, { status: 201 });
}
