import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ProblemStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FeedToolbar } from "@/components/FeedToolbar";
import { StatusBadge } from "@/components/StatusBadge";
import { categoryLabel, subcategoryLabel } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status?.trim() || "all";
  const category = sp.category?.trim() || "";
  const q = sp.q?.trim() || "";

  const where: Prisma.ProblemWhereInput = {};
  if (status === "pending") {
    where.status = ProblemStatus.PENDING_VERIFICATION;
  } else if (status === "verified") {
    where.status = ProblemStatus.COMMUNITY_VERIFIED;
  }
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { district: { contains: q } },
      { description: { contains: q } },
      { region: { contains: q } },
    ];
  }

  const problems = await prisma.problem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { upvotes: true } },
    },
    take: 50,
  });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--kasa-gold)]">
          Problem feed
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--kasa-ink)] sm:text-4xl">
          What needs fixing near you?
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--kasa-muted)]">
          This is a working mini version of Kasa: real posts saved on your
          computer for the demo, plus honest placeholders where Ghana Card
          checks and neighbourhood confirmations would go.
        </p>
      </div>

      <FeedToolbar current={{ status, category, q }} />

      <ul className="mt-8 flex flex-col gap-4">
        {problems.length === 0 ? (
          <li className="rounded-3xl border border-dashed border-[var(--kasa-border)] px-6 py-12 text-center text-sm text-[var(--kasa-muted)]">
            No reports match these filters yet. Be the first to{" "}
            <Link
              href="/problems/new"
              className="font-semibold text-[var(--kasa-forest)] underline-offset-2 hover:underline"
            >
              post a problem
            </Link>
            .
          </li>
        ) : (
          problems.map((p) => (
            <li key={p.id}>
              <Link
                href={`/problems/${p.id}`}
                className="block rounded-3xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={p.status} />
                  <span className="text-xs font-medium text-[var(--kasa-muted)]">
                    {categoryLabel(p.category)}
                    {p.subcategory
                      ? ` · ${subcategoryLabel(p.category, p.subcategory)}`
                      : ""}
                  </span>
                </div>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--kasa-ink)]">
                  {p.district} · {p.region}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--kasa-muted)]">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--kasa-muted)]">
                  <span className="rounded-full bg-[var(--kasa-wash)] px-2.5 py-1 font-semibold text-[var(--kasa-ink)]">
                    {p._count.upvotes} upvotes
                  </span>
                  <span>
                    Posted{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(p.createdAt)}
                  </span>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
