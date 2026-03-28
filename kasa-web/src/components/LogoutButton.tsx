"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setError(null);
          setPending(true);

          try {
            const response = await fetch("/api/v1/auth/logout", {
              method: "POST",
              credentials: "include",
            });

            if (!response.ok) {
              setError("We could not log you out just now.");
              setPending(false);
              return;
            }

            router.refresh();
          } catch {
            setError("Network error. Try again.");
            setPending(false);
          }
        }}
        className="rounded-full border border-[var(--kasa-divider)] px-5 py-3 text-sm font-semibold text-[var(--kasa-text-primary)] hover:bg-[var(--kasa-muted-bg)] disabled:opacity-50"
      >
        {pending ? "Logging out..." : "Log out"}
      </button>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
