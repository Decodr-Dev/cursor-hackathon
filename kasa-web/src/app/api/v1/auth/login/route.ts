import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { loginWithPassword } from "@/server/auth-service";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  if (!body) {
    return NextResponse.json(
      { error: "Send login details as JSON." },
      { status: 400 },
    );
  }

  const result = await loginWithPassword({
    email: body.email ?? "",
    password: body.password ?? "",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  revalidatePath("/me");
  revalidatePath("/login");
  revalidatePath("/signup");

  return NextResponse.json({ user: result.user });
}
