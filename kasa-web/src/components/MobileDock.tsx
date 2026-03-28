"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Feed", icon: HomeIcon, accent: false },
  { href: "/trending", label: "Trending", icon: FireIcon, accent: false },
  { href: "/problems/new", label: "Report", icon: PlusIcon, accent: true },
  { href: "/scores", label: "Scores", icon: ChartIcon, accent: false },
  { href: "/me", label: "Me", icon: PersonIcon, accent: false },
] as const;

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--kasa-divider)] bg-[color-mix(in_oklab,var(--kasa-card)_96%,transparent)] px-1 pb-3 pt-1 backdrop-blur-lg lg:hidden"
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-lg items-end justify-between gap-0.5">
        {items.map(({ href, label, icon: Icon, accent }) => {
          const active = accent
            ? pathname.startsWith("/problems/new")
            : href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-label={accent ? "Report a problem" : label}
                className={`flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[0.65rem] font-semibold transition ${
                  accent
                    ? "-mt-6 rounded-full bg-[var(--kasa-gold)] px-0 py-0 text-[var(--kasa-gold-on)] shadow-[var(--kasa-shadow-2)] ring-4 ring-[var(--kasa-bg)]"
                    : active
                      ? "text-[var(--kasa-gold)]"
                      : "text-[var(--kasa-text-muted)] hover:text-[var(--kasa-text-primary)]"
                }`}
              >
                <span
                  className={`flex items-center justify-center ${
                    accent ? "h-14 w-14" : "h-8 w-8"
                  }`}
                >
                  <Icon active={active || !!accent} emphasis={!!accent} />
                </span>
                {!accent ? label : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon({ active }: { active?: boolean; emphasis?: boolean }) {
  const c = active ? "var(--kasa-gold)" : "currentColor";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke={c}
        strokeWidth={active ? 2.2 : 1.7}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FireIcon({ active }: { active?: boolean; emphasis?: boolean }) {
  const c = active ? "var(--kasa-gold)" : "currentColor";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3s3 4 3 8a4 4 0 11-8 0c0-2 1-5 2-6.5C9 6 10 8 12 3z"
        stroke={c}
        strokeWidth={active ? 2.2 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ emphasis }: { active?: boolean; emphasis?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 6v12M6 12h12"
        stroke={emphasis ? "var(--kasa-gold-on)" : "currentColor"}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon({ active }: { active?: boolean; emphasis?: boolean }) {
  const c = active ? "var(--kasa-gold)" : "currentColor";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 19V5M10 19v-7M15 19V9M20 19v-4"
        stroke={c}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PersonIcon({ active }: { active?: boolean; emphasis?: boolean }) {
  const c = active ? "var(--kasa-gold)" : "currentColor";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="3.5" stroke={c} strokeWidth="1.7" />
      <path
        d="M6.5 19c.8-3 6.2-3 7 0"
        stroke={c}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
