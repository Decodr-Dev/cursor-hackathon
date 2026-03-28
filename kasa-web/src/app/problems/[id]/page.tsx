import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import {
  daysOpenSince,
  demoSeverityScore,
  severityStyle,
} from "@/lib/civic-metrics";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { ProblemDetailHero } from "@/components/ProblemDetailHero";
import { ProblemEvidenceList } from "@/components/ProblemEvidenceList";
import { ProblemProgressControls } from "@/components/ProblemProgressControls";
import { ProblemProgressTimeline } from "@/components/ProblemProgressTimeline";
import { ShareProblemButton } from "@/components/ShareProblemButton";
import { UpvoteControl } from "@/components/UpvoteControl";
import { getProblemProgress } from "@/server/problem-progress";
import { getProblemById } from "@/server/problem-service";

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
  const severityCopy = severityStyle(severity);
  const progress = await getProblemProgress(problem.id, problem.status);
  const createdAtLabel = formatRelativeTime(problem.createdAt.toISOString());

  return (
    <main className="mx-auto w-full max-w-[600px] flex-1 px-3 py-4 pb-8 lg:px-0">
      <ProblemDetailHero
        category={problem.category}
        subcategory={problem.subcategory}
        district={problem.district}
        region={problem.region}
        createdAtLabel={createdAtLabel}
        status={problem.status}
        severity={severity}
        severityClassName={`${severityCopy.bg} ${severityCopy.text} ${
          severityCopy.pulse ? "animate-pulse" : ""
        }`}
        progressStage={progress.stage}
        daysOpen={daysOpenSince(problem.createdAt)}
        description={problem.description}
      />

      <ProblemEvidenceList evidence={problem.evidence} />

      <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-[var(--kasa-divider)] py-3">
        <span className="text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          Supporters {problem._count.upvotes}
        </span>
        <span className="text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          Replies 0
        </span>
        <ShareProblemButton
          path={`/problems/${problem.id}`}
          title={`Kasa - ${problem.district}`}
        />
      </div>

      <div className="mt-6 flex gap-2 rounded-xl bg-[var(--kasa-muted-bg)] p-1">
        <span className="flex-1 rounded-lg bg-[var(--kasa-card)] py-2 text-center text-xs font-bold shadow-sm">
          Responses
        </span>
        <Link
          href="#timeline"
          className="flex-1 rounded-lg py-2 text-center text-xs font-semibold text-[var(--kasa-text-secondary)]"
        >
          Timeline
        </Link>
      </div>

      <ProblemProgressTimeline
        stage={progress.stage}
        createdAtLabel={createdAtLabel}
      />

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
        <ProblemProgressControls
          problemId={problem.id}
          currentStage={progress.stage}
        />
        <div className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-muted-bg)] p-4 text-sm text-[var(--kasa-text-secondary)]">
          <p className="font-semibold text-[var(--kasa-text-primary)]">
            How stage changes are managed
          </p>
          <p className="mt-2">
            For the hackathon demo, a validator, organizer, or official can move
            the issue across the stages above. Later we can lock that down with
            roles, audit logs, and official reply threads.
          </p>
        </div>
      </section>

      <p className="mt-8 text-xs text-[var(--kasa-text-muted)]">
        ID <span className="font-mono text-[var(--kasa-text-primary)]">{problem.id}</span> -{" "}
        {new Intl.DateTimeFormat("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(problem.createdAt)}
      </p>
    </main>
  );
}
