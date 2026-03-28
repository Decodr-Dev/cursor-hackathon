import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { StatusBadge } from "@/components/StatusBadge";
import { UpvoteControl } from "@/components/UpvoteControl";
import { DemoVerifyButton } from "@/components/DemoVerifyButton";
import { categoryLabel, subcategoryLabel } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const problem = await prisma.problem.findUnique({
    where: { id },
    include: {
      evidence: true,
      _count: { select: { upvotes: true } },
    },
  });

  if (!problem) notFound();

  const sessionId = await getSessionId();
  const existing = sessionId
    ? await prisma.upvote.findFirst({
        where: { problemId: id, sessionId },
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Link
        href="/"
        className="text-sm font-medium text-[var(--kasa-forest)] hover:underline"
      >
        ← Back to feed
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <StatusBadge status={problem.status} />
        <span className="text-sm text-[var(--kasa-muted)]">
          {categoryLabel(problem.category)}
          {problem.subcategory
            ? ` · ${subcategoryLabel(problem.category, problem.subcategory)}`
            : ""}
        </span>
      </div>

      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--kasa-ink)] sm:text-4xl">
        {problem.district}
      </h1>
      <p className="mt-1 text-sm font-medium text-[var(--kasa-muted)]">
        {problem.region}
        {problem.latitude != null && problem.longitude != null
          ? ` · ${problem.latitude.toFixed(4)}, ${problem.longitude.toFixed(4)}`
          : ""}
      </p>

      <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-[var(--kasa-ink)]">
        {problem.description}
      </p>

      {problem.evidence.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--kasa-muted)]">
            Evidence
          </h2>
          <ul className="mt-3 flex flex-col gap-4">
            {problem.evidence.map((e) => (
              <li
                key={e.id}
                className="overflow-hidden rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-wash)]"
              >
                {e.type === "photo" ? (
                  <Image
                    src={e.fileUrl}
                    alt="Report evidence"
                    width={1200}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                ) : (
                  <a
                    href={e.fileUrl}
                    className="block px-4 py-6 text-sm font-semibold text-[var(--kasa-forest)] hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open uploaded document (PDF)
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 rounded-3xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--kasa-ink)]">
          Upvotes
        </h2>
        <p className="mt-1 text-sm text-[var(--kasa-muted)]">
          Tap if you are affected too — it helps prioritise without spamming
          duplicate posts.
        </p>
        <div className="mt-4">
          <UpvoteControl
            problemId={problem.id}
            count={problem._count.upvotes}
            hasUpvoted={!!existing}
          />
        </div>
      </section>

      <section className="mt-6 space-y-4">
        <DemoVerifyButton problemId={problem.id} />
        <div className="rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-wash)]/60 p-4 text-sm text-[var(--kasa-muted)]">
          <p className="font-semibold text-[var(--kasa-ink)]">
            Coming soon from the PRD
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Official responses with live accountability scores</li>
            <li>Neighbour confirmations within 10km + 24h window</li>
            <li>Peer and business solutions with helpfulness votes</li>
          </ul>
        </div>
      </section>

      <p className="mt-8 text-xs text-[var(--kasa-muted)]">
        Report ID <span className="font-mono text-[var(--kasa-ink)]">{problem.id}</span>{" "}
        · Posted{" "}
        {new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(problem.createdAt)}
      </p>
    </main>
  );
}
