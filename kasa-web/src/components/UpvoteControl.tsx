"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  problemId: string;
  count: number;
  hasUpvoted: boolean;
};

export function UpvoteControl({ problemId, count, hasUpvoted }: Props) {
  const readOnlyDemo = process.env.NEXT_PUBLIC_KASA_READ_ONLY === "1";
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2 text-sm text-[var(--kasa-muted)]">
        <span className="font-semibold text-[var(--kasa-ink)]">{count}</span>{" "}
        {count === 1 ? "voice" : "voices"}
      </div>
      {readOnlyDemo ? (
        <button
          type="button"
          disabled
          className="rounded-full border border-[var(--kasa-border)] bg-[var(--kasa-wash)] px-4 py-2 text-sm font-medium text-[var(--kasa-ink)] opacity-50"
        >
          Voting disabled
        </button>
      ) : !hasUpvoted ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(() => {
              void (async () => {
                const res = await fetch(
                  `/api/v1/problems/${problemId}/upvote`,
                  { method: "POST", credentials: "include" },
                );
                if (res.ok) router.refresh();
              })();
            })
          }
          className="rounded-full bg-[var(--kasa-accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Add voice"}
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(() => {
              void (async () => {
                const res = await fetch(
                  `/api/v1/problems/${problemId}/upvote`,
                  { method: "DELETE", credentials: "include" },
                );
                if (res.ok) router.refresh();
              })();
            })
          }
          className="rounded-full border border-[var(--kasa-border)] bg-[var(--kasa-wash)] px-4 py-2 text-sm font-medium text-[var(--kasa-ink)] hover:bg-[var(--kasa-border)]/40 disabled:opacity-50"
        >
          {pending ? "Updating…" : "Remove"}
        </button>
      )}
    </div>
  );
}
