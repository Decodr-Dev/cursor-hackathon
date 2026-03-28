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
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--kasa-text-muted)]">
        {localMode ? "Your area" : "National feed"}
      </p>
      <p className="mt-2 text-xl font-bold text-[var(--kasa-text-primary)]">
        {localMode ? label : "Across Ghana"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-[var(--kasa-muted-bg)] px-3 py-1.5 font-medium text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]">
          <span className="font-semibold text-[var(--kasa-forest)]">{stats.todayReports}</span>{" "}
          new today
        </span>
        <span className="rounded-full bg-[var(--kasa-muted-bg)] px-3 py-1.5 font-medium text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]">
          <span className="font-semibold text-[var(--kasa-forest)]">{stats.weekVerified}</span>{" "}
          verified
        </span>
        <span className="rounded-full bg-[var(--kasa-muted-bg)] px-3 py-1.5 font-medium text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-divider)]">
          <span className="font-semibold text-[var(--kasa-trending)]">{stats.totalOpen}</span>{" "}
          open
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/problems/new"
          className="rounded-xl bg-[var(--kasa-gold)] px-4 py-3 text-center text-base font-semibold text-[var(--kasa-gold-on)] shadow-[var(--kasa-shadow-2)]"
        >
          Report a problem
        </Link>
        <Link
          href="/scores"
          className="rounded-xl border-2 border-[var(--kasa-forest)] bg-transparent px-4 py-3 text-center text-base font-semibold text-[var(--kasa-forest)]"
        >
          View accountability scores
        </Link>
      </div>
    </section>
  );
}
