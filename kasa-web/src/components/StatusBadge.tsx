import type { ProblemStatus } from "@prisma/client";

const copy: Record<
  ProblemStatus,
  { label: string; className: string }
> = {
  PENDING_VERIFICATION: {
    label: "Pending check",
    className:
      "bg-amber-100 text-amber-950 ring-1 ring-amber-300/70 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-800/80",
  },
  COMMUNITY_VERIFIED: {
    label: "Verified",
    className:
      "bg-emerald-100 text-emerald-950 ring-1 ring-emerald-300/70 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-800/80",
  },
};

export function StatusBadge({ status }: { status: ProblemStatus }) {
  const s = copy[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  );
}
