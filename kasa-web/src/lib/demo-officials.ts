import { GHANA_ADMIN_DATA } from "@/lib/ghana-admin";

export type DemoOfficialType =
  | "mp"
  | "district_assembly"
  | "agency"
  | "utility";

export type DemoOfficialSeed = {
  id: string;
  slug: string;
  name: string;
  title: string;
  entity: string;
  type: DemoOfficialType;
  region: string;
  district: string;
  constituency?: string;
  focusCategory?: string;
  scoreSeed: {
    baseVolume: number;
    acknowledgementRatePct: number;
    resolutionRatePct: number;
    avgResolutionDays: number;
    responseQualityRating: number;
    momentum: number;
  };
};

const FIRST_NAMES = [
  "Ama",
  "Kwame",
  "Abena",
  "Kojo",
  "Efua",
  "Yaw",
  "Akosua",
  "Kofi",
  "Adwoa",
  "Nana",
  "Yaa",
  "Kwaku",
  "Mariam",
  "Kweku",
  "Afi",
  "Kwabena",
  "Esi",
  "Fiifi",
  "Zeinab",
  "Nii",
  "Akua",
  "Kojo",
  "Maame",
  "Farida",
];

const LAST_NAMES = [
  "Mensah",
  "Owusu",
  "Ofori",
  "Boateng",
  "Boadu",
  "Nyarko",
  "Asare",
  "Amponsah",
  "Quaye",
  "Sarpong",
  "Ansah",
  "Tetteh",
  "Abubakar",
  "Agyeman",
  "Dzamefe",
  "Nkrumah",
  "Aidoo",
  "Addo",
  "Yakubu",
  "Lamptey",
  "Darko",
  "Tawiah",
  "Acheampong",
  "Karikari",
];

const PERFORMANCE_PROFILES = [
  {
    baseVolume: 34,
    acknowledgementRatePct: 86,
    resolutionRatePct: 69,
    avgResolutionDays: 18,
    responseQualityRating: 4.7,
    momentum: 6,
  },
  {
    baseVolume: 31,
    acknowledgementRatePct: 76,
    resolutionRatePct: 54,
    avgResolutionDays: 27,
    responseQualityRating: 4.2,
    momentum: 3,
  },
  {
    baseVolume: 28,
    acknowledgementRatePct: 67,
    resolutionRatePct: 43,
    avgResolutionDays: 36,
    responseQualityRating: 3.8,
    momentum: 1,
  },
  {
    baseVolume: 24,
    acknowledgementRatePct: 58,
    resolutionRatePct: 32,
    avgResolutionDays: 48,
    responseQualityRating: 3.3,
    momentum: -1,
  },
  {
    baseVolume: 22,
    acknowledgementRatePct: 49,
    resolutionRatePct: 23,
    avgResolutionDays: 64,
    responseQualityRating: 2.9,
    momentum: -3,
  },
  {
    baseVolume: 18,
    acknowledgementRatePct: 39,
    resolutionRatePct: 15,
    avgResolutionDays: 79,
    responseQualityRating: 2.4,
    momentum: -5,
  },
] as const;

