import Link from "next/link";
import { getPublicFeedStats } from "@/server/problem-service";
import { locationLabelForFeed } from "@/lib/location";

export async function WelcomeFeedHeader(props: {
  district?: string;
  region?: string;
}) {
  const stats = await getPublicFeedStats(props);
  const label = locationLabelForFeed(props);
  const localMode = !!props.district || !!props.region;

  return (
    <section className="border-b border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-4 py-5 shadow-[var(--kasa-shadow-1)] sm:rounded-2xl sm:border">
      <p className="text-xl font-bold text-[var(--kasa-text-primary)]">
        {localMode ? label : "Across Ghana"}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-[var(--kasa-muted-bg)] px-3 py-1.5 font-medium text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]">
          <span className="font-semibold text-[var(--kasa-accent)]">{stats.todayReports}</span>{" "}
          today
        </span>
        <span className="rounded-full bg-[var(--kasa-muted-bg)] px-3 py-1.5 font-medium text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]">
          <span className="font-semibold text-[var(--kasa-accent)]">{stats.weekVerified}</span>{" "}
          verified
        </span>
        <span className="rounded-full bg-[var(--kasa-muted-bg)] px-3 py-1.5 font-medium text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]">
          <span className="font-semibold text-[var(--kasa-accent-soft)]">{stats.totalOpen}</span>{" "}
          open
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/problems/new"
          className="rounded-xl bg-[var(--kasa-accent)] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[var(--kasa-shadow-2)]"
        >
          Report a problem
        </Link>
        <Link
          href="/scores"
          className="rounded-xl border border-[var(--kasa-divider)] bg-transparent px-4 py-2.5 text-center text-sm font-semibold text-[var(--kasa-text-secondary)] hover:bg-[var(--kasa-muted-bg)]"
        >
          Accountability scores
        </Link>
      </div>
    </section>
  );
}
