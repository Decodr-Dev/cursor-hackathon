"use client";

import { useTransition } from "react";
import { upvoteProblem, removeUpvote } from "@/app/actions/problems";

type Props = {
  problemId: string;
  count: number;
  hasUpvoted: boolean;
};

export function UpvoteControl({ problemId, count, hasUpvoted }: Props) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2 text-sm text-[var(--kasa-muted)]">
        <span className="font-semibold text-[var(--kasa-ink)]">{count}</span>{" "}
        {count === 1 ? "upvote" : "upvotes"}
      </div>
      {!hasUpvoted ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(() => {
              void upvoteProblem(problemId);
            })
          }
          className="rounded-full bg-[var(--kasa-forest)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Saving…" : "I have this problem too"}
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(() => {
              void removeUpvote(problemId);
            })
          }
          className="rounded-full border border-[var(--kasa-border)] bg-[var(--kasa-wash)] px-4 py-2 text-sm font-medium text-[var(--kasa-ink)] hover:bg-[var(--kasa-border)]/40 disabled:opacity-50"
        >
          {pending ? "Updating…" : "Remove my upvote"}
        </button>
      )}
      <p className="w-full text-xs text-[var(--kasa-muted)]">
        Demo uses a browser cookie so one device gets one upvote per report.
      </p>
    </div>
  );
}
