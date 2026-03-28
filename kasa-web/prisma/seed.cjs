/* eslint-disable @typescript-eslint/no-require-imports */

const { mkdir, writeFile } = require("fs/promises")
const path = require("path")
const { PrismaClient, ProblemStatus } = require("@prisma/client")

const prisma = new PrismaClient()

const DEMO_PREFIX = "demo-kasa-"
const ASSET_DIR = path.join(process.cwd(), "public", "uploads", "demo-seed")
const DAY = 24 * 60 * 60 * 1000

const ASSETS = {
  roads_transport: {
    fileName: "roads-transport.svg",
    label: "ROADS",
    title: "Road damage",
    subtitle: "Potholes, drains, and streetlights",
    accent: "#B85C00",
    accentSoft: "#F9A825",
  },
  water_sanitation: {
    fileName: "water-sanitation.svg",
    label: "WATER",
    title: "Water access",
    subtitle: "Dry taps, blocked drains, flooding",
    accent: "#005B96",
    accentSoft: "#00ACC1",
  },
  health: {
    fileName: "health.svg",
    label: "HEALTH",
    title: "Clinic access",
    subtitle: "Queues, sanitation, and access",
    accent: "#1B5E20",
    accentSoft: "#66BB6A",
  },
  utilities: {
    fileName: "utilities.svg",
    label: "UTILITIES",
    title: "Power and internet",
    subtitle: "Outages and weak connectivity",
    accent: "#006064",
    accentSoft: "#26C6DA",
  },
  governance: {
    fileName: "governance.svg",
    label: "SAFETY",
    title: "Public safety",
    subtitle: "Lighting, patrols, and concerns",
    accent: "#37474F",
    accentSoft: "#FFB300",
  },
}

const PROBLEMS = [
  {
    id: `${DEMO_PREFIX}madina-pothole`,
    category: "roads_transport",
    subcategory: "pothole",
    region: "Greater Accra",
    district: "La Nkwantanang-Madina",
    description:
      "A deep pothole keeps swallowing motorcycles near the pharmacy junction. Taxis are swerving into oncoming traffic after the latest rains.",
    status: ProblemStatus.PENDING_VERIFICATION,
    latitude: 5.7072,
    longitude: -0.1645,
    createdAt: daysAgo(2),
    upvotes: 14,
    evidenceAsset: "roads_transport",
  },
  {
    id: `${DEMO_PREFIX}kumasi-water`,
    category: "water_sanitation",
    subcategory: "no_water",
    region: "Ashanti",
    district: "Kumasi Metropolitan",
    description:
      "The borehole has been dry for four days and residents are queueing at a vendor 30 minutes away. School cooks are buying sachets to keep classes running.",
    status: ProblemStatus.PENDING_VERIFICATION,
    latitude: 6.6885,
    longitude: -1.6244,
    createdAt: daysAgo(4),
    upvotes: 22,
    evidenceAsset: "water_sanitation",
  },
  {
    id: `${DEMO_PREFIX}tamale-power`,
    category: "utilities",
    subcategory: "power_outage",
    region: "Northern",
    district: "Tamale North",
    description:
      "Power cuts are happening every evening between 6pm and 10pm, shutting down cold stores and charging stations along the main road.",
    status: ProblemStatus.PENDING_VERIFICATION,
    latitude: 9.4034,
    longitude: -0.8422,
    createdAt: daysAgo(1),
    upvotes: 8,
    evidenceAsset: "utilities",
  },
  {
    id: `${DEMO_PREFIX}cape-coast-clinic`,
    category: "health",
    subcategory: "clinic_access",
    region: "Central",
    district: "Cape Coast Metro",
    description:
      "The clinic gate is locked after hours and pregnant patients are redirected to a private pharmacy for basic care. The queue spills onto the road.",
    status: ProblemStatus.COMMUNITY_VERIFIED,
    createdAt: daysAgo(12),
    upvotes: 17,
    evidenceAsset: "health",
  },
  {
    id: `${DEMO_PREFIX}sekondi-drain`,
    category: "water_sanitation",
    subcategory: "open_gutter",
    region: "Western",
    district: "Sekondi-Takoradi",
    description:
      "A blocked drain is overflowing onto the footpath. After light rain the road becomes impassable and nearby kiosks are taking in water.",
    status: ProblemStatus.PENDING_VERIFICATION,
    createdAt: daysAgo(6),
    upvotes: 11,
    evidenceAsset: "water_sanitation",
  },
  {
    id: `${DEMO_PREFIX}sunyani-light`,
    category: "roads_transport",
    subcategory: "broken_streetlight",
    region: "Bono",
    district: "Sunyani West",
    description:
      "The streetlight by the lorry station has been out for weeks and drivers are using the shoulder as a parking lane at night.",
    status: ProblemStatus.PENDING_VERIFICATION,
    createdAt: daysAgo(8),
    upvotes: 5,
    evidenceAsset: "roads_transport",
  },
  {
    id: `${DEMO_PREFIX}ho-market-runoff`,
    category: "water_sanitation",
    subcategory: "open_gutter",
    region: "Volta",
    district: "Ho Municipal",
    description:
      "Waste water is pooling behind the market stalls and children are stepping around it on the way to school.",
    status: ProblemStatus.PENDING_VERIFICATION,
    createdAt: daysAgo(9),
    upvotes: 9,
    evidenceAsset: "water_sanitation",
  },
  {
    id: `${DEMO_PREFIX}wa-lighting`,
    category: "roads_transport",
    subcategory: "broken_streetlight",
    region: "Upper West",
    district: "Wa Municipal",
    description:
      "The streetlight outside the bus station is dead, making the whole stretch feel unsafe after sunset.",
    status: ProblemStatus.COMMUNITY_VERIFIED,
    createdAt: daysAgo(18),
    upvotes: 4,
    evidenceAsset: "roads_transport",
  },
  {
    id: `${DEMO_PREFIX}koforidua-internet`,
    category: "utilities",
    subcategory: "internet",
    region: "Eastern",
    district: "Koforidua",
    description:
      "Mobile internet drops repeatedly during office hours, and the only available hotspot is overloaded in the evening.",
    status: ProblemStatus.PENDING_VERIFICATION,
    createdAt: daysAgo(3),
    upvotes: 3,
    evidenceAsset: "utilities",
  },
  {
    id: `${DEMO_PREFIX}techiman-safety`,
    category: "governance",
    subcategory: "public_safety",
    region: "Bono East",
    district: "Techiman North",
    description:
      "Traders are asking for patrols after repeated thefts near the lorry park. The market committee keeps filing reports with no reply.",
    status: ProblemStatus.COMMUNITY_VERIFIED,
    createdAt: daysAgo(15),
    upvotes: 7,
    evidenceAsset: "governance",
  },
  {
    id: `${DEMO_PREFIX}berekum-general`,
    category: "other",
    subcategory: "general",
    region: "Bono East",
    district: "Berekum East",
    description:
      "Residents want a clear channel for reporting small municipal issues like broken bins, overgrown shoulders, and missed collections.",
    status: ProblemStatus.PENDING_VERIFICATION,
    createdAt: daysAgo(5),
    upvotes: 2,
    evidenceAsset: null,
  },
]

