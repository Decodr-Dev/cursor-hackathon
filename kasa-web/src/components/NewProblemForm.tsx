"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PROBLEM_CATEGORIES } from "@/lib/categories";
import { NewProblemLocationSection } from "@/components/NewProblemLocationSection";

const PUBLIC_DEMO_SUBMIT_MESSAGE = "Submissions are off on the public demo.";

export function NewProblemForm() {
  const readOnlyDemo = process.env.NEXT_PUBLIC_KASA_READ_ONLY === "1";
  const router = useRouter();
  const [category, setCategory] = useState(PROBLEM_CATEGORIES[0].slug);
  const [region, setRegion] = useState("Greater Accra");
  const [district, setDistrict] = useState("La-Nkwantanang-Madina");
  const [constituency, setConstituency] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const subcategories = useMemo(() => {
    const current = PROBLEM_CATEGORIES.find((item) => item.slug === category);
    return current?.subcategories ?? [];
  }, [category]);

  const submitLabel = pending
    ? "Submitting..."
    : readOnlyDemo
      ? "Preview only"
      : "Submit report";

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);

        if (readOnlyDemo) {
          setError(PUBLIC_DEMO_SUBMIT_MESSAGE);
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
      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-muted-bg)] px-4 py-3 text-sm text-[var(--kasa-text-primary)]"
        >
          {error}
        </div>
      ) : null}

      <fieldset
        disabled={pending}
        className="min-w-0 border-0 p-0 disabled:cursor-not-allowed disabled:opacity-80"
      >
        <div className="flex flex-col gap-5">
          <NewProblemLocationSection
            region={region}
            district={district}
            constituency={constituency}
            latitude={latitude}
            longitude={longitude}
            disabled={pending}
            onRegionChange={setRegion}
            onDistrictChange={setDistrict}
            onConstituencyChange={setConstituency}
            onCoordinatesChange={(nextLatitude, nextLongitude) => {
              setLatitude(nextLatitude);
              setLongitude(nextLongitude);
            }}
          />

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
              {subcategories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-[var(--kasa-ink)]">
            What is happening?
            <textarea
              name="description"
              required
              rows={6}
              maxLength={2000}
              placeholder="Describe the problem clearly so nearby residents can understand what is wrong, where it is, and how urgent it feels."
              className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
            />
            <span className="mt-1 block text-xs text-[var(--kasa-muted)]">
              Up to 2,000 characters.
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--kasa-ink)]">
              Take photo
              <input
                name="evidenceCamera"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                className="mt-2 block w-full text-sm text-[var(--kasa-muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--kasa-wash)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--kasa-ink)]"
              />
              <span className="mt-1 block text-xs text-[var(--kasa-muted)]">
                Opens the camera on supported phones.
              </span>
            </label>

            <label className="block text-sm font-medium text-[var(--kasa-ink)]">
              Attach file
              <input
                name="evidenceFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="mt-2 block w-full text-sm text-[var(--kasa-muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--kasa-wash)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--kasa-ink)]"
              />
              <span className="mt-1 block text-xs text-[var(--kasa-muted)]">
                Image or PDF, max 5MB.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--kasa-forest)] px-5 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
