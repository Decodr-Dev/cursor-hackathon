import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUp, MessageCircle, Clock } from "lucide-react";
import { categoryLabel, subcategoryLabel } from "@/lib/categories";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { daysOpenSince, severityStyle } from "@/lib/civic-metrics";
import type { ProblemListRow } from "@/server/problem-service";
import { ShareProblemButton } from "@/components/ShareProblemButton";
import { ProblemProgressBadge } from "@/components/ProblemProgressBadge";
import { StatusBadge } from "@/components/StatusBadge";
import type { ProblemProgressStage } from "@/lib/problem-progress";

export function ProblemPostCard({
  problem,
  progressStage,
  severity,
}: {
  problem: ProblemListRow;
  progressStage: ProblemProgressStage;
  severity: number;
}) {
  const thumb = problem.evidence[0];
  const showPhoto = thumb?.type === "photo";
  const topic = categoryLabel(problem.category);
  const sub = problem.subcategory
    ? subcategoryLabel(problem.category, problem.subcategory)
    : null;
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--kasa-muted-bg)] text-sm font-bold text-[var(--kasa-accent)] ring-2 ring-[var(--kasa-divider)]"
            aria-hidden
          >
            {problem.district.charAt(0).toUpperCase() || "K"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <span className="text-[15px] font-semibold text-[var(--kasa-text-primary)]">
                {problem.district}
              </span>
              <time
                className="text-[13px] text-[var(--kasa-text-muted)]"
                dateTime={iso}
              >
                {formatRelativeTime(iso)}
              </time>
            </div>
            <p className="mt-0.5 inline-flex items-center gap-1 text-[13px] text-[var(--kasa-text-muted)]">
              <MapPin size={11} strokeWidth={2} />
              {problem.district}, {problem.region}
            </p>
          </div>
        </header>

        <p className="mt-3 text-[15px] leading-snug text-[var(--kasa-text-primary)]">
          {clipped ? `${desc.slice(0, 220)}…` : desc}
          {clipped ? (
            <span className="ml-1 font-semibold text-[var(--kasa-accent)]">
              more
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
            {topic}
            {sub ? (
              <span className="text-[var(--kasa-text-muted)]">· {sub}</span>
            ) : null}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${sev.bg} ${sev.text} ${sev.pulse ? "animate-pulse" : ""}`}
          >
            {sev.label}
          </span>
        </div>
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-[var(--kasa-divider)] pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          <ArrowUp size={13} strokeWidth={2} />
          {problem._count.upvotes}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          <MessageCircle size={13} strokeWidth={2} />0
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--kasa-text-secondary)]">
          <Clock size={13} strokeWidth={2} />
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
