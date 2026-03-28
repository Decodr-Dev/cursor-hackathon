"use client";

import { useActionState, useMemo, useState } from "react";
import { createProblem, type CreateProblemState } from "@/app/actions/problems";
import { PROBLEM_CATEGORIES } from "@/lib/categories";
import { GHANA_REGIONS } from "@/lib/regions";

export function NewProblemForm() {
  const [category, setCategory] = useState(PROBLEM_CATEGORIES[0].slug);
  const [state, action, pending] = useActionState<
    CreateProblemState,
    FormData
  >(createProblem, null);

  const subs = useMemo(() => {
    const c = PROBLEM_CATEGORIES.find((x) => x.slug === category);
    return c?.subcategories ?? [];
  }, [category]);

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-300/80 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </div>
      ) : null}

      <label className="block text-sm font-medium text-[var(--kasa-ink)]">
        Category
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none focus:ring-2 focus:ring-[var(--kasa-forest)]"
        >
          {PROBLEM_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
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
          <option value="">Select…</option>
          {subs.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
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
            {GHANA_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
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
          JPEG, PNG, WebP, or PDF · max 5MB · stored locally for the hackathon
          only.
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--kasa-forest)] px-5 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit report"}
      </button>
    </form>
  );
}
