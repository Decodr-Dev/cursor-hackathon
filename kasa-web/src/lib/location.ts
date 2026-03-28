export type FeedArea = {
  district: string;
  region: string;
  latitude: number;
  longitude: number;
};

export const FEED_LOCATION_STORAGE_KEY = "kasa.feed.location.v1";
export const FEED_AUTO_LOCATION_ATTEMPT_KEY = "kasa.feed.location.auto-attempted";

export const FEED_AREAS: FeedArea[] = [
  {
    district: "La Nkwantanang-Madina",
    region: "Greater Accra",
    latitude: 5.7072,
    longitude: -0.1645,
  },
  {
    district: "Kumasi Metropolitan",
    region: "Ashanti",
    latitude: 6.6885,
    longitude: -1.6244,
  },
  {
    district: "Tamale North",
    region: "Northern",
    latitude: 9.4034,
    longitude: -0.8422,
  },
  {
    district: "Cape Coast Metro",
    region: "Central",
    latitude: 5.1053,
    longitude: -1.2466,
  },
  {
    district: "Sekondi-Takoradi",
    region: "Western",
    latitude: 4.9031,
    longitude: -1.7554,
  },
  {
    district: "Sunyani West",
    region: "Bono",
    latitude: 7.3349,
    longitude: -2.3211,
  },
  {
    district: "Ho Municipal",
    region: "Volta",
    latitude: 6.6128,
    longitude: 0.4703,
  },
  {
    district: "Wa Municipal",
    region: "Upper West",
    latitude: 10.0601,
    longitude: -2.5099,
  },
  {
    district: "Koforidua",
    region: "Eastern",
    latitude: 6.0941,
    longitude: -0.2591,
  },
  {
    district: "Techiman North",
    region: "Bono East",
    latitude: 7.5906,
    longitude: -1.9385,
  },
  {
    district: "Berekum East",
    region: "Bono East",
    latitude: 7.4534,
    longitude: -2.5841,
  },
];

export type SavedFeedLocation =
  | { mode: "ghana" }
  | { mode: "district"; district: string; region: string };

export function locationLabelForFeed(input: {
  district?: string;
  region?: string;
}): string {
  if (input.district?.trim()) return input.district.trim();
  if (input.region?.trim()) return input.region.trim();
  return "All Ghana";
}

export function groupFeedAreasByRegion() {
  const map = new Map<string, FeedArea[]>();
  for (const area of FEED_AREAS) {
    const rows = map.get(area.region) ?? [];
    rows.push(area);
    map.set(area.region, rows);
  }
  return [...map.entries()].map(([region, areas]) => ({
    region,
    areas: [...areas].sort((a, b) => a.district.localeCompare(b.district)),
  }));
}

export function findNearestFeedArea(
  latitude: number,
  longitude: number,
): FeedArea | null {
  let best: FeedArea | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const area of FEED_AREAS) {
    const distance = haversineKm(
      latitude,
      longitude,
      area.latitude,
      area.longitude,
    );
    if (distance < bestDistance) {
      best = area;
      bestDistance = distance;
    }
  }
  return best;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
