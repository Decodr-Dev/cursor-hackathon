import Link from "next/link";

export default function ScoresPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-8 sm:max-w-xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--kasa-ink)]">
        Accountability scores
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--kasa-muted)]">
        The public dashboard for officials (maps, rankings, resolution stats) is
        on the roadmap. This tab mirrors the UI spec navigation so the shell
        matches the product story.
      </p>
      <p className="mt-4 text-sm text-[var(--kasa-muted)]">
        ←{" "}
        <Link href="/" className="font-semibold text-[var(--kasa-forest)] hover:underline">
          Back to the stream
        </Link>
      </p>
    </main>
  );
}
