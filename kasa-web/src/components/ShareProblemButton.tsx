"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

export function ShareProblemButton({
  path,
  title,
}: {
  path: string;
  title: string;
}) {
  const [label, setLabel] = useState("Share");

  async function onShare() {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      /* user cancelled */
    }
    try {
      await navigator.clipboard.writeText(url);
      setLabel("Copied");
      setTimeout(() => setLabel("Share"), 2000);
    } catch {
      setLabel("Copy failed");
      setTimeout(() => setLabel("Share"), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onShare()}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--kasa-text-secondary)] hover:bg-[var(--kasa-muted-bg)]"
    >
      <Link2 size={13} strokeWidth={2} />
      {label}
    </button>
  );
}
