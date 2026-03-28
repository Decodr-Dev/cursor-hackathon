import Link from "next/link";
import { NewProblemForm } from "@/components/NewProblemForm";

export const metadata = {
  title: "Report a problem - Kasa",
};

export default function NewProblemPage() {
  return (
    <main className="mx-auto w-full max-w-[600px] flex-1 px-3 py-4">
      <div className="mb-6 flex items-center justify-between border-b border-[var(--kasa-divider)] pb-3">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--kasa-leaf)] hover:underline"
        >
          Cancel
        </Link>
        <h1 className="text-sm font-bold text-[var(--kasa-text-primary)]">
          Report a problem
        </h1>
        <span className="w-14" aria-hidden />
      </div>

      <p className="text-sm text-[var(--kasa-text-secondary)]">
        Add the location, explain what is wrong, and include a photo or file if
        you have one.
      </p>

      <div className="mt-6 rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 shadow-[var(--kasa-shadow-1)] sm:p-6">
        <NewProblemForm />
      </div>
    </main>
  );
}
