import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--kasa-border)] bg-[color-mix(in_oklab,var(--kasa-surface)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--kasa-ink)]">
            Kasa
          </span>
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[var(--kasa-muted)]">
            Speak · Ghana
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-[var(--kasa-ink)] hover:bg-[var(--kasa-wash)]"
          >
            Feed
          </Link>
          <Link
            href="/problems/new"
            className="rounded-full bg-[var(--kasa-forest)] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:brightness-110"
          >
            Report
          </Link>
        </nav>
      </div>
    </header>
  );
}
