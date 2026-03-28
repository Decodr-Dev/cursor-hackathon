import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { getCurrentUser } from "@/server/auth-service";

export const dynamic = "force-dynamic";

function formatMemberDate(date: Date) {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
  }).format(date);
}

export default async function MePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-lg px-4 py-8 sm:max-w-xl">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--kasa-ink)]">
          Me
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--kasa-muted)]">
          You are browsing anonymously right now. Create an account to save your
          Kasa identity and come back to the same profile later.
        </p>

        <section className="mt-6 rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-1)]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--kasa-trending)]">
            Account access
          </p>
          <h2 className="mt-3 text-xl font-semibold text-[var(--kasa-ink)]">
            Log in or sign up
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--kasa-text-secondary)]">
            The demo still lets anyone browse and report, but these new account
            screens are ready for citizen profiles and future verification.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-full bg-[var(--kasa-forest)] px-5 py-3 text-center text-sm font-semibold text-white shadow-md hover:brightness-110"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-[var(--kasa-divider)] px-5 py-3 text-center text-sm font-semibold text-[var(--kasa-text-primary)] hover:bg-[var(--kasa-muted-bg)]"
            >
              Create account
            </Link>
          </div>
        </section>

        <p className="mt-4 text-sm text-[var(--kasa-muted)]">
          <Link
            href="/problems/new"
            className="font-semibold text-[var(--kasa-forest)] hover:underline"
          >
            Report a problem
          </Link>{" "}
          ·{" "}
          <Link
            href="/"
            className="font-semibold text-[var(--kasa-forest)] hover:underline"
          >
            Home
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-8 sm:max-w-xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--kasa-ink)]">
        Me
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--kasa-muted)]">
        Your account is now active in the demo. This is where profile details,
        verification, and My Kasa activity can grow from.
      </p>

      <section className="mt-6 rounded-3xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-1)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--kasa-trending)]">
          Signed in
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--kasa-ink)]">
          {user.name}
        </h2>
        <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
          {user.email}
        </p>
        <dl className="mt-5 grid gap-4 rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-muted-bg)] p-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
              Member since
            </dt>
            <dd className="mt-1 text-sm text-[var(--kasa-text-primary)]">
              {formatMemberDate(user.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
              Verification
            </dt>
            <dd className="mt-1 text-sm text-[var(--kasa-text-primary)]">
              Email-password demo account
            </dd>
          </div>
        </dl>
        <div className="mt-5">
          <LogoutButton />
        </div>
      </section>

      <p className="mt-4 text-sm text-[var(--kasa-muted)]">
        <Link
          href="/problems/new"
          className="font-semibold text-[var(--kasa-forest)] hover:underline"
        >
          Report a problem
        </Link>{" "}
        ·{" "}
        <Link
          href="/"
          className="font-semibold text-[var(--kasa-forest)] hover:underline"
        >
          Home
        </Link>
      </p>
    </main>
  );
}
