import type { ProblemStatus } from "@prisma/client";

/** Demo-only severity (v2 spec §22) until PRD scoring ships. */
export function demoSeverityScore(input: {
  createdAt: Date;
  status: ProblemStatus;
  upvoteCount: number;
}): number {
  const days = Math.max(
    0,
    (Date.now() - input.createdAt.getTime()) / 86_400_000,
  );
  const base =
    8 +
    input.upvoteCount * 2.4 +
    Math.min(days * 1.4, 42) +
    (input.status === "COMMUNITY_VERIFIED" ? 10 : 0);
  return Math.min(100, Math.round(base));
}

export function severityStyle(score: number): {
  label: string;
  bg: string;
  text: string;
  pulse: boolean;
} {
  if (score < 30) {
    return {
      label: "Low",
      bg: "bg-[var(--kasa-severity-low)]",
      text: "text-[var(--kasa-severity-low-text)]",
      pulse: false,
    };
  }
  if (score < 60) {
    return {
      label: "Moderate",
      bg: "bg-[var(--kasa-severity-medium)]",
      text: "text-[var(--kasa-severity-medium-text)]",
      pulse: false,
    };
  }
  if (score < 80) {
    return {
      label: "High",
      bg: "bg-[var(--kasa-severity-high)]",
      text: "text-[var(--kasa-severity-high-text)]",
      pulse: false,
    };
  }
  return {
    label: "Critical",
    bg: "bg-[var(--kasa-severity-critical)]",
    text: "text-[var(--kasa-severity-critical-text)]",
    pulse: true,
  };
}

export function daysOpenSince(createdAt: Date): number {
  return Math.max(
    0,
    Math.floor((Date.now() - createdAt.getTime()) / 86_400_000),
  );
}
