"use client";

import { Suspense, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { AppTopBar, type StackProps } from "@/components/AppTopBar";
import { FeedAutoLocation } from "@/components/FeedAutoLocation";
import { FeedFiltersSheet } from "@/components/FeedFiltersSheet";
import { LocationSheet } from "@/components/LocationSheet";
import { MobileDock } from "@/components/MobileDock";
import { NotificationsSheet } from "@/components/NotificationsSheet";
import type { FeedSearchState } from "@/lib/feed-url";
import { locationLabelForFeed } from "@/lib/location";

const FEED_SORTS = new Set(["for_you", "latest", "most_upvoted", "most_severe"]);

function stackBarFor(pathname: string): StackProps | null {
  if (pathname.startsWith("/problems/") && pathname !== "/problems/new") {
    return {
      variant: "stack",
      title: "Thread",
      backHref: "/",
      sharePath: pathname,
      shareTitle: "Kasa report",
    };
  }
  if (pathname.startsWith("/trending")) {
    return { variant: "stack", title: "Trending", backHref: "/" };
  }
  if (pathname.startsWith("/scores")) {
    return { variant: "stack", title: "Scores", backHref: "/" };
  }
  if (pathname.startsWith("/me")) {
    return { variant: "stack", title: "Me", backHref: "/" };
  }
  if (pathname.startsWith("/problems/new")) {
    return { variant: "stack", title: "Report", backHref: "/" };
  }
  if (pathname.startsWith("/login")) {
    return { variant: "stack", title: "Log in", backHref: "/" };
  }
  if (pathname.startsWith("/signup")) {
    return { variant: "stack", title: "Sign up", backHref: "/" };
  }
  return null;
}

function isAuthRoute(pathname: string) {
  return pathname.startsWith("/login") || pathname.startsWith("/signup");
}

function parseFeedState(searchParams: ReturnType<typeof useSearchParams>): FeedSearchState {
  const sortRaw = searchParams.get("sort") ?? "latest";
  const sort = FEED_SORTS.has(sortRaw) ? (sortRaw as FeedSearchState["sort"]) : "latest";
  const statusRaw = searchParams.get("status") ?? "all";
  const status =
    statusRaw === "pending" || statusRaw === "verified" ? statusRaw : "all";

  return {
    sort,
    category: searchParams.get("category")?.trim() ?? "",
    status,
    q: searchParams.get("q") ?? "",
    district: searchParams.get("district")?.trim() ?? "",
    region: searchParams.get("region")?.trim() ?? "",
  };
}

function ChromeInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const [openPanel, setOpenPanel] = useState<{
    kind: null | "location" | "filters" | "notifications";
    routeKey: string;
  }>({
    kind: null,
    routeKey,
  });
  const district = searchParams.get("district")?.trim() ?? "";
  const region = searchParams.get("region")?.trim() ?? "";
  const locationLabel = locationLabelForFeed({ district, region });
  const authRoute = isAuthRoute(pathname);
  const feedRoute = pathname === "/";
  const feedState = parseFeedState(searchParams);
  const panelKind = openPanel.routeKey === routeKey ? openPanel.kind : null;

  const stack = pathname === "/" ? null : stackBarFor(pathname);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <FeedAutoLocation />
      {stack ? (
        <AppTopBar {...stack} />
      ) : (
        <AppTopBar
          variant="feed"
          locationLabel={locationLabel}
          onLocationClick={() => setOpenPanel({ kind: "location", routeKey })}
          onFiltersClick={() => setOpenPanel({ kind: "filters", routeKey })}
          onNotificationsClick={() =>
            setOpenPanel({ kind: "notifications", routeKey })
          }
          notifyCount={0}
        />
      )}
      {!authRoute ? (
        <LocationSheet
          open={panelKind === "location"}
          onClose={() => setOpenPanel({ kind: null, routeKey })}
        />
      ) : null}
      {feedRoute ? (
        <FeedFiltersSheet
          open={panelKind === "filters"}
          onClose={() => setOpenPanel({ kind: null, routeKey })}
          state={feedState}
        />
      ) : null}
      {feedRoute ? (
        <NotificationsSheet
          open={panelKind === "notifications"}
          onClose={() => setOpenPanel({ kind: null, routeKey })}
          locationLabel={locationLabel}
        />
      ) : null}
      <div
        className={
          authRoute
            ? "mx-auto flex w-full max-w-xl flex-1 px-3 lg:px-6"
            : "mx-auto flex w-full max-w-6xl flex-1 gap-0 lg:gap-8 lg:px-6"
        }
      >
        {!authRoute ? <DesktopLeftNav /> : null}
        <div
          className={
            authRoute
              ? "min-w-0 flex-1 pb-10"
              : "min-w-0 flex-1 pb-24 lg:max-w-[600px] lg:pb-10"
          }
        >
          {children}
        </div>
        {!authRoute ? <DesktopRightAside /> : null}
      </div>
      {!authRoute ? <MobileDock /> : null}
    </div>
  );
}

function DesktopLeftNav() {
  return (
    <aside className="sticky top-20 hidden w-56 shrink-0 self-start lg:block">
      <nav className="flex flex-col gap-1 pr-2">
        <NavL href="/" label="Feed" />
        <NavL href="/trending" label="Trending" hot />
        <Link
          href="/problems/new"
          className="mt-2 rounded-xl bg-[var(--kasa-accent)] py-3 text-center text-sm font-bold text-white shadow-[var(--kasa-shadow-2)]"
        >
          Report
        </Link>
        <NavL href="/scores" label="Scores" />
        <NavL href="/me" label="Me" />
      </nav>
    </aside>
  );
}

function NavL({
  href,
  label,
  hot,
}: {
  href: string;
  label: string;
  hot?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--kasa-text-primary)] hover:bg-[var(--kasa-muted-bg)]"
    >
      {hot ? (
        <TrendingUp size={14} strokeWidth={2} className="text-[var(--kasa-accent-soft)]" />
      ) : null}
      {label}
    </Link>
  );
}

function DesktopRightAside() {
  return (
    <aside className="sticky top-20 hidden w-72 shrink-0 self-start xl:block">
      <div className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4 shadow-[var(--kasa-shadow-1)]">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--kasa-accent-soft)]">
          Trending
        </p>
        <p className="mt-2 text-sm text-[var(--kasa-text-secondary)]">
          Rising categories and the loudest reports.
        </p>
        <Link
          href="/trending"
          className="mt-3 inline-block text-sm font-bold text-[var(--kasa-accent)] hover:underline"
        >
          See trending →
        </Link>
      </div>
      <div className="mt-4 rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-card)] p-4">
        <p className="text-xs font-bold uppercase text-[var(--kasa-text-secondary)]">
          Officials
        </p>
        <Link
          href="/scores"
          className="mt-2 inline-block text-sm font-semibold text-[var(--kasa-accent)] hover:underline"
        >
          Accountability scores →
        </Link>
      </div>
    </aside>
  );
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--kasa-bg)]" />}>
      <ChromeInner>{children}</ChromeInner>
    </Suspense>
  );
}
