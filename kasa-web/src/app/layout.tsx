import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kasa — Speak",
  description:
    "Ghana’s civic feed: report problems, add your voice, and track accountability (hackathon demo).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--kasa-bg)] text-[var(--kasa-text-primary)]">
        <AppChrome>{children}</AppChrome>
        <footer className="hidden border-t border-[var(--kasa-divider)] py-6 text-center text-xs text-[var(--kasa-text-muted)] lg:block">
          Hackathon build — not a government service. Identity, SMS, and maps
          ship on the product roadmap.
        </footer>
      </body>
    </html>
  );
}
