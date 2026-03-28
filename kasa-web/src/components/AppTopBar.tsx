"use client";

import Link from "next/link";
import { Bell, SlidersHorizontal, ChevronLeft, MapPin, ChevronDown } from "lucide-react";
import { ShareProblemButton } from "@/components/ShareProblemButton";

type FeedProps = {
  variant: "feed";
  locationLabel: string;
  onLocationClick: () => void;
  onFiltersClick: () => void;
  onNotificationsClick: () => void;
  notifyCount?: number;
};

export type StackProps = {
  variant: "stack";
  title: string;
  backHref: string;
  sharePath?: string;
  shareTitle?: string;
};

type Props = FeedProps | StackProps;

export function AppTopBar(props: Props) {
  if (props.variant === "feed") {
    return (
      <header className="sticky top-0 z-30 border-b border-[var(--kasa-divider)] bg-[var(--kasa-topbar)] text-[var(--kasa-text-on-dark)] backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-3 py-2.5">
          <Link
            href="/"
            className="shrink-0 text-[1.05rem] font-extrabold tracking-tight text-[var(--kasa-text-on-dark)]"
          >
            KASA
          </Link>
          <div className="flex min-w-0 flex-1 justify-center">
            <button
              type="button"
              onClick={props.onLocationClick}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm hover:bg-white/15"
            >
              <MapPin size={11} strokeWidth={2} className="shrink-0 opacity-70" />
              <span className="truncate">{props.locationLabel}</span>
              <ChevronDown size={11} strokeWidth={2} className="shrink-0 opacity-70" />
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={props.onFiltersClick}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={18} strokeWidth={1.7} />
            </button>
            <button
              type="button"
              onClick={props.onNotificationsClick}
              className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Open notifications"
            >
              <Bell size={18} strokeWidth={1.7} />
              {(props.notifyCount ?? 0) > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--kasa-accent)] px-1 text-[10px] font-bold text-white">
                  {props.notifyCount! > 9 ? "9+" : props.notifyCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--kasa-divider)] bg-[var(--kasa-topbar)] text-[var(--kasa-text-on-dark)] backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-2 px-2 py-2.5">
        <Link
          href={props.backHref}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Back"
        >
          <ChevronLeft size={22} strokeWidth={2} />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-sm font-bold">
          {props.title}
        </h1>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center text-white">
          {props.sharePath && props.shareTitle ? (
            <span className="scale-90 [&_button]:text-white/90 [&_button]:hover:bg-white/10">
              <ShareProblemButton path={props.sharePath} title={props.shareTitle} />
            </span>
          ) : (
            <span className="pointer-events-none opacity-0">
              <Bell size={18} />
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
