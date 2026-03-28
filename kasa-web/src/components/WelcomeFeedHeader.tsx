import Link from "next/link";
import { isReadOnlyDemo } from "@/lib/demo-mode";
import { getPublicFeedStats } from "@/server/problem-service";
import { locationLabelForFeed } from "@/lib/location";

export async function WelcomeFeedHeader(props: {
  district?: string;
  region?: string;
}) {
  const readOnlyDemo = isReadOnlyDemo();
  const stats = await getPublicFeedStats(props);
  const label = locationLabelForFeed(props);
  const localMode = !!props.district || !!props.region;
  return (
    <section className="border-b border-[var(--kasa-divider)] bg-[var(--kasa-card)] px-4 py-5 shadow-[var(--kasa-shadow-1)] sm:rounded-2xl sm:border">
      <p className="text-lg font-bold text-[var(--kasa-text-primary)]">
        {localMode ? `📍 ${label} right now` : "🇬🇭 What&apos;s happening across Ghana"}
      </p>
      <p className="mt-1 text-sm text-[var(--kasa-text-secondary)]">
        {localMode
          ? "Community issues first, so nearby reports surface before the wider national view."
          : "National civic stream for the demo build. Switch to your district for nearby issues first."}
      </p>
      <ul className="mt-4 space-y-2 border-t border-[var(--kasa-divider)] pt-4 text-sm font-medium text-[var(--kasa-text-primary)]">
        <li>
          <span className="text-[var(--kasa-forest)]">{stats.todayReports}</span>{" "}
          new reports today
        </li>
        <li>
          <span className="text-[var(--kasa-forest)]">{stats.weekVerified}</span>{" "}
          marked verified this week
        </li>
        <li>
          <span className="text-[var(--kasa-trending)]">{stats.totalOpen}</span>{" "}
          still awaiting community check
        </li>
      </ul>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/problems/new"
          className="rounded-xl bg-[var(--kasa-gold)] px-4 py-3 text-center text-base font-semibold text-[var(--kasa-gold-on)] shadow-[var(--kasa-shadow-2)]"
        >
          {readOnlyDemo ? "Preview the report flow" : "Join Kasa — report a problem"}
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
