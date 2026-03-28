import type { ProblemStatus } from "@prisma/client";
import { getDistrictsForRegion } from "@/lib/ghana-admin";
import type { ProblemProgressStage } from "@/lib/problem-progress";

export const COST_OF_INACTION_ALERT_THRESHOLD = 60;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function daysOpenSince(createdAt: Date): number {
  return Math.max(
    0,
    Math.floor((Date.now() - createdAt.getTime()) / 86_400_000),
  );
}

export type SeverityBand = "low" | "moderate" | "high" | "critical";

export type SeverityScoreInput = {
  createdAt: Date;
  status: ProblemStatus;
  upvoteCount: number;
  progressStage?: ProblemProgressStage;
  reporterCount?: number;
  uniqueDistrictCount?: number;
  totalDistrictsInRegion?: number;
  reportsLast7Days?: number;
  reportsPrevious7Days?: number;
  officiallyAcknowledged?: boolean;
  mediaVerified?: boolean;
};

export type SeverityScoreBreakdown = {
  reporterCount: number;
  uniqueDistrictCount: number;
  totalDistrictsInRegion: number;
  reportsLast7Days: number;
  reportsPrevious7Days: number;
  daysOpen: number;
  normalisedReporterCount: number;
  geographicSpreadScore: number;
  durationScore: number;
  accelerationRate: number;
  escalationBonus: number;
  officiallyAcknowledged: boolean;
  mediaVerified: boolean;
  severityScore: number;
  band: SeverityBand;
};

export type ProblemSeverityRecord = {
  id: string;
  category: string;
  region: string;
  district: string;
  createdAt: Date;
  status: ProblemStatus;
  upvoteCount: number;
  progressStage?: ProblemProgressStage;
  officiallyAcknowledged?: boolean;
  mediaVerified?: boolean;
};

export type ProblemSeveritySnapshot = SeverityScoreBreakdown & {
  costOfInactionPerDay: number;
};

function normaliseAccelerationScore(
  reportsLast7Days: number,
  reportsPrevious7Days: number,
) {
  const ratio = reportsLast7Days / Math.max(reportsPrevious7Days, 1);
  return clamp((Math.min(ratio, 2) / 2) * 100, 0, 100);
}

export function severityBand(score: number): SeverityBand {
  if (score < 30) return "low";
  if (score < 60) return "moderate";
  if (score < 80) return "high";
  return "critical";
}

function inferOfficiallyAcknowledged(input: SeverityScoreInput) {
  if (typeof input.officiallyAcknowledged === "boolean") {
    return input.officiallyAcknowledged;
  }

  return input.progressStage === "in_progress" || input.progressStage === "resolved";
}

function inferMediaVerified(
  input: SeverityScoreInput,
  reporterCount: number,
  daysOpen: number,
  uniqueDistrictCount: number,
) {
  if (typeof input.mediaVerified === "boolean") {
    return input.mediaVerified;
  }

  if (!inferOfficiallyAcknowledged(input)) {
    return false;
  }

  // Demo fallback until media accounts and formal escalation logs exist.
  return reporterCount >= 20 && daysOpen >= 3 && uniqueDistrictCount >= 2;
}

export function calculateSeverityBreakdown(
  input: SeverityScoreInput,
): SeverityScoreBreakdown {
  const reporterCount = Math.max(1, Math.round(input.reporterCount ?? input.upvoteCount + 1));
  const uniqueDistrictCount = Math.max(
    1,
    Math.round(input.uniqueDistrictCount ?? 1),
  );
  const totalDistrictsInRegion = Math.max(
    uniqueDistrictCount,
    Math.round(input.totalDistrictsInRegion ?? uniqueDistrictCount),
  );
  const reportsLast7Days = Math.max(
    0,
    Math.round(input.reportsLast7Days ?? Math.max(1, Math.ceil(reporterCount / 4))),
  );
  const reportsPrevious7Days = Math.max(
    0,
    Math.round(
      input.reportsPrevious7Days ?? Math.max(1, Math.ceil(reporterCount / 6)),
    ),
  );
  const daysOpen = daysOpenSince(input.createdAt);
  const normalisedReporterCount = Math.min(reporterCount / 100, 1) * 100;
  const geographicSpreadScore =
    (uniqueDistrictCount / Math.max(totalDistrictsInRegion, 1)) * 100;
  const durationScore = Math.min(daysOpen / 90, 1) * 100;
  const accelerationRate = normaliseAccelerationScore(
    reportsLast7Days,
    reportsPrevious7Days,
  );
  const officiallyAcknowledged = inferOfficiallyAcknowledged(input);
  const mediaVerified = inferMediaVerified(
    input,
    reporterCount,
    daysOpen,
    uniqueDistrictCount,
  );
  const escalationBonus = mediaVerified ? 50 : officiallyAcknowledged ? 30 : 0;

  const severityScore =
    normalisedReporterCount * 0.25 +
    geographicSpreadScore * 0.2 +
    durationScore * 0.2 +
    accelerationRate * 0.2 +
    escalationBonus * 0.15;

  const roundedScore = Math.round(clamp(severityScore, 0, 100));

  return {
    reporterCount,
    uniqueDistrictCount,
    totalDistrictsInRegion,
    reportsLast7Days,
    reportsPrevious7Days,
    daysOpen,
    normalisedReporterCount: Math.round(normalisedReporterCount),
    geographicSpreadScore: Math.round(geographicSpreadScore),
    durationScore: Math.round(durationScore),
    accelerationRate: Math.round(accelerationRate),
    escalationBonus,
    officiallyAcknowledged,
    mediaVerified,
    severityScore: roundedScore,
    band: severityBand(roundedScore),
  };
}

