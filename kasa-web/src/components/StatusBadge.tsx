import type { ProblemStatus } from "@prisma/client";

const copy: Record<
  ProblemStatus,
  { label: string; className: string }
> = {
  PENDING_VERIFICATION: {
    label: "Unverified",
    className:
      "bg-[#1a1100] text-amber-400 ring-1 ring-amber-400/20",
  },
  COMMUNITY_VERIFIED: {
    label: "Verified",
    className:
      "bg-[#0a1a0a] text-emerald-400 ring-1 ring-emerald-400/20",
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
