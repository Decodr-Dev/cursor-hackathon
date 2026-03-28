"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FEED_LOCATION_STORAGE_KEY,
  groupFeedAreasByRegion,
  type SavedFeedLocation,
  findNearestFeedArea,
} from "@/lib/location";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LocationSheet({ open, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pendingLocation, setPendingLocation] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const district = searchParams.get("district")?.trim() ?? "";
  const region = searchParams.get("region")?.trim() ?? "";
  const areasByRegion = useMemo(() => groupFeedAreasByRegion(), []);
  const closeSheet = useCallback(() => {
    setPendingLocation(false);
    setMessage(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSheet, open]);

  if (!open) return null;

  function applyAllGhana() {
    saveLocation({ mode: "ghana" });
    navigateWithLocation("", "");
  }

  function applyDistrict(nextDistrict: string, nextRegion: string) {
    saveLocation({
      mode: "district",
      district: nextDistrict,
      region: nextRegion,
    });
    navigateWithLocation(nextDistrict, nextRegion);
  }

  function navigateWithLocation(nextDistrict: string, nextRegion: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextDistrict) params.set("district", nextDistrict);
    else params.delete("district");
    if (nextRegion) params.set("region", nextRegion);
    else params.delete("region");
    const query = params.toString();
    router.push(
      pathname === "/" ? (query ? `/?${query}` : "/") : query ? `/?${query}` : "/",
    );
    closeSheet();
  }

  function detectCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setMessage("Location is not available in this browser.");
      return;
    }
    setPendingLocation(true);
    setMessage(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const match = findNearestFeedArea(coords.latitude, coords.longitude);
        if (!match) {
          setPendingLocation(false);
          setMessage("We could not match you to a nearby district yet.");
          return;
        }
        applyDistrict(match.district, match.region);
      },
      () => {
        setPendingLocation(false);
        setMessage("We could not read your location. Pick your district below.");
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 300000,
      },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 p-0 sm:justify-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={closeSheet}
      />
      <div
        className="relative max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[var(--kasa-card)] p-5 shadow-[var(--kasa-shadow-3)] sm:mx-auto sm:max-w-md sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loc-sheet-title"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--kasa-divider)] sm:hidden" />
        <h2
          id="loc-sheet-title"
          className="text-center text-base font-bold text-[var(--kasa-text-primary)]"
        >
          Choose your feed
        </h2>
        <p className="mt-1 text-center text-xs text-[var(--kasa-text-secondary)]">
          Start with your district first, or widen out to all Ghana.
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={detectCurrentLocation}
            disabled={pendingLocation}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--kasa-forest)]/35 bg-[var(--kasa-gold-light)] px-4 py-3 text-left text-sm font-semibold text-[var(--kasa-text-primary)] hover:bg-[var(--kasa-muted-bg)] disabled:opacity-60"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg" aria-hidden>
                📍
              </span>
              Use my current district
            </span>
            <span className="text-xs text-[var(--kasa-leaf)]">
              {pendingLocation ? "Checking..." : "Auto"}
            </span>
          </button>

          <button
            type="button"
            onClick={applyAllGhana}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
              !district && !region
                ? "border-[var(--kasa-forest)] bg-[var(--kasa-gold-light)] text-[var(--kasa-text-primary)]"
                : "border-[var(--kasa-divider)] text-[var(--kasa-text-primary)] hover:bg-[var(--kasa-muted-bg)]"
            }`}
          >
            <span className="text-lg" aria-hidden>
              🇬🇭
            </span>
            All of Ghana
          </button>
        </div>

        {message ? (
          <p className="mt-3 rounded-xl bg-[var(--kasa-muted-bg)] px-3 py-2 text-xs text-[var(--kasa-text-secondary)]">
            {message}
          </p>
        ) : null}

        <p className="mt-5 text-xs font-bold uppercase tracking-wide text-[var(--kasa-text-muted)]">
          Pick a district
        </p>
        <div className="mt-2 space-y-4">
          {areasByRegion.map((group) => (
            <section key={group.region}>
              <p className="mb-2 text-xs font-semibold text-[var(--kasa-text-secondary)]">
                {group.region}
              </p>
              <ul className="space-y-1">
                {group.areas.map((area) => {
                  const active =
                    district === area.district && region === area.region;
                  return (
                    <li key={area.district}>
                      <button
                        type="button"
                        onClick={() => applyDistrict(area.district, area.region)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-medium ${
                          active
                            ? "bg-[var(--kasa-gold-light)] text-[var(--kasa-text-primary)] ring-1 ring-[var(--kasa-forest)]/35"
                            : "text-[var(--kasa-text-primary)] hover:bg-[var(--kasa-muted-bg)]"
                        }`}
                      >
                        <span>{area.district}</span>
                        {active ? (
                          <span className="text-xs font-bold text-[var(--kasa-leaf)]">
                            Active
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function saveLocation(value: SavedFeedLocation) {
  window.localStorage.setItem(FEED_LOCATION_STORAGE_KEY, JSON.stringify(value));
}