function daysAgo(days) {
  return new Date(Date.now() - days * DAY)
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function demoSvg({ label, title, subtitle, accent, accentSoft }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title>${escapeXml(title)}</title>
  <desc>${escapeXml(subtitle)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accentSoft}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" rx="48" fill="url(#bg)"/>
  <circle cx="1030" cy="120" r="190" fill="#ffffff" opacity="0.11"/>
  <circle cx="180" cy="582" r="250" fill="#000000" opacity="0.09"/>
  <rect x="76" y="72" width="180" height="52" rx="26" fill="#ffffff" opacity="0.18"/>
  <text x="106" y="108" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="2">${escapeXml(label)}</text>
  <text x="76" y="238" fill="#ffffff" font-family="Arial, sans-serif" font-size="64" font-weight="800">${escapeXml(title)}</text>
  <text x="76" y="300" fill="#ffffff" opacity="0.92" font-family="Arial, sans-serif" font-size="28" font-weight="500">${escapeXml(subtitle)}</text>
  <rect x="76" y="378" width="456" height="18" rx="9" fill="#ffffff" opacity="0.38"/>
  <rect x="76" y="412" width="620" height="18" rx="9" fill="#ffffff" opacity="0.24"/>
  <rect x="76" y="446" width="552" height="18" rx="9" fill="#ffffff" opacity="0.24"/>
  <rect x="76" y="518" width="260" height="58" rx="29" fill="#ffffff" opacity="0.18"/>
  <text x="106" y="555" fill="#ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="700">DEMO EVIDENCE</text>
</svg>`
}

async function ensureDemoAssets() {
  await mkdir(ASSET_DIR, { recursive: true })
  await Promise.all(
    Object.values(ASSETS).map(async (asset) => {
      const svg = demoSvg(asset)
      const filePath = path.join(ASSET_DIR, asset.fileName)
      await writeFile(filePath, svg, "utf8")
    }),
  )
}

function buildUpvotes(problemId, count) {
  return Array.from({ length: count }, (_, index) => ({
    sessionId: `${problemId}-session-${index + 1}`,
  }))
}

async function main() {
  await ensureDemoAssets()

  await prisma.$transaction([
    prisma.upvote.deleteMany({
      where: { problemId: { startsWith: DEMO_PREFIX } },
    }),
    prisma.evidence.deleteMany({
      where: { problemId: { startsWith: DEMO_PREFIX } },
    }),
    prisma.problem.deleteMany({
      where: { id: { startsWith: DEMO_PREFIX } },
    }),
  ])

  for (const problem of PROBLEMS) {
    const asset = problem.evidenceAsset ? ASSETS[problem.evidenceAsset] : null
    await prisma.problem.create({
      data: {
        id: problem.id,
        category: problem.category,
        subcategory: problem.subcategory,
        region: problem.region,
        district: problem.district,
        description: problem.description,
        status: problem.status,
        latitude: problem.latitude,
        longitude: problem.longitude,
        createdAt: problem.createdAt,
        evidence: asset
          ? {
              create: {
                type: "photo",
                fileUrl: `/uploads/demo-seed/${asset.fileName}`,
              },
            }
          : undefined,
        upvotes: {
          create: buildUpvotes(problem.id, problem.upvotes),
        },
      },
    })
  }

  console.log(`Seeded ${PROBLEMS.length} demo problems in SQLite.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
