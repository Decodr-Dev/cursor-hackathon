import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { logoutCurrentUser } from "@/server/auth-service";

export async function POST() {
  await logoutCurrentUser();

  revalidatePath("/me");
  revalidatePath("/login");
  revalidatePath("/signup");

  return NextResponse.json({ ok: true });
}
