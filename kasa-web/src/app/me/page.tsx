import Link from "next/link";

export default function MePage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-8 sm:max-w-xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--kasa-ink)]">
        Me
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--kasa-muted)]">
        Citizen profile, Ghana Card verification, and “My Kasa” activity will
        appear here. This demo stays anonymous on purpose.
      </p>
      <p className="mt-4 text-sm text-[var(--kasa-muted)]">
        <Link href="/problems/new" className="font-semibold text-[var(--kasa-forest)] hover:underline">
          Report a problem
        </Link>{" "}
        ·{" "}
        <Link href="/" className="font-semibold text-[var(--kasa-forest)] hover:underline">
          Home
        </Link>
      </p>
    </main>
  );
}
