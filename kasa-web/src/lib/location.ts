import { getAllDistrictOptions } from "@/lib/ghana-admin";

export type FeedArea = {
  district: string;
  region: string;
};

type GeoFeedArea = FeedArea & {
  latitude: number;
  longitude: number;
};

export const FEED_LOCATION_STORAGE_KEY = "kasa.feed.location.v1";
export const FEED_AUTO_LOCATION_ATTEMPT_KEY = "kasa.feed.location.auto-attempted";

const GEO_FEED_AREAS: GeoFeedArea[] = [
  {
    district: "La Nkwantanang-Madina",
    region: "Greater Accra",
    latitude: 5.7072,
    longitude: -0.1645,
  },
  {
    district: "Kumasi",
    region: "Ashanti",
    latitude: 6.6885,
    longitude: -1.6244,
  },
  {
    district: "Tamale Metropolitan",
    region: "Northern",
    latitude: 9.4034,
    longitude: -0.8422,
  },
  {
    district: "Cape Coast",
    region: "Central",
    latitude: 5.1053,
    longitude: -1.2466,
  },
  {
    district: "Sekondi Takoradi Metropolitan",
    region: "Western",
    latitude: 4.9031,
    longitude: -1.7554,
  },
  {
    district: "Sunyani",
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
    district: "New Juaben South",
    region: "Eastern",
    latitude: 6.0941,
    longitude: -0.2591,
  },
  {
    district: "Techiman",
    region: "Bono East",
    latitude: 7.5906,
    longitude: -1.9385,
  },
  {
    district: "Asunafo North",
    region: "Ahafo",
    latitude: 6.8041,
    longitude: -2.5174,
  },
  {
    district: "East Mamprusi",
    region: "North East",
    latitude: 10.527,
    longitude: -0.3697,
  },
  {
    district: "Krachi East",
    region: "Oti",
    latitude: 8.0653,
    longitude: -0.0686,
  },
  {
    district: "West Gonja",
    region: "Savannah",
    latitude: 9.0827,
    longitude: -1.8184,
  },
  {
    district: "Bolgatanga Municipal",
    region: "Upper East",
    latitude: 10.7856,
    longitude: -0.8514,
  },
  {
    district: "Sefwi-Wiawso",
    region: "Western North",
    latitude: 6.2053,
    longitude: -2.4892,
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
  for (const option of getAllDistrictOptions()) {
    const rows = map.get(option.region) ?? [];
    rows.push(option);
    map.set(option.region, rows);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([region, areas]) => ({
    region,
    areas: [...areas].sort((a, b) => a.district.localeCompare(b.district)),
    }));
}

export function findNearestFeedArea(
  latitude: number,
  longitude: number,
): FeedArea | null {
  let best: GeoFeedArea | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const area of GEO_FEED_AREAS) {
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
  return best ? { district: best.district, region: best.region } : null;
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
