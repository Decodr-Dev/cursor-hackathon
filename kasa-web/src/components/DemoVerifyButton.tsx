"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function DemoVerifyButton({ problemId }: { problemId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="rounded-2xl border border-dashed border-amber-400/80 bg-amber-50/80 p-4 text-sm dark:bg-amber-950/30">
      <p className="font-medium text-amber-950 dark:text-amber-100">
        Hackathon demo shortcut
      </p>
      <p className="mt-1 text-amber-950/80 dark:text-amber-100/80">
        In the real product, nearby residents confirm a report within 24 hours.
        Here you can flip the status to &quot;Verified&quot; to see how the
        feed changes.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(() => {
            void (async () => {
              const res = await fetch(
                `/api/v1/problems/${problemId}/demo-verify`,
                { method: "POST", credentials: "include" },
              );
              if (res.ok) router.refresh();
            })();
          })
        }
        className="mt-3 rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Mark community verified (demo)"}
      </button>
    </div>
  );
}
