import { PROBLEM_CATEGORIES } from "@/lib/categories";

type Props = {
  current: { status: string; category: string; q: string };
};

export function FeedToolbar({ current }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] p-4">
      <form className="flex flex-col gap-4" action="/" method="get">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--kasa-muted)]">
            Status
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["pending", "Pending check"],
                ["verified", "Verified"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-[var(--kasa-border)] has-[:checked]:bg-[var(--kasa-forest)] has-[:checked]:text-white has-[:checked]:ring-transparent`}
              >
                <input
                  type="radio"
                  name="status"
                  value={value === "all" ? "" : value}
                  defaultChecked={
                    value === "all"
                      ? current.status === "all"
                      : current.status === value
                  }
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-[var(--kasa-ink)]">
            Category
            <select
              name="category"
              defaultValue={current.category}
              className="mt-1 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2 text-[var(--kasa-ink)] outline-none focus:ring-2 focus:ring-[var(--kasa-forest)]"
            >
              <option value="">Any</option>
              {PROBLEM_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-[var(--kasa-ink)]">
            Search
            <input
              name="q"
              defaultValue={current.q}
              placeholder="District or keywords"
              className="mt-1 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2 text-[var(--kasa-ink)] outline-none placeholder:text-[var(--kasa-muted)] focus:ring-2 focus:ring-[var(--kasa-forest)]"
            />
          </label>
        </div>

        <button
          type="submit"
          className="rounded-full bg-[var(--kasa-forest)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110"
        >
          Update feed
        </button>
      </form>
    </div>
  );
}
