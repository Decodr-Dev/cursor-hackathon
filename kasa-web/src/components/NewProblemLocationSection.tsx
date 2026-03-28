"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GHANA_REGIONS,
  getConstituenciesForRegion,
  getDistrictsForRegion,
} from "@/lib/ghana-admin";
import {
  FEED_LOCATION_STORAGE_KEY,
  findNearestFeedArea,
  type SavedFeedLocation,
} from "@/lib/location";

type Props = {
  region: string;
  district: string;
  constituency: string;
  latitude: string;
  longitude: string;
  disabled?: boolean;
  onRegionChange: (region: string) => void;
  onDistrictChange: (district: string) => void;
  onConstituencyChange: (constituency: string) => void;
  onCoordinatesChange: (latitude: string, longitude: string) => void;
};

export function NewProblemLocationSection({
  region,
  district,
  constituency,
  latitude,
  longitude,
  disabled,
  onRegionChange,
  onDistrictChange,
  onConstituencyChange,
  onCoordinatesChange,
}: Props) {
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const savedLocation = readSavedLocation();
  const districts = useMemo(() => getDistrictsForRegion(region), [region]);
  const constituencies = useMemo(
    () => getConstituenciesForRegion(region),
    [region],
  );

  useEffect(() => {
    if (savedLocation?.mode === "district") {
      onRegionChange(savedLocation.region);
      onDistrictChange(savedLocation.district);
    }
  }, [onDistrictChange, onRegionChange, savedLocation]);

  useEffect(() => {
    if (district && districts.includes(district)) return;
    if (districts.length > 0) {
      onDistrictChange(districts[0]);
    }
  }, [district, districts, onDistrictChange]);

  useEffect(() => {
    if (!constituency || constituencies.includes(constituency)) return;
    onConstituencyChange("");
  }, [constituencies, constituency, onConstituencyChange]);

  const detectLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setMessage("Location access is not available here, so pick your district.");
      return;
    }

    setLocating(true);
    setMessage(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onCoordinatesChange(
          String(coords.latitude),
          String(coords.longitude),
        );

        const nearest = findNearestFeedArea(coords.latitude, coords.longitude);
        if (nearest) {
          onRegionChange(nearest.region);
          onDistrictChange(nearest.district);
          setMessage(`Using ${nearest.district}, ${nearest.region}.`);
        } else {
          setMessage(
            "Device location was captured. Choose the nearest district if the match looks off.",
          );
        }

        setLocating(false);
      },
      () => {
        setLocating(false);
        setMessage("We could not read your location. Pick your district below.");
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 300000,
      },
    );
  }, [onCoordinatesChange, onDistrictChange, onRegionChange]);

  useEffect(() => {
    if (latitude && longitude) return;
    const timer = window.setTimeout(() => {
      detectLocation();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [detectLocation, latitude, longitude]);

  const statusMessage =
    message ??
    (savedLocation?.mode === "district"
      ? `Starting from your saved feed area: ${savedLocation.district}.`
      : null);

  return (
    <section className="rounded-2xl border border-[var(--kasa-divider)] bg-[var(--kasa-muted-bg)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--kasa-text-primary)]">
            Community and location
          </p>
          <p className="mt-1 text-xs text-[var(--kasa-text-secondary)]">
            The app now captures the map point automatically, so people do not
            have to type latitude or longitude.
          </p>
        </div>

        <button
          type="button"
          onClick={detectLocation}
          disabled={disabled || locating}
          className="rounded-full border border-[var(--kasa-forest)]/30 px-4 py-2 text-sm font-semibold text-[var(--kasa-forest)] hover:bg-white disabled:opacity-60"
        >
          {locating ? "Checking location..." : "Use my current location"}
        </button>
      </div>

      {statusMessage ? (
        <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs text-[var(--kasa-text-secondary)]">
          {statusMessage}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[var(--kasa-ink)]">
          Region
          <select
            name="region"
            required
            disabled={disabled}
            value={region}
            onChange={(event) => onRegionChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none focus:ring-2 focus:ring-[var(--kasa-forest)]"
          >
            {GHANA_REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-[var(--kasa-ink)]">
          District / area
          <select
            name="district"
            required
            disabled={disabled}
            value={district}
            onChange={(event) => onDistrictChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none focus:ring-2 focus:ring-[var(--kasa-forest)]"
          >
            {districts.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-[var(--kasa-ink)]">
        Constituency (optional demo helper)
        <select
          name="constituency"
          disabled={disabled}
          value={constituency}
          onChange={(event) => onConstituencyChange(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--kasa-border)] bg-[var(--kasa-surface)] px-3 py-2.5 text-[var(--kasa-ink)] outline-none focus:ring-2 focus:ring-[var(--kasa-forest)]"
        >
          <option value="">Select constituency</option>
          {constituencies.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <input type="hidden" name="latitude" value={latitude} />
      <input type="hidden" name="longitude" value={longitude} />

      <p className="mt-3 text-xs text-[var(--kasa-text-muted)]">
        Captured point:{" "}
        {latitude && longitude ? `${latitude}, ${longitude}` : "Waiting for device location"}
      </p>
    </section>
  );
}

function readSavedLocation(): SavedFeedLocation | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(FEED_LOCATION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedFeedLocation;
  } catch {
    return null;
  }
}
