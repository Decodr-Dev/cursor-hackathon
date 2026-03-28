"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FEED_AUTO_LOCATION_ATTEMPT_KEY,
  FEED_LOCATION_STORAGE_KEY,
  type SavedFeedLocation,
  findNearestFeedArea,
} from "@/lib/location";

export function FeedAutoLocation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const district = searchParams.get("district")?.trim() ?? "";
  const region = searchParams.get("region")?.trim() ?? "";

  useEffect(() => {
    if (pathname !== "/") return;

    if (district && region) {
      saveLocation({ mode: "district", district, region });
      return;
    }

    if (!district && !region) {
      const saved = readSavedLocation();
      if (saved?.mode === "district") {
        replaceLocation(router, searchParams, saved.district, saved.region);
        return;
      }
      if (saved?.mode === "ghana") {
        return;
      }
    }

    if (district || region) return;
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;
    if (window.sessionStorage.getItem(FEED_AUTO_LOCATION_ATTEMPT_KEY)) return;

    window.sessionStorage.setItem(FEED_AUTO_LOCATION_ATTEMPT_KEY, "1");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const match = findNearestFeedArea(coords.latitude, coords.longitude);
        if (!match) return;
        saveLocation({
          mode: "district",
          district: match.district,
          region: match.region,
        });
        replaceLocation(router, searchParams, match.district, match.region);
      },
      () => {
        /* User can still choose location manually from the sheet. */
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 300000,
      },
    );
  }, [district, pathname, region, router, searchParams]);

  return null;
}

function replaceLocation(
  router: ReturnType<typeof useRouter>,
  searchParams: ReadonlyURLSearchParams,
  district: string,
  region: string,
) {
  const next = new URLSearchParams(searchParams.toString());
  next.set("district", district);
  next.set("region", region);
  const query = next.toString();
  router.replace(query ? `/?${query}` : "/");
}

function saveLocation(value: SavedFeedLocation) {
  window.localStorage.setItem(FEED_LOCATION_STORAGE_KEY, JSON.stringify(value));
}

function readSavedLocation(): SavedFeedLocation | null {
  const raw = window.localStorage.getItem(FEED_LOCATION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedFeedLocation;
    if (parsed.mode === "ghana") return parsed;
    if (parsed.mode === "district" && parsed.district && parsed.region) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}
