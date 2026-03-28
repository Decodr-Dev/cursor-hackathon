import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const frauncesSetup = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kasa — Speak",
  description:
    "Ghana’s problem–solution marketplace (hackathon demo): report civic issues, upvote neighbours, and track verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${frauncesSetup.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-[var(--kasa-border)] py-6 text-center text-xs text-[var(--kasa-muted)]">
          Hackathon build — not a government service. Identity, SMS, and maps
          are not wired up yet.
        </footer>
      </body>
    </html>
  );
}
