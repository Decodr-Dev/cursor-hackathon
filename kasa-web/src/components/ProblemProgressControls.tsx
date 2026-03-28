"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  PROGRESS_STAGES,
  PROGRESS_STAGE_META,
  type ProblemProgressStage,
} from "@/lib/problem-progress";

export function ProblemProgressControls({
  problemId,
  currentStage,
}: {
  problemId: string;
  currentStage: ProblemProgressStage;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="rounded-2xl border border-dashed border-[var(--kasa-forest)]/25 bg-[var(--kasa-muted-bg)] p-4 text-sm">
      <p className="font-semibold text-[var(--kasa-text-primary)]">
        Hackathon demo progress controls
      </p>
      <p className="mt-1 text-[var(--kasa-text-secondary)]">
        Nearby residents and moderators can move an issue through the stages for
        the demo. In the full product this would be permissioned for community
        validators, officials, and trusted partners.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROGRESS_STAGES.map((stage) => {
          const active = stage === currentStage;
          return (
            <button
              key={stage}
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(() => {
                  void (async () => {
                    const response = await fetch(
                      `/api/v1/problems/${problemId}/progress`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ stage }),
                      },
                    );
                    if (response.ok) router.refresh();
                  })();
                })
              }
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                active
                  ? "bg-[var(--kasa-forest)] text-white"
                  : "border border-[var(--kasa-divider)] bg-white text-[var(--kasa-text-primary)] hover:border-[var(--kasa-forest)]/30"
              }`}
            >
              {pending && active
                ? "Updating..."
                : PROGRESS_STAGE_META[stage].shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
