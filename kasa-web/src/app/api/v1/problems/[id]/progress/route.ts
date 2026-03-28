import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { READ_ONLY_DEMO_MESSAGE, isReadOnlyDemo } from "@/lib/demo-mode";
import {
  PROGRESS_STAGES,
  type ProblemProgressStage,
} from "@/lib/problem-progress";
import { demoUpdateProblemProgress } from "@/server/problem-service";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (isReadOnlyDemo()) {
    return NextResponse.json(
      { error: READ_ONLY_DEMO_MESSAGE },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { stage?: string };
  const stage = body.stage?.trim() as ProblemProgressStage | undefined;
  if (!stage || !(PROGRESS_STAGES as readonly string[]).includes(stage)) {
    return NextResponse.json({ error: "Choose a valid progress stage." }, { status: 400 });
  }

  const { id } = await ctx.params;
  const result = await demoUpdateProblemProgress(id, stage);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  revalidatePath("/");
  revalidatePath(`/problems/${id}`);
  return NextResponse.json({ ok: true });
}
