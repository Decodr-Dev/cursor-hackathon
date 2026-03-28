import type { ProblemStatus } from "@prisma/client";

export const PROGRESS_STAGES = [
  "reported",
  "community_review",
  "verified",
  "in_progress",
  "resolved",
] as const;

export type ProblemProgressStage = (typeof PROGRESS_STAGES)[number];

export const PROGRESS_STAGE_META: Record<
  ProblemProgressStage,
  {
    label: string;
    shortLabel: string;
    description: string;
    chipClassName: string;
  }
> = {
  reported: {
    label: "Reported",
    shortLabel: "Reported",
    description: "A resident has posted the issue to the feed.",
    chipClassName:
      "bg-[var(--kasa-muted-bg)] text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]",
  },
  community_review: {
    label: "Community review",
    shortLabel: "Review",
    description: "Nearby people are confirming the issue is real and current.",
    chipClassName:
      "bg-[var(--kasa-muted-bg)] text-[var(--kasa-text-secondary)] ring-1 ring-[var(--kasa-divider)]",
  },
  verified: {
    label: "Community verified",
    shortLabel: "Verified",
    description: "The issue has enough community confidence to move forward.",
    chipClassName:
      "bg-[var(--kasa-success)]/12 text-[var(--kasa-success)] ring-1 ring-[var(--kasa-success)]/25",
  },
  in_progress: {
    label: "In progress",
    shortLabel: "Working",
    description: "An official, business, or organizer is actively working on it.",
    chipClassName:
      "bg-[var(--kasa-forest)]/12 text-[var(--kasa-forest)] ring-1 ring-[var(--kasa-forest)]/25",
  },
  resolved: {
    label: "Resolved",
    shortLabel: "Resolved",
    description: "The issue is marked fixed for the demo.",
    chipClassName:
      "bg-[var(--kasa-success)]/18 text-[var(--kasa-success)] ring-1 ring-[var(--kasa-success)]/30",
  },
};

export function defaultProgressStageForStatus(
  status: ProblemStatus,
): ProblemProgressStage {
  return status === "COMMUNITY_VERIFIED" ? "verified" : "community_review";
}
