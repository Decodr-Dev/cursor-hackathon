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
          className="rounded-full border border-[var(--kasa-border)] bg-[var(--kasa-wash)] px-4 py-2 text-sm font-medium text-[var(--kasa-ink)] opacity-70"
        >
          Voting disabled on public demo
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
          {pending ? "Updating…" : "Remove my voice"}
        </button>
      )}
      <p className="w-full text-xs text-[var(--kasa-muted)]">
        {readOnlyDemo
          ? "Voting stays off on the public demo."
          : "Demo: one vote per report on this browser (cookie), until real sign-in ships."}
      </p>
    </div>
  );
}
