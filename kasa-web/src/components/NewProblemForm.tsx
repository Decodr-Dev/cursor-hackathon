"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PROBLEM_CATEGORIES } from "@/lib/categories";
import { READ_ONLY_DEMO_MESSAGE } from "@/lib/demo-mode";
import { GHANA_REGIONS } from "@/lib/regions";

export function NewProblemForm() {
  const readOnlyDemo = process.env.NEXT_PUBLIC_KASA_READ_ONLY === "1";
  const router = useRouter();
  const [category, setCategory] = useState(PROBLEM_CATEGORIES[0].slug);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const subs = useMemo(() => {
    const current = PROBLEM_CATEGORIES.find((item) => item.slug === category);
    return current?.subcategories ?? [];
  }, [category]);

  const submitLabel = readOnlyDemo
    ? "Public demo is read-only"
    : pending
      ? "Submitting..."
      : "Submit report";

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);

        if (readOnlyDemo) {
          setError(READ_ONLY_DEMO_MESSAGE);
          return;
        }

        setPending(true);
        const formData = new FormData(event.currentTarget);

        try {
          const response = await fetch("/api/v1/problems", {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          const data = (await response.json().catch(() => ({}))) as {
            id?: string;
            error?: string;
          };

          if (!response.ok) {
            setError(data.error ?? "Something went wrong.");
            setPending(false);
            return;
          }

          if (data.id) {
            router.push(`/problems/${data.id}`);
            return;
          }

          setError("Unexpected response from server.");
          setPending(false);
        } catch {
          setError("Network error - try again.");
          setPending(false);
        }
      }}
    >
      {readOnlyDemo ? (
        <div
          role="status"
          className="rounded-2xl border border-[var(--kasa-gold)]/45 bg-[var(--kasa-gold-light)]/60 px-4 py-3 text-sm text-[var(--kasa-gold-on)]"
        >
          {READ_ONLY_DEMO_MESSAGE}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-300/80 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {error}
        </div>
      ) : null}

      <fieldset
        disabled={pending || readOnlyDemo}
        className="min-w-0 border-0 p-0 disabled:cursor-not-allowed disabled:opacity-80"
      >
        <div className="flex flex-col gap-5">
          <label className="block text-sm font-medium text-[var(--kasa-ink)]">
            Category
            <select
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none focus:ring-2 focus:ring-[var(--kasa-forest)]"
            >
              {PROBLEM_CATEGORIES.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-[var(--kasa-ink)]">
            Subcategory (optional)
            <select
              name="subcategory"
              className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none focus:ring-2 focus:ring-[var(--kasa-forest)]"
              defaultValue=""
            >
              <option value="">Select...</option>
              {subs.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--kasa-ink)]">
              Region
              <select
                name="region"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none focus:ring-2 focus:ring-[var(--kasa-forest)]"
                defaultValue="Greater Accra"
              >
                {GHANA_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-[var(--kasa-ink)]">
              District / area
              <input
                name="district"
                required
                placeholder="e.g. La-Nkwantanang"
                className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-[var(--kasa-ink)]">
            What is happening?
            <textarea
              name="description"
              required
              rows={6}
              maxLength={2000}
              placeholder="Describe the problem clearly. In the full product, AI will suggest a category while you type."
              className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
            />
            <span className="mt-1 block text-xs text-[var(--kasa-muted)]">
              Up to 2,000 characters (matches the PRD cap).
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--kasa-ink)]">
              Latitude (optional)
              <input
                name="latitude"
                inputMode="decimal"
                placeholder="e.g. 5.6037"
                className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
              />
            </label>

            <label className="block text-sm font-medium text-[var(--kasa-ink)]">
              Longitude (optional)
              <input
                name="longitude"
                inputMode="decimal"
                placeholder="e.g. -0.1870"
                className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
              />
            </label>
          </div>

          <p className="-mt-2 text-xs text-[var(--kasa-muted)]">
            Real Kasa will confirm GPS from your photo. For this demo you can
            paste coordinates or leave both blank.
          </p>

          <label className="block text-sm font-medium text-[var(--kasa-ink)]">
            Evidence (optional for demo)
            <input
              name="evidence"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="mt-2 block w-full text-sm text-[var(--kasa-muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--kasa-wash)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--kasa-ink)]"
            />
            <span className="mt-1 block text-xs text-[var(--kasa-muted)]">
              JPEG, PNG, WebP, or PDF - max 5MB - stored locally for the
              hackathon only.
            </span>
          </label>

          <button
            type="submit"
            disabled={pending || readOnlyDemo}
            className="rounded-full bg-[var(--kasa-forest)] px-5 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
