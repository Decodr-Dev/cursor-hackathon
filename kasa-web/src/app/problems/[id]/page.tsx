import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { getProblemById } from "@/server/problem-service";
import { categoryEmoji, categoryLabel, subcategoryLabel } from "@/lib/categories";
import {
  daysOpenSince,
  demoSeverityScore,
  severityStyle,
} from "@/lib/civic-metrics";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { StatusBadge } from "@/components/StatusBadge";
import { UpvoteControl } from "@/components/UpvoteControl";
import { DemoVerifyButton } from "@/components/DemoVerifyButton";
import { ShareProblemButton } from "@/components/ShareProblemButton";

export const dynamic = "force-dynamic";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const problem = await getProblemById(id);

  if (!problem) notFound();

  const sessionId = await getSessionId();
  const existing = sessionId
    ? await prisma.upvote.findFirst({
        where: { problemId: id, sessionId },
      })
    : null;

  const severity = demoSeverityScore({
    createdAt: problem.createdAt,
    status: problem.status,
    upvoteCount: problem._count.upvotes,
  });
  const sev = severityStyle(severity);
  const days = daysOpenSince(problem.createdAt);
  const iso = problem.createdAt.toISOString();

  return (
    <main className="mx-auto w-full max-w-[600px] flex-1 px-3 py-4 pb-8 lg:px-0">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
        The problem
      </p>
      <header className="mt-2 flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--kasa-muted-bg)] text-sm font-bold text-[var(--kasa-forest)] ring-2 ring-[var(--kasa-divider)]">
          {problem.district.charAt(0).toUpperCase() || "K"}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[var(--kasa-text-primary)]">
            Reporter · {problem.district}
          </p>
          <p className="text-[13px] text-[var(--kasa-text-secondary)]">
            📍 {problem.district}, {problem.region} ·{" "}
            {formatRelativeTime(iso)}
          </p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={problem.status} />
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${sev.bg} ${sev.text} ${sev.pulse ? "animate-pulse" : ""}`}
        >
          Severity {severity}
        </span>
        <span className="text-xs text-[var(--kasa-text-secondary)]">
          📅 Open {days}d
        </span>
      </div>

      <h1 className="mt-4 text-2xl font-bold text-[var(--kasa-text-primary)]">
        {categoryEmoji(problem.category)} {categoryLabel(problem.category)}
        {problem.subcategory
          ? ` › ${subcategoryLabel(problem.category, problem.subcategory)}`
          : ""}
      </h1>

      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--kasa-text-primary)]">
        {problem.description}
      </p>

      {problem.evidence.length > 0 ? (
        <section className="mt-6">
          <ul className="flex flex-col gap-3">
            {problem.evidence.map((e) => (
              <li
                key={e.id}
                className="overflow-hidden rounded-xl border border-[var(--kasa-divider)] bg-black/[0.03]"
              >
                {e.type === "photo" ? (
                  <Image
                    src={e.fileUrl}
                    alt="Evidence"
                    width={1200}
                    height={675}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <a
                    href={e.fileUrl}
                    className="block px-4 py-5 text-sm font-semibold text-[var(--kasa-forest)] hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open document
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-[var(--kasa-divider)] py-3">
        <span className="text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          👆 {problem._count.upvotes}
        </span>
        <span className="text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          💬 0
        </span>
        <ShareProblemButton
          path={`/problems/${problem.id}`}
          title={`Kasa · ${problem.district}`}
        />
      </div>

      <div className="mt-6 flex gap-2 rounded-xl bg-[var(--kasa-muted-bg)] p-1">
        <span className="flex-1 rounded-lg bg-[var(--kasa-card)] py-2 text-center text-xs font-bold shadow-sm">
          💬 Responses
        </span>
        <Link
          href="#timeline"
          className="flex-1 rounded-lg py-2 text-center text-xs font-semibold text-[var(--kasa-text-secondary)]"
        >
          📅 Timeline
        </Link>
      </div>

      <section id="timeline" className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
          Timeline (preview)
        </h2>
        <ul className="mt-3 space-y-2 border-l-2 border-[var(--kasa-divider)] pl-4 text-sm text-[var(--kasa-text-secondary)]">
          <li>📝 Reported {formatRelativeTime(iso)}</li>
          <li>◉ Now — awaiting resolution (demo)</li>
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 shadow-[var(--kasa-shadow-1)]">
        <h2 className="text-base font-bold text-[var(--kasa-text-primary)]">
          Your voice
        </h2>
        <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
          Same as the feed: one tap per browser until real sign-in ships.
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
        <div className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-muted-bg)] p-4 text-sm text-[var(--kasa-text-secondary)]">
          <p className="font-semibold text-[var(--kasa-text-primary)]">
            Thread (v2 spec)
          </p>
          <p className="mt-2">
            Official replies, peer solutions, and business offers stack here
            like replies — wired in a later slice.
          </p>
        </div>
      </section>

      <p className="mt-8 text-xs text-[var(--kasa-text-muted)]">
        ID <span className="font-mono text-[var(--kasa-text-primary)]">{problem.id}</span> ·{" "}
        {new Intl.DateTimeFormat("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(problem.createdAt)}
      </p>
    </main>
  );
}
