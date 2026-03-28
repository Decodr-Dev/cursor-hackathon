import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/SignupForm";
import { getCurrentUser } from "@/server/auth-service";

export const metadata = {
  title: "Sign up · Kasa",
};

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/me");

  return (
    <main className="mx-auto w-full max-w-xl flex-1 py-6">
      <section className="rounded-[2rem] border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-2)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--kasa-trending)]">
          Join Kasa
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--kasa-ink)]">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--kasa-text-secondary)]">
          Start with a simple email and password now, then layer in stronger
          verification when the full identity roadmap lands.
        </p>
        <div className="mt-8">
          <SignupForm />
        </div>
      </section>

      <p className="mt-4 text-center text-sm text-[var(--kasa-text-secondary)]">
        Just exploring today?{" "}
        <Link
          href="/"
          className="font-semibold text-[var(--kasa-forest)] hover:underline"
        >
          Browse the feed
        </Link>
      </p>
    </main>
  );
}
