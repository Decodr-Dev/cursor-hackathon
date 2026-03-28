import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { demoMarkProblemVerified } from "@/server/problem-service";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const result = await demoMarkProblemVerified(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }
  revalidatePath("/");
  revalidatePath(`/problems/${id}`);
  return NextResponse.json({ ok: true });
}
