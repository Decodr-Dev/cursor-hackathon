import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { signUpWithPassword } from "@/server/auth-service";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      }
    | null;

  if (!body) {
    return NextResponse.json(
      { error: "Send signup details as JSON." },
      { status: 400 },
    );
  }

  const result = await signUpWithPassword({
    name: body.name ?? "",
    email: body.email ?? "",
    password: body.password ?? "",
    confirmPassword: body.confirmPassword ?? "",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  revalidatePath("/me");
  revalidatePath("/login");
  revalidatePath("/signup");

  return NextResponse.json({ user: result.user }, { status: 201 });
}