export function calculateSeverityScore(input: SeverityScoreInput): number {
  return calculateSeverityBreakdown(input).severityScore;
}

export function severityStyle(score: number): {
  label: string;
  bg: string;
  text: string;
  pulse: boolean;
} {
  const band = severityBand(score);

  if (band === "low") {
    return {
      label: "Low",
      bg: "bg-[var(--kasa-severity-low)]",
      text: "text-[var(--kasa-severity-low-text)]",
      pulse: false,
    };
  }
  if (band === "moderate") {
    return {
      label: "Moderate",
      bg: "bg-[var(--kasa-severity-medium)]",
      text: "text-[var(--kasa-severity-medium-text)]",
      pulse: false,
    };
  }
  if (band === "high") {
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

export function calculateTrendPulse(input: {
  totalReports: number;
  recentReports: number;
  verifiedReports: number;
}) {
  const volumeScore = clamp((input.totalReports / 12) * 100, 0, 100);
  const recentShare =
    input.totalReports > 0 ? (input.recentReports / input.totalReports) * 100 : 0;
  const verifiedShare =
    input.totalReports > 0
      ? (input.verifiedReports / input.totalReports) * 100
      : 0;

  return Math.round(
    clamp(volumeScore * 0.45 + recentShare * 0.35 + verifiedShare * 0.2, 0, 100),
  );
}

export function estimateCostOfInactionPerDay(input: {
  category: string;
  severityScore: number;
  reporterCount: number;
}) {
  const categoryModel: Record<string, { baseline: number; perReporter: number }> = {
    roads_transport: { baseline: 780, perReporter: 72 },
    water_sanitation: { baseline: 980, perReporter: 88 },
    health: { baseline: 1180, perReporter: 95 },
    utilities: { baseline: 940, perReporter: 84 },
    governance: { baseline: 620, perReporter: 58 },
    other: { baseline: 420, perReporter: 38 },
  };
  const model = categoryModel[input.category] ?? categoryModel.other;
  const urgencyMultiplier = 0.35 + input.severityScore / 100;
  return Math.round(
    (model.baseline + input.reporterCount * model.perReporter) * urgencyMultiplier,
  );
}

type SeverityPeerGroup = {
  uniqueDistrictCount: number;
  totalDistrictsInRegion: number;
  reportsLast7Days: number;
  reportsPrevious7Days: number;
};

function buildSeverityPeerGroups(records: ProblemSeverityRecord[]) {
  const grouped = new Map<
    string,
    {
      districts: Set<string>;
      totalDistrictsInRegion: number;
      reportsLast7Days: number;
      reportsPrevious7Days: number;
    }
  >();

  for (const record of records) {
    const key = `${record.region}::${record.category}`;
    const current = grouped.get(key) ?? {
      districts: new Set<string>(),
      totalDistrictsInRegion: Math.max(1, getDistrictsForRegion(record.region).length),
      reportsLast7Days: 0,
      reportsPrevious7Days: 0,
    };

    current.districts.add(record.district);
    const daysOpen = daysOpenSince(record.createdAt);
    if (daysOpen <= 7) {
      current.reportsLast7Days += 1;
    } else if (daysOpen <= 14) {
      current.reportsPrevious7Days += 1;
    }

    grouped.set(key, current);
  }

  return grouped;
}

function getPeerGroupForRecord(
  record: ProblemSeverityRecord,
  grouped: Map<
    string,
    {
      districts: Set<string>;
      totalDistrictsInRegion: number;
      reportsLast7Days: number;
      reportsPrevious7Days: number;
    }
  >,
): SeverityPeerGroup {
  const key = `${record.region}::${record.category}`;
  const current = grouped.get(key);

  if (!current) {
    return {
      uniqueDistrictCount: 1,
      totalDistrictsInRegion: Math.max(1, getDistrictsForRegion(record.region).length || 1),
      reportsLast7Days: 1,
      reportsPrevious7Days: 0,
    };
  }

  return {
    uniqueDistrictCount: Math.max(1, current.districts.size),
    totalDistrictsInRegion: Math.max(
      current.districts.size,
      current.totalDistrictsInRegion,
    ),
    reportsLast7Days: current.reportsLast7Days,
    reportsPrevious7Days: current.reportsPrevious7Days,
  };
}

export function buildProblemSeveritySnapshots(records: ProblemSeverityRecord[]) {
  const uniqueRecords = Array.from(
    new Map(records.map((record) => [record.id, record])).values(),
  );
  const grouped = buildSeverityPeerGroups(uniqueRecords);

  return Object.fromEntries(
    uniqueRecords.map((record) => {
      const peerGroup = getPeerGroupForRecord(record, grouped);
      const breakdown = calculateSeverityBreakdown({
        createdAt: record.createdAt,
        status: record.status,
        upvoteCount: record.upvoteCount,
        progressStage: record.progressStage,
        reporterCount: record.upvoteCount + 1,
        uniqueDistrictCount: peerGroup.uniqueDistrictCount,
        totalDistrictsInRegion: peerGroup.totalDistrictsInRegion,
        reportsLast7Days: peerGroup.reportsLast7Days,
        reportsPrevious7Days: peerGroup.reportsPrevious7Days,
        officiallyAcknowledged: record.officiallyAcknowledged,
        mediaVerified: record.mediaVerified,
      });

      const snapshot: ProblemSeveritySnapshot = {
        ...breakdown,
        costOfInactionPerDay: estimateCostOfInactionPerDay({
          category: record.category,
          severityScore: breakdown.severityScore,
          reporterCount: breakdown.reporterCount,
        }),
      };

      return [record.id, snapshot];
    }),
  ) as Record<string, ProblemSeveritySnapshot>;
}
