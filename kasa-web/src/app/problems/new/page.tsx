import Link from "next/link";
import { NewProblemForm } from "@/components/NewProblemForm";

export const metadata = {
  title: "Report a problem · Kasa",
};

export default function NewProblemPage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
      <Link
        href="/"
        className="text-sm font-medium text-[var(--kasa-forest)] hover:underline"
      >
        ← Back to feed
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--kasa-ink)]">
        Report a problem
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--kasa-muted)]">
        Share what you are seeing. Full Kasa will verify your identity with a
        Ghana Card or phone number before publishing — skipped here so you can
        explore the flow quickly.
      </p>
      <div className="mt-8 rounded-3xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] p-5 sm:p-6">
        <NewProblemForm />
      </div>
    </main>
  );
}