const PRIMARY_DISTRICT_BY_REGION: Record<string, string> = {
  Ahafo: "Asunafo North",
  Ashanti: "Kumasi",
  Bono: "Sunyani",
  "Bono East": "Techiman",
  Central: "Cape Coast",
  Eastern: "New Juaben South",
  "Greater Accra": "La Nkwantanang-Madina",
  Northern: "Tamale Metropolitan",
  "North East": "West Mamprusi",
  Oti: "Krachi East",
  Savannah: "West Gonja",
  "Upper East": "Bolgatanga Municipal",
  "Upper West": "Wa Municipal",
  Volta: "Ho Municipal",
  Western: "Sekondi Takoradi Metropolitan",
  "Western North": "Sefwi-Wiawso",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pickProfile(index: number) {
  return PERFORMANCE_PROFILES[index % PERFORMANCE_PROFILES.length]!;
}

function buildPersonName(index: number) {
  const first = FIRST_NAMES[index % FIRST_NAMES.length]!;
  const last = LAST_NAMES[index % LAST_NAMES.length]!;
  return `${first} ${last}`;
}

function buildRegionOfficials() {
  return GHANA_ADMIN_DATA.flatMap((entry, index) => {
    const district =
      PRIMARY_DISTRICT_BY_REGION[entry.region] ?? entry.districts[0] ?? entry.region;
    const constituency = entry.constituencies[0] ?? undefined;
    const assemblyName = buildPersonName(index);
    const mpName = buildPersonName(index + GHANA_ADMIN_DATA.length);
    const assemblyProfile = pickProfile(index);
    const mpProfile = pickProfile(index + 2);
    const regionSlug = slugify(entry.region);

    const officials: DemoOfficialSeed[] = [
      {
        id: `official-assembly-${regionSlug}`,
        slug: `${regionSlug}-assembly`,
        name: assemblyName,
        title: "District Chief Executive",
        entity: `${district} Assembly`,
        type: "district_assembly",
        region: entry.region,
        district,
        constituency,
        scoreSeed: {
          ...assemblyProfile,
          baseVolume: assemblyProfile.baseVolume + 3,
        },
      },
      {
        id: `official-mp-${regionSlug}`,
        slug: `${regionSlug}-mp`,
        name: mpName,
        title: "Member of Parliament",
        entity: constituency
          ? `${constituency} Constituency`
          : `${district} Constituency`,
        type: "mp",
        region: entry.region,
        district,
        constituency,
        scoreSeed: {
          ...mpProfile,
          baseVolume: mpProfile.baseVolume + 1,
        },
      },
    ];

    return officials;
  });
}

const SPECIALIST_OFFICIALS: DemoOfficialSeed[] = [
  {
    id: "official-utility-accra-water",
    slug: "accra-water-operations",
    name: "Aisha Tetteh",
    title: "Regional Operations Lead",
    entity: "Ghana Water Limited - Greater Accra",
    type: "utility",
    region: "Greater Accra",
    district: "La Nkwantanang-Madina",
    focusCategory: "water_sanitation",
    scoreSeed: {
      baseVolume: 30,
      acknowledgementRatePct: 73,
      resolutionRatePct: 47,
      avgResolutionDays: 29,
      responseQualityRating: 4.1,
      momentum: 2,
    },
  },
  {
    id: "official-utility-tamale-power",
    slug: "tamale-power-operations",
    name: "Kojo Abubakar",
    title: "Area Engineer",
    entity: "Electricity Company of Ghana - Northern Zone",
    type: "utility",
    region: "Northern",
    district: "Tamale Metropolitan",
    focusCategory: "utilities",
    scoreSeed: {
      baseVolume: 27,
      acknowledgementRatePct: 61,
      resolutionRatePct: 35,
      avgResolutionDays: 41,
      responseQualityRating: 3.6,
      momentum: -1,
    },
  },
  {
    id: "official-agency-cape-health",
    slug: "cape-coast-health-directorate",
    name: "Dr Efua Nkrumah",
    title: "Municipal Health Director",
    entity: "Ghana Health Service - Central",
    type: "agency",
    region: "Central",
    district: "Cape Coast",
    focusCategory: "health",
    scoreSeed: {
      baseVolume: 21,
      acknowledgementRatePct: 79,
      resolutionRatePct: 58,
      avgResolutionDays: 22,
      responseQualityRating: 4.5,
      momentum: 4,
    },
  },
  {
    id: "official-agency-accra-roads",
    slug: "accra-urban-roads",
    name: "Samuel Quansah",
    title: "Regional Director",
    entity: "Department of Urban Roads - Greater Accra",
    type: "agency",
    region: "Greater Accra",
    district: "Accra",
    focusCategory: "roads_transport",
    scoreSeed: {
      baseVolume: 37,
      acknowledgementRatePct: 66,
      resolutionRatePct: 39,
      avgResolutionDays: 34,
      responseQualityRating: 3.7,
      momentum: 1,
    },
  },
  {
    id: "official-agency-kumasi-sanitation",
    slug: "kumasi-sanitation-response",
    name: "Mariam Aidoo",
    title: "Metro Sanitation Coordinator",
    entity: "Environmental Health Unit - Ashanti",
    type: "agency",
    region: "Ashanti",
    district: "Kumasi",
    focusCategory: "water_sanitation",
    scoreSeed: {
      baseVolume: 29,
      acknowledgementRatePct: 55,
      resolutionRatePct: 28,
      avgResolutionDays: 52,
      responseQualityRating: 3.1,
      momentum: -2,
    },
  },
  {
    id: "official-utility-sekondi-ports",
    slug: "sekondi-utility-response",
    name: "Nii Lamptey",
    title: "Regional Infrastructure Lead",
    entity: "Coastal Utilities Coordination Desk",
    type: "utility",
    region: "Western",
    district: "Sekondi Takoradi Metropolitan",
    focusCategory: "utilities",
    scoreSeed: {
      baseVolume: 19,
      acknowledgementRatePct: 69,
      resolutionRatePct: 44,
      avgResolutionDays: 31,
      responseQualityRating: 4.0,
      momentum: 2,
    },
  },
];

export const DEMO_OFFICIALS: DemoOfficialSeed[] = [
  ...buildRegionOfficials(),
  ...SPECIALIST_OFFICIALS,
];

export function parseOfficialType(raw: string | undefined) {
  if (
    raw === "mp" ||
    raw === "district_assembly" ||
    raw === "agency" ||
    raw === "utility"
  ) {
    return raw;
  }
  return "all";
}

export function officialTypeLabel(type: DemoOfficialType | "all") {
  if (type === "mp") return "MPs";
  if (type === "district_assembly") return "District Assemblies";
  if (type === "agency") return "Agencies";
  if (type === "utility") return "Utilities";
  return "All";
}
