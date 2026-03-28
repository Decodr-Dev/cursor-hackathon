"use server";

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProblemStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId, getSessionId } from "@/lib/session";
import { PROBLEM_CATEGORIES } from "@/lib/categories";

const DESC_MAX = 2000;
const UPLOAD_MAX = 5 * 1024 * 1024;

const allowedMime = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const CATEGORY_SLUGS = new Set(PROBLEM_CATEGORIES.map((c) => c.slug));

export type CreateProblemState = { error: string } | null;

export async function createProblem(
  _prev: CreateProblemState,
  formData: FormData,
): Promise<CreateProblemState> {
  const category = String(formData.get("category") ?? "").trim();
  const subcategory = String(formData.get("subcategory") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const latRaw = String(formData.get("latitude") ?? "").trim();
  const lngRaw = String(formData.get("longitude") ?? "").trim();

  if (!category || !CATEGORY_SLUGS.has(category)) {
    return { error: "Choose a valid category." };
  }
  if (!region || !district) {
    return { error: "Region and district are required." };
  }
  if (!description || description.length > DESC_MAX) {
    return { error: `Description is required (max ${DESC_MAX} characters).` };
  }

  let latitude: number | undefined;
  let longitude: number | undefined;
  if (latRaw || lngRaw) {
    latitude = latRaw ? Number(latRaw) : undefined;
    longitude = lngRaw ? Number(lngRaw) : undefined;
    if (
      latitude === undefined ||
      longitude === undefined ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return {
        error: "If you add GPS coordinates, include both latitude and longitude.",
      };
    }
  }

  const file = formData.get("evidence");
  let evidence:
    | { type: string; relativeUrl: string }
    | undefined;

  if (file instanceof File && file.size > 0) {
    if (file.size > UPLOAD_MAX) {
      return { error: "File must be 5MB or smaller." };
    }
    if (!allowedMime.has(file.type)) {
      return {
        error: "Use a JPEG, PNG, WebP, or PDF for evidence.",
      };
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const ext =
      file.type === "image/jpeg"
        ? ".jpg"
        : file.type === "image/png"
          ? ".png"
          : file.type === "image/webp"
            ? ".webp"
            : ".pdf";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, name), buf);
    const type = file.type.startsWith("image/") ? "photo" : "document";
    evidence = { type, relativeUrl: `/uploads/${name}` };
  }

  const problem = await prisma.problem.create({
    data: {
      category,
      subcategory,
      region,
      district,
      description,
      status: ProblemStatus.PENDING_VERIFICATION,
      latitude,
      longitude,
      evidence: evidence
        ? {
            create: {
              type: evidence.type,
              fileUrl: evidence.relativeUrl,
            },
          }
        : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath(`/problems/${problem.id}`);
  redirect(`/problems/${problem.id}`);
}

export async function upvoteProblem(problemId: string) {
  const sessionId = await getOrCreateSessionId();
  try {
    await prisma.upvote.create({
      data: { problemId, sessionId },
    });
  } catch {
    return { ok: false as const, error: "already_upvoted" as const };
  }
  revalidatePath("/");
  revalidatePath(`/problems/${problemId}`);
  return { ok: true as const };
}

export async function removeUpvote(problemId: string) {
  const sessionId = await getSessionId();
  if (!sessionId) return { ok: false as const };
  await prisma.upvote.deleteMany({
    where: { problemId, sessionId },
  });
  revalidatePath("/");
  revalidatePath(`/problems/${problemId}`);
  return { ok: true as const };
}

/** Hackathon demo only — simulates community verification finishing. */
export async function demoMarkVerified(problemId: string) {
  if (process.env.NODE_ENV === "production") {
    return { ok: false as const, error: "Unavailable." };
  }
  await prisma.problem.update({
    where: { id: problemId },
    data: { status: ProblemStatus.COMMUNITY_VERIFIED },
  });
  revalidatePath("/");
  revalidatePath(`/problems/${problemId}`);
  return { ok: true as const };
}
