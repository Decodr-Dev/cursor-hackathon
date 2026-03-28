import { Route, Droplets, Heart, Zap, Shield, Tag } from "lucide-react";
import { categoryLabel, subcategoryLabel } from "@/lib/categories";
import { severityStyle } from "@/lib/civic-metrics";
import type { ProblemStatus } from "@prisma/client";
import { StatusBadge } from "@/components/StatusBadge";
import { ProblemProgressBadge } from "@/components/ProblemProgressBadge";
import type { ProblemProgressStage } from "@/lib/problem-progress";

function CategoryIcon({ slug }: { slug: string }) {
  switch (slug) {
    case "roads_transport":
      return <Route size={20} strokeWidth={1.7} />;
    case "water_sanitation":
      return <Droplets size={20} strokeWidth={1.7} />;
    case "health":
      return <Heart size={20} strokeWidth={1.7} />;
    case "utilities":
      return <Zap size={20} strokeWidth={1.7} />;
    case "governance":
      return <Shield size={20} strokeWidth={1.7} />;
    default:
      return <Tag size={20} strokeWidth={1.7} />;
  }
}

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
  const sev = severityStyle(props.severity);
  return (
    <>
      <header className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--kasa-muted-bg)] text-sm font-bold text-[var(--kasa-accent)] ring-2 ring-[var(--kasa-divider)]">
          {props.district.charAt(0).toUpperCase() || "K"}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[var(--kasa-text-primary)]">
            {props.district}
          </p>
          <p className="text-[13px] text-[var(--kasa-text-secondary)]">
            {props.region} · {props.createdAtLabel}
          </p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={props.status} />
        <ProblemProgressBadge stage={props.progressStage} />
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${sev.bg} ${sev.text}`}
        >
          {sev.label}
        </span>
        <span className="text-xs text-[var(--kasa-text-muted)]">
          {props.daysOpen}d open
        </span>
      </div>

      <h1 className="mt-4 flex items-center gap-2 text-2xl font-bold text-[var(--kasa-text-primary)]">
        <span className="text-[var(--kasa-accent)]">
          <CategoryIcon slug={props.category} />
        </span>
        {categoryLabel(props.category)}
        {props.subcategory ? (
          <span className="text-[var(--kasa-text-muted)]">
            · {subcategoryLabel(props.category, props.subcategory)}
          </span>
        ) : null}
      </h1>

      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--kasa-text-primary)]">
        {props.description}
      </p>
    </>
  );
}
