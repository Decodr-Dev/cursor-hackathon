"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  locationLabel: string;
};

export function NotificationsSheet({ open, onClose, locationLabel }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/45">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close notifications"
        onClick={onClose}
      />
      <aside
        className="relative flex h-full w-full max-w-sm flex-col overflow-y-auto border-l border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-4 py-5 shadow-[var(--kasa-shadow-3)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--kasa-text-muted)]">
              Updates
            </p>
            <h2
              id="notifications-title"
              className="mt-1 text-lg font-semibold text-[var(--kasa-text-primary)]"
            >
              Notifications
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--kasa-divider)] px-3 py-1.5 text-sm font-semibold text-[var(--kasa-text-secondary)] hover:bg-[var(--kasa-muted-bg)]"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <section className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-muted-bg)] p-4">
            <p className="text-sm font-semibold text-[var(--kasa-text-primary)]">
              Watching {locationLabel}
            </p>
            <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
              Nearby issue alerts and verification changes will show up here.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4">
            <p className="text-sm font-semibold text-[var(--kasa-text-primary)]">
              Nothing new yet
            </p>
            <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
              Check back after more reports, replies, or status changes land.
            </p>
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/trending"
            onClick={onClose}
            className="rounded-xl border border-[var(--kasa-divider)] px-4 py-3 text-sm font-semibold text-[var(--kasa-text-primary)] hover:bg-[var(--kasa-muted-bg)]"
          >
            Open trending
          </Link>
          <Link
            href="/scores"
            onClick={onClose}
            className="rounded-xl border border-[var(--kasa-divider)] px-4 py-3 text-sm font-semibold text-[var(--kasa-text-primary)] hover:bg-[var(--kasa-muted-bg)]"
          >
            Open scores
          </Link>
        </div>
      </aside>
    </div>
  );
}
