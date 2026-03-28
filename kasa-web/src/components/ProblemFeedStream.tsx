import type { ReactNode } from "react";

export function ProblemFeedStream({
  children,
  hasItems,
}: {
  children: ReactNode;
  hasItems: boolean;
}) {
  return (
    <section
      aria-label="Problem stream"
      className="overflow-hidden rounded-none border-y border-[var(--kasa-divider)] bg-[var(--kasa-card)] shadow-[var(--kasa-shadow-1)] sm:rounded-2xl sm:border"
    >
      {hasItems ? (
        children
      ) : (
        <div className="px-6 py-16 text-center text-sm text-[var(--kasa-text-secondary)]">
          No reports match these filters yet.
        </div>
      )}
    </section>
  );
}
