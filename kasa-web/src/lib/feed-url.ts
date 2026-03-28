import type { FeedSort } from "@/server/problem-service";

export type FeedSearchState = {
  sort: FeedSort;
  category: string;
  status: "all" | "pending" | "verified";
  q: string;
  /** Empty string = auto/none selected */
  district: string;
  /** Empty string = all Ghana */
  region: string;
};

export function toFeedSearchParams(s: FeedSearchState): URLSearchParams {
  const p = new URLSearchParams();
  if (s.sort !== "latest") p.set("sort", s.sort);
  if (s.category) p.set("category", s.category);
  if (s.status !== "all") p.set("status", s.status);
  if (s.q.trim()) p.set("q", s.q.trim());
  if (s.district.trim()) p.set("district", s.district.trim());
  if (s.region.trim()) p.set("region", s.region.trim());
  return p;
}

export function feedPathHref(s: FeedSearchState): string {
  const q = toFeedSearchParams(s).toString();
  return q ? `/?${q}` : "/";
}
