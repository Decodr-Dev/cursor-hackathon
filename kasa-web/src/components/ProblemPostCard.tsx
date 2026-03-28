import Image from "next/image";
import Link from "next/link";
import { categoryEmoji, categoryLabel, subcategoryLabel } from "@/lib/categories";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { daysOpenSince, demoSeverityScore, severityStyle } from "@/lib/civic-metrics";
import type { ProblemListRow } from "@/server/problem-service";
import { ShareProblemButton } from "@/components/ShareProblemButton";
import { ProblemProgressBadge } from "@/components/ProblemProgressBadge";
import { StatusBadge } from "@/components/StatusBadge";
import type { ProblemProgressStage } from "@/lib/problem-progress";

export function ProblemPostCard({
  problem,
  progressStage,
}: {
  problem: ProblemListRow;
  progressStage: ProblemProgressStage;
}) {
  const thumb = problem.evidence[0];
  const showPhoto = thumb?.type === "photo";
  const poster = `Reporter · ${problem.district}`;
  const topic = categoryLabel(problem.category);
  const emoji = categoryEmoji(problem.category);
  const sub = problem.subcategory
    ? subcategoryLabel(problem.category, problem.subcategory)
    : null;
  const severity = demoSeverityScore({
    createdAt: problem.createdAt,
    status: problem.status,
    upvoteCount: problem._count.upvotes,
  });
  const sev = severityStyle(severity);
  const days = daysOpenSince(problem.createdAt);
  const desc = problem.description;
  const clipped = desc.length > 220;
  const iso = problem.createdAt.toISOString();

  return (
    <article className="border-b border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-4 py-4 transition hover:bg-[var(--kasa-muted-bg)]/50">
      <Link href={`/problems/${problem.id}`} className="block">
        <header className="flex gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--kasa-muted-bg)] text-sm font-bold text-[var(--kasa-forest)] ring-2 ring-[var(--kasa-divider)]"
            aria-hidden
          >
            {problem.district.charAt(0).toUpperCase() || "K"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <span className="text-[15px] font-semibold text-[var(--kasa-text-primary)]">
                {poster}
              </span>
              <span className="text-[13px] text-[var(--kasa-text-muted)]">·</span>
              <time
                className="text-[13px] text-[var(--kasa-text-muted)]"
                dateTime={iso}
              >
                {formatRelativeTime(iso)}
              </time>
            </div>
            <p className="mt-0.5 text-[13px] text-[var(--kasa-text-secondary)]">
              📍 {problem.district}, {problem.region}
            </p>
          </div>
        </header>

        <p className="mt-3 text-[15px] leading-snug text-[var(--kasa-text-primary)]">
          {clipped ? `${desc.slice(0, 220)}…` : desc}
          {clipped ? (
            <span className="ml-1 font-semibold text-[var(--kasa-forest)]">
              Read more
            </span>
          ) : null}
        </p>

        {showPhoto && thumb ? (
          <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-xl bg-black/5 ring-1 ring-[var(--kasa-divider)]">
            <Image
              src={thumb.fileUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 600px) 100vw, 600px"
            />
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--kasa-muted-bg)] px-2.5 py-1 text-[13px] font-medium text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]">
            {emoji} {topic}
            {sub ? (
              <span className="text-[var(--kasa-text-muted)]">› {sub}</span>
            ) : null}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${sev.bg} ${sev.text} ${sev.pulse ? "animate-pulse" : ""}`}
          >
            Severity {severity}
          </span>
        </div>
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-[var(--kasa-divider)] pt-3">
        <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          <span aria-hidden>👆</span>
          {problem._count.upvotes}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          <span aria-hidden>💬</span>0
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          <span aria-hidden>📅</span>
          {days}d
        </span>
        <ShareProblemButton
          path={`/problems/${problem.id}`}
          title={`Kasa · ${problem.district}`}
        />
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <StatusBadge status={problem.status} />
        <ProblemProgressBadge stage={progressStage} />
      </div>
    </article>
  );
}
