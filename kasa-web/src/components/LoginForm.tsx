"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setPending(true);

        const formData = new FormData(event.currentTarget);

        try {
          const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: String(formData.get("email") ?? ""),
              password: String(formData.get("password") ?? ""),
            }),
          });

          const data = (await response.json().catch(() => ({}))) as {
            error?: string;
          };

          if (!response.ok) {
            setError(data.error ?? "We could not log you in.");
            setPending(false);
            return;
          }

          router.push("/me");
          router.refresh();
        } catch {
          setError("Network error. Try again.");
          setPending(false);
        }
      }}
    >
      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-300/80 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {error}
        </div>
      ) : null}

      <label className="block text-sm font-medium text-[var(--kasa-ink)]">
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
        />
      </label>

      <label className="block text-sm font-medium text-[var(--kasa-ink)]">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--kasa-forest)] px-5 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-50"
      >
        {pending ? "Logging in..." : "Log in"}
      </button>

      <p className="text-sm text-[var(--kasa-text-secondary)]">
        New here?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[var(--kasa-forest)] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
