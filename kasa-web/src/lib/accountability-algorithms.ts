function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export type AccountabilityScoreInput = {
  problemsReceived: number;
  problemsAcknowledged: number;
  problemsResolved: number;
  avgResolutionDays: number;
  responseQualityRating: number;
};

export type AccountabilityScoreBreakdown = {
  acknowledgementRatePct: number;
  resolutionRatePct: number;
  timelinessScore: number;
  responseQualityScore: number;
  accountabilityScore: number;
};

export type AccountabilityBand =
  | "critical"
  | "watch"
  | "improving"
  | "trusted";

export function calculateAccountabilityScore(
  input: AccountabilityScoreInput,
): AccountabilityScoreBreakdown {
  const problemsReceived = Math.max(1, Math.round(input.problemsReceived));
  const problemsAcknowledged = clamp(
    Math.round(input.problemsAcknowledged),
    0,
    problemsReceived,
  );
  const problemsResolved = clamp(
    Math.round(input.problemsResolved),
    0,
    problemsAcknowledged,
  );
  const acknowledgementRatePct =
    (problemsAcknowledged / problemsReceived) * 100;
  const resolutionRatePct = (problemsResolved / problemsReceived) * 100;
  const timelinessScore =
    100 - Math.min((Math.max(0, input.avgResolutionDays) / 90) * 100, 100);
  const responseQualityScore =
    ((clamp(input.responseQualityRating, 1, 5) - 1) / 4) * 100;

  const accountabilityScore =
    acknowledgementRatePct * 0.2 +
    resolutionRatePct * 0.4 +
    timelinessScore * 0.25 +
    responseQualityScore * 0.15;

  return {
    acknowledgementRatePct: Math.round(acknowledgementRatePct),
    resolutionRatePct: Math.round(resolutionRatePct),
    timelinessScore: Math.round(timelinessScore),
    responseQualityScore: Math.round(responseQualityScore),
    accountabilityScore: Math.round(clamp(accountabilityScore, 0, 100)),
  };
}

export function accountabilityBand(score: number): AccountabilityBand {
  if (score < 35) return "critical";
  if (score < 50) return "watch";
  if (score < 70) return "improving";
  return "trusted";
}

export function accountabilityBandMeta(score: number) {
  const band = accountabilityBand(score);
  if (band === "critical") {
    return {
      band,
      label: "Needs attention",
      className:
        "bg-[var(--kasa-muted-bg)] text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]",
    };
  }
  if (band === "watch") {
    return {
      band,
      label: "Watch",
      className:
        "bg-[var(--kasa-accent-wash)] text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]",
    };
  }
  if (band === "improving") {
    return {
      band,
      label: "Improving",
      className:
        "bg-[var(--kasa-forest)]/12 text-[var(--kasa-forest)] ring-1 ring-[var(--kasa-forest)]/25",
    };
  }
  return {
    band,
    label: "Trusted",
    className:
      "bg-[var(--kasa-success)]/12 text-[var(--kasa-success)] ring-1 ring-[var(--kasa-success)]/25",
  };
}

export function buildScoreHistory(currentScore: number, trendDelta: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const stepsFromNow = 5 - index;
    const wobble = ((index % 3) - 1) * 2;
    return Math.round(
      clamp(currentScore - trendDelta * stepsFromNow + wobble, 8, 98),
    );
  });
}

export function formatTrendDelta(delta: number) {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `${delta}`;
  return "0";
}
