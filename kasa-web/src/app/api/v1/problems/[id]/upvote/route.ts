import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { READ_ONLY_DEMO_MESSAGE, isReadOnlyDemo } from "@/lib/demo-mode";
import { addUpvote, removeUpvote } from "@/server/problem-service";
import { getOrCreateSessionId, getSessionId } from "@/lib/session";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (isReadOnlyDemo()) {
    return NextResponse.json(
      { error: READ_ONLY_DEMO_MESSAGE },
      { status: 403 },
    );
  }
  const { id } = await ctx.params;
  const sessionId = await getOrCreateSessionId();
  const result = await addUpvote(id, sessionId);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: 409 },
    );
  }
  revalidatePath("/");
  revalidatePath(`/problems/${id}`);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (isReadOnlyDemo()) {
    return NextResponse.json(
      { error: READ_ONLY_DEMO_MESSAGE },
      { status: 403 },
    );
  }
  const { id } = await ctx.params;
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "no_session" }, { status: 400 });
  }
  await removeUpvote(id, sessionId);
  revalidatePath("/");
  revalidatePath(`/problems/${id}`);
  return NextResponse.json({ ok: true });
}
