import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/server/auth-service";

export const metadata = {
  title: "Log in · Kasa",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/me");

  return (
    <main className="mx-auto w-full max-w-xl flex-1 py-6">
      <section className="rounded-[2rem] border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-2)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--kasa-trending)]">
          Kasa account
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--kasa-ink)]">
          Log in to your civic profile
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--kasa-text-secondary)]">
          Save your identity in the demo, come back to your activity, and keep
          your account ready for future Ghana Card verification.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </section>

      <p className="mt-4 text-center text-sm text-[var(--kasa-text-secondary)]">
        Prefer to keep browsing?{" "}
        <Link
          href="/"
          className="font-semibold text-[var(--kasa-forest)] hover:underline"
        >
          Return to the feed
        </Link>
      </p>
    </main>
  );
}
