import { categoryEmoji, categoryLabel, subcategoryLabel } from "@/lib/categories";
import type { ProblemStatus } from "@prisma/client";
import { StatusBadge } from "@/components/StatusBadge";
import { ProblemProgressBadge } from "@/components/ProblemProgressBadge";
import type { ProblemProgressStage } from "@/lib/problem-progress";

export function ProblemDetailHero(props: {
  category: string;
  subcategory: string | null;
  district: string;
  region: string;
  createdAtLabel: string;
  status: ProblemStatus;
  severity: number;
  severityClassName: string;
  progressStage: ProblemProgressStage;
  daysOpen: number;
  description: string;
}) {
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
        The problem
      </p>
      <header className="mt-2 flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--kasa-muted-bg)] text-sm font-bold text-[var(--kasa-forest)] ring-2 ring-[var(--kasa-divider)]">
          {props.district.charAt(0).toUpperCase() || "K"}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[var(--kasa-text-primary)]">
            Reporter - {props.district}
          </p>
          <p className="text-[13px] text-[var(--kasa-text-secondary)]">
            {props.district}, {props.region} - {props.createdAtLabel}
          </p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={props.status} />
        <ProblemProgressBadge stage={props.progressStage} />
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${props.severityClassName}`}
        >
          Severity {props.severity}
        </span>
        <span className="text-xs text-[var(--kasa-text-secondary)]">
          Open {props.daysOpen}d
        </span>
      </div>

      <h1 className="mt-4 text-2xl font-bold text-[var(--kasa-text-primary)]">
        {categoryEmoji(props.category)} {categoryLabel(props.category)}
        {props.subcategory
          ? ` > ${subcategoryLabel(props.category, props.subcategory)}`
          : ""}
      </h1>

      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--kasa-text-primary)]">
        {props.description}
      </p>
    </>
  );
}
