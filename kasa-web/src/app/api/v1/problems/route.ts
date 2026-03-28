import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  listProblemsForFeed,
  createProblemFromFormData,
  parseFeedSort,
  problemToJson,
} from "@/server/problem-service";

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

  return NextResponse.json({
    data: rows.map(problemToJson),
    meta: { sort, count: rows.length },
  });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const result = await createProblemFromFormData(formData);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  revalidatePath("/");
  revalidatePath(`/problems/${result.id}`);
  return NextResponse.json({ id: result.id }, { status: 201 });
}
