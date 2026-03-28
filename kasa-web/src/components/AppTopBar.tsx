"use client";

import Link from "next/link";
import { ShareProblemButton } from "@/components/ShareProblemButton";

type FeedProps = {
  variant: "feed";
  locationLabel: string;
  onLocationClick: () => void;
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
          <div className="min-w-0 flex-1 flex justify-center">
            <button
              type="button"
              onClick={props.onLocationClick}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm hover:bg-white/15"
            >
              <span className="truncate">📍 {props.locationLabel}</span>
              <span className="text-[10px] opacity-80" aria-hidden>
                ▾
              </span>
            </button>
          </div>
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10">
            <BellIcon />
            {(props.notifyCount ?? 0) > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--kasa-forest)] px-1 text-[10px] font-bold text-[var(--kasa-gold-on)]">
                {props.notifyCount! > 9 ? "9+" : props.notifyCount}
              </span>
            ) : null}
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
          <BackIcon />
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
            <span className="opacity-40">
              <BellIcon />
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5l-2 2v1h16v-1l-2-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
