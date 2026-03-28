"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Plus, BarChart2, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: { href: string; label: string; icon: LucideIcon; accent: boolean }[] = [
  { href: "/", label: "Feed", icon: Home, accent: false },
  { href: "/trending", label: "Trending", icon: TrendingUp, accent: false },
  { href: "/problems/new", label: "Report", icon: Plus, accent: true },
  { href: "/scores", label: "Scores", icon: BarChart2, accent: false },
  { href: "/me", label: "Me", icon: User, accent: false },
];

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
                    ? "-mt-6 rounded-full bg-[var(--kasa-accent)] px-0 py-0 text-white shadow-[var(--kasa-shadow-2)] ring-4 ring-[var(--kasa-bg)]"
                    : active
                      ? "text-[var(--kasa-accent)]"
                      : "text-[var(--kasa-text-muted)] hover:text-[var(--kasa-text-primary)]"
                }`}
              >
                <span
                  className={`flex items-center justify-center ${
                    accent ? "h-14 w-14" : "h-8 w-8"
                  }`}
                >
                  <Icon
                    size={accent ? 26 : 22}
                    strokeWidth={active || accent ? 2.2 : 1.7}
                  />
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
