import {
  PROGRESS_STAGES,
  PROGRESS_STAGE_META,
  type ProblemProgressStage,
} from "@/lib/problem-progress";

export function ProblemProgressTimeline({
  stage,
  createdAtLabel,
}: {
  stage: ProblemProgressStage;
  createdAtLabel: string;
}) {
  const currentIndex = PROGRESS_STAGES.indexOf(stage);

  return (
    <section id="timeline" className="mt-8">
      <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
        Resolution path
      </h2>
      <ul className="mt-3 space-y-3 border-l-2 border-[var(--kasa-divider)] pl-4">
        {PROGRESS_STAGES.map((item, index) => {
          const meta = PROGRESS_STAGE_META[item];
          const active = index <= currentIndex;
          const marker = active ? "bg-[var(--kasa-forest)]" : "bg-[var(--kasa-divider)]";
          return (
            <li key={item} className="relative text-sm text-[var(--kasa-text-secondary)]">
              <span
                className={`absolute -left-[23px] mt-1.5 h-3 w-3 rounded-full ${marker}`}
                aria-hidden
              />
              <p className="font-semibold text-[var(--kasa-text-primary)]">
                {meta.label}
              </p>
              <p className="mt-1">{meta.description}</p>
              {item === "reported" ? (
                <p className="mt-1 text-xs text-[var(--kasa-text-muted)]">
                  First logged {createdAtLabel}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
