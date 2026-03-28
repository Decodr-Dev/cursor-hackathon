export type ProblemCategory = {
  slug: string;
  label: string;
  emoji: string;
  subcategories: { slug: string; label: string }[];
};

export const PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    slug: "roads_transport",
    label: "Roads",
    emoji: "🛣️",
    subcategories: [
      { slug: "pothole", label: "Pothole" },
      { slug: "broken_streetlight", label: "Broken streetlight" },
      { slug: "blocked_drain", label: "Blocked drain" },
    ],
  },
  {
    slug: "water_sanitation",
    label: "Water",
    emoji: "💧",
    subcategories: [
      { slug: "no_water", label: "No piped water" },
      { slug: "unsafe_water", label: "Unsafe water" },
      { slug: "open_gutter", label: "Open gutter / flooding" },
    ],
  },
  {
    slug: "health",
    label: "Health",
    emoji: "🏥",
    subcategories: [
      { slug: "clinic_access", label: "Clinic access" },
      { slug: "waste_disposal", label: "Medical waste / hygiene" },
    ],
  },
  {
    slug: "utilities",
    label: "Power",
    emoji: "⚡",
    subcategories: [
      { slug: "power_outage", label: "Power outage pattern" },
      { slug: "internet", label: "Poor connectivity" },
    ],
  },
  {
    slug: "governance",
    label: "Safety",
    emoji: "🛡️",
    subcategories: [
      { slug: "procurement", label: "Procurement concern" },
      { slug: "public_safety", label: "Public safety" },
    ],
  },
  {
    slug: "other",
    label: "Other",
    emoji: "📌",
    subcategories: [{ slug: "general", label: "General" }],
  },
];

export function categoryLabel(slug: string): string {
  const c = PROBLEM_CATEGORIES.find((x) => x.slug === slug);
  return c?.label ?? slug;
}

export function categoryEmoji(slug: string): string {
  const c = PROBLEM_CATEGORIES.find((x) => x.slug === slug);
  return c?.emoji ?? "📋";
}

export function subcategoryLabel(
  categorySlug: string,
  subSlug: string | null | undefined,
): string {
  if (!subSlug) return "";
  const c = PROBLEM_CATEGORIES.find((x) => x.slug === categorySlug);
  const s = c?.subcategories.find((x) => x.slug === subSlug);
  return s?.label ?? subSlug;
}
