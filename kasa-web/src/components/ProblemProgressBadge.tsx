import {
  PROGRESS_STAGE_META,
  type ProblemProgressStage,
} from "@/lib/problem-progress";

export function ProblemProgressBadge({
  stage,
}: {
  stage: ProblemProgressStage;
}) {
  const meta = PROGRESS_STAGE_META[stage];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.chipClassName}`}
    >
      {meta.shortLabel}
    </span>
  );
}
