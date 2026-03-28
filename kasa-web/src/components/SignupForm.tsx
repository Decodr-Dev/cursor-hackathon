"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
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
          const response = await fetch("/api/v1/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: String(formData.get("name") ?? ""),
              email: String(formData.get("email") ?? ""),
              password: String(formData.get("password") ?? ""),
              confirmPassword: String(formData.get("confirmPassword") ?? ""),
            }),
          });

          const data = (await response.json().catch(() => ({}))) as {
            error?: string;
          };

          if (!response.ok) {
            setError(data.error ?? "We could not create your account.");
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
        Full name
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Ama Mensah"
          className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
        />
      </label>

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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[var(--kasa-ink)]">
          Password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            placeholder="At least 8 characters"
            className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--kasa-ink)]">
          Confirm password
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            placeholder="Re-enter password"
            className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
          />
        </label>
      </div>

      <p className="-mt-1 text-xs text-[var(--kasa-muted)]">
        This is a demo account flow for the hackathon build. Ghana Card
        verification can plug in later without replacing these screens.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--kasa-forest)] px-5 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-50"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-sm text-[var(--kasa-text-secondary)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--kasa-forest)] hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
