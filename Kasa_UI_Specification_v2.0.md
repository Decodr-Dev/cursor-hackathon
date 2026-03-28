# KASA — UI Architecture & Screen Specification v2.0

## Mobile-First, Feed-Centric, Social-Media-Inspired Design

**Version 2.0 | March 2026**

> **Design Philosophy:** Kasa should feel as natural as opening Twitter or Instagram — a fast, scrollable feed you check throughout the day — but with a purpose that goes beyond conversation. Every scroll teaches you something about your community. Every tap creates accountability.

---

## Table of Contents

1. [Design Philosophy & Principles](#1-design-philosophy--principles)
2. [App Shell & Navigation](#2-app-shell--navigation)
3. [The Opening Experience](#3-the-opening-experience)
4. [The Feed — Core Experience](#4-the-feed--core-experience)
5. [Trending & Discovery](#5-trending--discovery)
6. [Post a Problem (The Compose Flow)](#6-post-a-problem-the-compose-flow)
7. [Problem Detail (The Thread View)](#7-problem-detail-the-thread-view)
8. [Resolution Timeline](#8-resolution-timeline)
9. [Submit a Solution](#9-submit-a-solution)
10. [Community Verification](#10-community-verification)
11. [Resolution Verification](#11-resolution-verification)
12. [Profile & My Activity](#12-profile--my-activity)
13. [Accountability Scores (Public)](#13-accountability-scores-public)
14. [Official Dashboard](#14-official-dashboard)
15. [Business Dashboard](#15-business-dashboard)
16. [Admin Panel](#16-admin-panel)
17. [Notifications](#17-notifications)
18. [Settings](#18-settings)
19. [Onboarding & Registration](#19-onboarding--registration)
20. [Component Library](#20-component-library)
21. [User Flow Diagrams](#21-user-flow-diagrams)
22. [Design System](#22-design-system)

---

# 1. Design Philosophy & Principles

## 1.1 The Core Idea

Kasa looks and feels like a social media app — but instead of sharing selfies or opinions, people share problems that need solving. The feed is the heartbeat. Engagement is the fuel. Accountability is the product.

Think of it this way: **Twitter shows you what people are talking about. Kasa shows you what people are suffering from — and what's being done about it.**

## 1.2 What We Borrow From Social Media

| Social media pattern | How Kasa uses it |
|---------------------|-----------------|
| The infinite scroll feed | Problems scroll like tweets — fast, scannable, always fresh |
| Likes / retweets | Upvotes = "I have this problem too" — social proof that drives severity |
| Trending topics | Trending problem categories — what's breaking in your area right now |
| Profile pages | User profiles show their reporting history and impact — like a civic reputation |
| Threads / replies | Problem threads with peer solutions, official responses, and business solutions — layered like tweet replies |
| Notifications | Real-time alerts when your problem gets attention — the dopamine loop serves accountability |
| Verified badges | Trust markers for officials, experts, and businesses — credibility at a glance |
| The compose button | The floating "Report" button = the tweet compose button. Always visible. Always one tap away. |

## 1.3 What Makes Kasa Different From Social Media

| Social media norm | Kasa alternative |
|-------------------|-----------------|
| Anyone can say anything | Every report requires evidence and verification |
| Content disappears in 24 hours | Problems stay open until resolved — no burying, no forgetting |
| Engagement = entertainment | Engagement = accountability — upvotes push problems to officials |
| Algorithms optimise for time spent | Algorithm optimises for problems solved |
| Verified = famous | Verified = accountable. Official scores are public and permanent. |
| Delete your post | Official responses cannot be deleted. The record is permanent. |

## 1.4 Mobile-First Rules

- **Design for a 375px wide screen first** (iPhone SE / mid-range Android). Scale up from there.
- **One-thumb operation:** All primary actions reachable with right thumb in the bottom 60% of screen.
- **3-second rule:** First meaningful content must appear within 3 seconds on a 3G connection.
- **Scroll is king:** Users should be able to understand the platform by scrolling. Minimal tapping required to get value.
- **Familiar gestures:** Pull to refresh. Swipe between tabs. Long-press for options. No learning curve.
- **Data diet:** Under 500KB initial load. Images lazy-loaded. Low-data mode available.

---

# 2. App Shell & Navigation

## 2.1 Bottom Navigation Bar

Fixed at the bottom of every screen. 5 tabs. Always visible.

```
┌────────────────────────────────────────────────┐
│                                                │
│              [ Screen Content ]                │
│                                                │
├────────┬────────┬────────┬────────┬────────────┤
│  🏠    │  🔥    │  ✚     │  📊   │  👤        │
│ Feed   │Trending│ Report │ Scores│  Me         │
└────────┴────────┴────────┴────────┴────────────┘
```

| Position | Icon | Label | Description |
|----------|------|-------|-------------|
| 1 (left) | 🏠 | Feed | The main problem feed — your home screen |
| 2 | 🔥 | Trending | What's blowing up right now — trending problems, rising categories, spikes |
| 3 (centre) | ✚ | Report | Post a new problem. **Larger button. Gold accent. Elevated.** This is the primary call to action. Like Twitter's compose button, but bolder. |
| 4 | 📊 | Scores | Public accountability scores — how your officials are performing |
| 5 (right) | 👤 | Me | Your profile, your reports, your impact |

**Active state:** Selected tab icon fills solid + label appears in Kasa Gold. Inactive tabs are outline-style, grey.

**The Report button** is intentionally larger (56px vs 48px for others) and uses the gold accent colour with a subtle shadow. It's the most important action on the platform and should feel like a bold invitation.

## 2.2 Top Bar

Sticky at the top. Context-sensitive.

**On the Feed screen:**

```
┌─────────────────────────────────────────────────┐
│ KASA                [📍 Accra Metro ▾]     🔔 3 │
└─────────────────────────────────────────────────┘
```

- **Left:** "KASA" wordmark in Kasa Green. Small. Confident.
- **Centre:** Location pill — shows current feed scope. Tappable to change. Has a subtle down-arrow to indicate it's interactive. This is how users switch between "My District" / "My Region" / "National."
- **Right:** Notification bell with unread count badge (red circle).

**On other screens:**

```
┌─────────────────────────────────────────────────┐
│ ← Back        [Screen Title]              🔔 3  │
└─────────────────────────────────────────────────┘
```

## 2.3 Desktop Layout (>1024px)

On desktop, the layout shifts to a three-column structure, similar to Twitter's desktop:

```
┌──────────┬───────────────────────┬──────────────┐
│          │                       │              │
│ Left     │   Centre              │   Right      │
│ Sidebar  │   Feed / Main Content │   Sidebar    │
│          │                       │              │
│ - Feed   │   (scrollable)        │ - Trending   │
│ - Trend  │                       │ - Top Scores │
│ - Report │                       │ - Suggested  │
│ - Scores │                       │   Problems   │
│ - Me     │                       │ - Download   │
│          │                       │   the App    │
│          │                       │              │
└──────────┴───────────────────────┴──────────────┘
```

- Left sidebar replaces the bottom nav
- Centre column is the feed (max-width 600px, just like Twitter)
- Right sidebar shows trending categories, top scores, and suggested problems

---

# 3. The Opening Experience

## 3.1 First-Time User (Not Logged In)

When someone opens Kasa for the very first time, they should immediately understand what this is and feel the pulse of what's happening in their country.

**Screen: The Welcome Feed**

No registration wall. No splash screen with 5 slides they'll skip. They land directly on a **read-only version of the feed** with a compelling header.

```
┌─────────────────────────────────────────────────┐
│ KASA                                            │
├─────────────────────────────────────────────────┤
│                                                 │
│   🇬🇭  What's happening in Ghana right now       │
│                                                 │
│   347 problems reported today                   │
│   23 resolved this week                         │
│   ─────────────────────────────────────────      │
│                                                 │
│   [🔥 Trending: Water crisis in Northern Region │
│    — 1,200 reports this week]                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   [Problem Card 1 — read-only]                  │
│   [Problem Card 2 — read-only]                  │
│   [Problem Card 3 — read-only]                  │
│                                                 │
│   ─────── Want to be heard? ───────             │
│                                                 │
│   [ 🗣️ Join Kasa — Report a Problem ]           │
│   (gold button, full width)                     │
│                                                 │
│   [Problem Card 4 — read-only]                  │
│   [Problem Card 5 — read-only]                  │
│                                                 │
│   ─────── Your officials, scored. ──────        │
│                                                 │
│   [ 📊 View Accountability Scores ]             │
│   (secondary button)                            │
│                                                 │
│   [Problem Card 6 — read-only]                  │
│   ...continues scrolling...                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Key behaviours:**
- The feed is real. It shows actual problems from across Ghana. This is not a demo — it's the live platform.
- Tapping a problem card opens the Problem Detail screen (read-only for non-logged-in users).
- Tapping the upvote button prompts: "Sign up to add your voice."
- Every 4–5 cards, a contextual call-to-action appears (alternating between "Report a Problem" and "View Accountability Scores").
- The **Accountability Scores** tab is fully accessible without login.
- Location pill says "Ghana" by default. Tappable to filter by region.

**Why this works:** The user gets instant value before signing up. They see their country's problems. They feel the urgency. They see that officials are being scored. The signup prompt appears naturally, not as a wall.

## 3.2 Returning User (Logged In)

When a logged-in user opens Kasa, they land on their **personalised feed**:

```
┌─────────────────────────────────────────────────┐
│ KASA               [📍 Accra Metro ▾]      🔔 3│
├─────────────────────────────────────────────────┤
│                                                 │
│  Good morning, Kwame 👋                         │
│  Here's what's happening in Accra Metro         │
│                                                 │
│  🔴 3 urgent problems in your area              │
│  📬 2 updates on problems you reported          │
│  📍 1 problem near you needs verification       │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Filter chips: All | Roads | Water | Health...]│
│                                                 │
│  [Problem Card 1]                               │
│  [Problem Card 2]                               │
│  [Problem Card 3]                               │
│  ...infinite scroll...                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

**The greeting header:**
- Personalised: "Good morning, Kwame 👋" (time-aware greeting)
- Localised summary: "Here's what's happening in [user's district]"
- Quick-hit stats that create urgency and invite action:
  - Urgent problems nearby (links to filtered feed)
  - Updates on user's own reports (links to My Activity)
  - Verification requests nearby (links directly to verification card)
- This header scrolls away as the user scrolls down — the feed takes over.

## 3.3 The Location Selector

Tapping the location pill opens a bottom sheet:

```
┌─────────────────────────────────────────────────┐
│ ─── Choose your feed ───                        │
│                                                 │
│ 🔍 Search district or region...                 │
│                                                 │
│ ● My District — Accra Metro (default)           │
│ ○ My Region — Greater Accra                     │
│ ○ 🇬🇭 All of Ghana                              │
│                                                 │
│ ─── Or browse ───                               │
│                                                 │
│ Greater Accra          ▸                         │
│ Ashanti                ▸                         │
│ Western                ▸                         │
│ Northern               ▸                         │
│ ...all 16 regions...                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

Selecting a region expands to show its districts. Selection instantly refreshes the feed.

---

# 4. The Feed — Core Experience

## 4.1 Feed Layout

The feed is the soul of Kasa. It must feel fast, scannable, and alive — like a Twitter timeline but for real problems.

**Anatomy of the feed screen:**

```
┌─────────────────────────────────────────────────┐
│ KASA               [📍 Accra Metro ▾]      🔔  │
├─────────────────────────────────────────────────┤
│ [Filter chips — horizontally scrollable]        │
│  All | 🛣️ Roads | 💧 Water | ⚡ Power | 🏥 ... │
├─────────────────────────────────────────────────┤
│ [Sort tabs]                                     │
│  For You | Latest | Most Upvoted | Most Severe  │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌─── Problem Card ────────────────────────┐     │
│ │                                         │     │
│ │ Kwame A. ✓  •  2h                       │     │
│ │ 📍 Madina, Accra Metro                  │     │
│ │                                         │     │
│ │ The main road to Madina market has a     │     │
│ │ massive pothole. Three accidents this    │     │
│ │ week alone. Completely dangerous.        │     │
│ │                                         │     │
│ │ ┌───────────────────────────────┐       │     │
│ │ │ 📸 Photo                      │       │     │
│ │ │    (full width, rounded)      │       │     │
│ │ └───────────────────────────────┘       │     │
│ │                                         │     │
│ │ 🛣️ Roads > Pothole   🔴 Severity: 78   │     │
│ │                                         │     │
│ │ 👆 347   💬 12   🔗 Share               │     │
│ │                                         │     │
│ │ ✅ Community Verified                   │     │
│ └─────────────────────────────────────────┘     │
│                                                 │
│ ┌─── Problem Card ────────────────────────┐     │
│ │ ...next problem...                      │     │
│ └─────────────────────────────────────────┘     │
│                                                 │
│ ...infinite scroll...                           │
│                                                 │
└─────────────────────────────────────────────────┘
     [🏠] [🔥] [  ✚  ] [📊] [👤]
```

## 4.2 The Problem Card (Detailed Spec)

This is the most important UI component. It must communicate a lot of information without feeling cluttered.

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Avatar] Kwame A. ✓        •  2 hours ago      │
│           📍 Madina, Accra Metro                │
│                                                 │
│  The main road to Madina market has had a       │
│  massive pothole for 3 months. Cars swerve      │
│  into oncoming traffic to avoid it. Three       │
│  accidents this week alone...                   │
│                                    [Read more]  │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │                                         │    │
│  │           📸 Evidence Photo             │    │
│  │           (16:9 ratio, rounded 12px)    │    │
│  │                                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌──────────┐  ┌────────────────────────┐       │
│  │🛣️ Roads  │  │ 🔴 72 Severity         │       │
│  │ >Pothole │  │                        │       │
│  └──────────┘  └────────────────────────┘       │
│                                                 │
│  ┌────────┐  ┌────────┐  ┌─────────┐  ┌────┐  │
│  │👆 347  │  │💬 12   │  │📅 34d   │  │🔗  │  │
│  │Upvote  │  │Respond │  │Open     │  │Share│  │
│  └────────┘  └────────┘  └─────────┘  └────┘  │
│                                                 │
│  ✅ Community Verified  •  🏛️ Acknowledged      │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Row 1 — The poster line** (like a tweet header):
- Small circular avatar (32px)
- Display name + verification badge (✓)
- Time ago (relative: "2h", "3d", "1w")
- Location pin + district name

**Row 2 — The description:**
- Problem text, max 3 lines in feed view. "Read more" expands inline or taps through to detail.
- If translated: small label "Translated from Twi" with toggle.

**Row 3 — Evidence photo:**
- If photo evidence exists, show it full-width with rounded corners.
- 16:9 aspect ratio, lazy-loaded.
- If multiple photos: show first photo with a "+3" badge in the corner. Swipeable.
- If no photo (document/screenshot): show a file-type icon with filename.

**Row 4 — Category & Severity:**
- Category chip: icon + category > subcategory
- Severity badge: colour-coded circle with number. Colour follows the severity scale:
  - Green < 30
  - Yellow 30–60
  - Orange 60–80
  - Red > 80 (with subtle pulse animation for urgency)

**Row 5 — Action bar** (like Twitter's reply/retweet/like/share row):
- **👆 Upvote** (with count) — tap to upvote, turns gold when active. Like a "like" but means "I have this problem too."
- **💬 Respond** (with count) — total solutions/responses. Taps through to thread.
- **📅 Open duration** — "34d" means open for 34 days. Creates urgency.
- **🔗 Share** — share to WhatsApp, Twitter, copy link.

**Row 6 — Status indicators:**
- Status badges shown as small pills: "✅ Community Verified" "🏛️ Acknowledged" "🔧 In Progress" "✅ Resolved"
- If there's an official response: "🏛️ Accra Metro Assembly responded" shown as a preview link.

**Card interactions:**
- Tap anywhere on the card → opens Problem Detail (the thread view)
- Tap upvote → toggles upvote (with bounce animation)
- Tap share → opens share sheet
- Long-press → options menu (Report, Save, Not interested)

## 4.3 Feed Sort Tabs

Below the filter chips, four sort tabs:

| Tab | What It Shows | Why |
|-----|--------------|-----|
| **For You** | Personalised blend of problems from user's district + categories they follow, weighted by severity and recency | Default tab. The "smart" feed. Like Twitter's "For You." |
| **Latest** | Pure chronological, newest first | For users who want to see everything as it comes in. Like Twitter's "Following." |
| **Most Upvoted** | Highest upvote count in selected timeframe (today / this week / this month) | See what the community cares about most. |
| **Most Severe** | Highest severity score | See the biggest crises first. |

## 4.4 Filter Chips

Horizontally scrollable category filters. Tapping one filters the feed instantly. Multiple can be selected.

```
[All] [🛣️ Roads] [💧 Water] [⚡ Power] [🏥 Health] [🎓 Education] [🛡️ Security] [🏛️ Govt] [💼 Jobs] [🌿 Environ] [🏠 Housing] [🚨 Fraud] [📱 Telecom]
```

- "All" is selected by default
- Active chips use gold background
- A small count badge can optionally appear on each chip showing how many open problems exist in that category for the current location

## 4.5 In-Feed Contextual Elements

Just like Twitter intersperses trends, suggestions, and ads within the feed, Kasa places contextual elements between problem cards:

**Every 5 cards — a contextual insert (rotating):**

Type 1: **Trending Alert**
```
┌─────────────────────────────────────────────────┐
│ 🔥 Trending in your area                        │
│                                                 │
│ Water & Sanitation reports up 340% this week    │
│ in Accra Metro. 89 new reports.                 │
│                                                 │
│ [See all water problems →]                      │
└─────────────────────────────────────────────────┘
```

Type 2: **Accountability Spotlight**
```
┌─────────────────────────────────────────────────┐
│ 📊 Your Assembly's Score                         │
│                                                 │
│ Accra Metro Assembly: 67/100                    │
│ Rank #23 of 261 districts                       │
│ Resolution rate: 42% ↓ 3% this month            │
│                                                 │
│ [See full scorecard →]                          │
└─────────────────────────────────────────────────┘
```

Type 3: **Resolution Win**
```
┌─────────────────────────────────────────────────┐
│ 🎉 Problem Resolved!                            │
│                                                 │
│ "Broken street lights on Spintex Road"          │
│ Resolved in 12 days. Confirmed by 91% of        │
│ reporters.                                      │
│                                                 │
│ [View the full story →]                         │
└─────────────────────────────────────────────────┘
```

Type 4: **Verification Request** (only shown to eligible users)
```
┌─────────────────────────────────────────────────┐
│ 📍 Help verify a problem near you (1.2km)        │
│                                                 │
│ "Flooding on Achimota Road"                     │
│                                                 │
│ [✅ Confirm] [❌ Deny] [🤷 Unsure]              │
└─────────────────────────────────────────────────┘
```

Type 5: **Business Solution** (sponsored, clearly labelled)
```
┌─────────────────────────────────────────────────┐
│ 💼 Sponsored Solution                            │
│                                                 │
│ [Business Logo] RoadFix Ghana Ltd ✓             │
│ "Professional pothole repair in 48 hours.       │
│  Serving Greater Accra."                        │
│                                                 │
│ [Learn More] [Dismiss]                          │
└─────────────────────────────────────────────────┘
```

## 4.6 Pull-to-Refresh & Real-Time Updates

- **Pull to refresh:** Standard gesture. Spinner uses Kasa Gold colour.
- **New problems banner:** When new problems are posted while the user is scrolling, a sticky banner appears at the top:

```
┌─────────────────────────────────────────────────┐
│     ↑ 3 new problems — Tap to see               │
└─────────────────────────────────────────────────┘
```

Tapping scrolls to top and loads the new cards with a subtle slide-down animation.

## 4.7 Empty & Edge States

**No problems matching filters:**
```
Nothing here yet.
Be the first to report a [category] problem in [location].
[✚ Report a Problem]
```

**No internet connection:**
```
You're offline.
Showing cached problems from [X minutes ago].
[Draft a report offline →]
```

**First-time user with empty feed:**
```
Welcome to Kasa! 🇬🇭
Your feed will fill up as people in [district] report problems.
In the meantime, check what's trending nationally.
[🔥 View Trending] or [✚ Report the First Problem]
```

---

# 5. Trending & Discovery

## 5.1 The Trending Screen

Accessed via the 🔥 tab. This is Kasa's answer to Twitter's "Explore" page — but instead of trending hashtags, it shows trending problems.

```
┌─────────────────────────────────────────────────┐
│ 🔥 Trending                        [📍 Ghana ▾]│
├─────────────────────────────────────────────────┤
│                                                 │
│ 🔍 Search problems, places, officials...        │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ ── RIGHT NOW ──                                 │
│                                                 │
│ 1. 💧 Water Crisis — Northern Region            │
│    1,247 reports  •  ⬆️ 340% this week          │
│    Severity: 🔴 94                              │
│                                                 │
│ 2. 🛣️ Kumasi-Accra Highway Collapse             │
│    834 reports  •  ⬆️ 890% today                │
│    Severity: 🔴 91                              │
│                                                 │
│ 3. ⚡ Power Outages — Ashanti Region             │
│    612 reports  •  ⬆️ 120% this week            │
│    Severity: 🟠 78                              │
│                                                 │
│ 4. 🏥 Drug Shortage — Korle Bu Hospital          │
│    445 reports  •  ⬆️ 67% this week             │
│    Severity: 🟠 72                              │
│                                                 │
│ 5. 🚨 Fake Job Adverts — Greater Accra           │
│    398 reports  •  ⬆️ 200% this month           │
│    Severity: 🟡 58                              │
│                                                 │
│ [Show more trending →]                          │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ ── RISING CATEGORIES ──                         │
│                                                 │
│ [💧 Water +340%] [🛣️ Roads +120%]               │
│ [🚨 Fraud +200%] [⚡ Power +89%]                 │
│ (horizontally scrollable chips with flame icon) │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ ── MOST UPVOTED TODAY ──                        │
│                                                 │
│ [Problem Card — highest upvoted today]          │
│ [Problem Card]                                  │
│ [Problem Card]                                  │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ ── LONGEST UNRESOLVED ──                        │
│                                                 │
│ [Problem Card — 847 days open]                  │
│ [Problem Card — 623 days open]                  │
│ [Problem Card — 511 days open]                  │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ ── RECENTLY RESOLVED 🎉 ──                      │
│                                                 │
│ [Problem Card — resolved 2 hours ago]           │
│ [Problem Card — resolved yesterday]             │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ ── BROWSE BY REGION ──                          │
│                                                 │
│ [Map of Ghana with region hotspots]             │
│ Tap a region to explore its problems            │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 5.2 Trending Item Card

Each trending item is tappable and opens a **Trending Detail View** — a mini-dashboard for that trending issue:

```
┌─────────────────────────────────────────────────┐
│ ← Back                                          │
│                                                 │
│ 💧 Water Crisis — Northern Region               │
│                                                 │
│ 1,247 reports  •  Severity: 🔴 94               │
│ ⬆️ 340% increase this week                      │
│ 💰 Est. daily cost: GHS 234,000                 │
│                                                 │
│ [📈 7-day trend chart — reports over time]       │
│                                                 │
│ [🗺️ Map showing affected areas]                 │
│                                                 │
│ ── OFFICIAL RESPONSE STATUS ──                  │
│ Northern Regional Assembly: ❌ No response       │
│ GWCL: 🏛️ Acknowledged (2 days ago)              │
│                                                 │
│ ── INDIVIDUAL REPORTS ──                        │
│ [Problem Card 1]                                │
│ [Problem Card 2]                                │
│ [Problem Card 3]                                │
│ ...                                             │
│                                                 │
│ [👆 I Have This Problem Too]                     │
│ (large gold button)                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 5.3 Search

The search bar on the Trending screen supports:

- **Text search:** "pothole Madina" → finds matching problems
- **Category search:** "water" → shows water category feed
- **Location search:** "Tamale" → shows Tamale district feed
- **Official search:** "Accra Metro Assembly" → shows their score page
- **Autocomplete suggestions** appear as user types
- Recent searches shown below search bar when empty

---

# 6. Post a Problem (The Compose Flow)

## 6.1 Design Philosophy

Posting a problem should feel as easy as composing a tweet — but with the structure needed for verification. The flow is designed as a **single scrollable screen** with expanding sections, not a multi-step wizard. This reduces friction and feels more native.

## 6.2 The Compose Screen

Tapping the ✚ Report button opens a full-screen compose view (slides up from bottom, like Twitter's compose):

```
┌─────────────────────────────────────────────────┐
│ ✕ Cancel              Report a Problem    Post → │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Avatar] Kwame A.                               │
│                                                 │
│ What's the problem?                             │
│ ┌─────────────────────────────────────────┐     │
│ │ Describe what's happening...            │     │
│ │                                         │     │
│ │ (Large text area, auto-expanding)       │     │
│ │                                         │     │
│ │                            0 / 2000     │     │
│ └─────────────────────────────────────────┘     │
│                                                 │
│ ┌─ AI Suggestion (slides in as user types) ──┐  │
│ │ 💡 Suggested: 🛣️ Roads > Pothole           │  │
│ │ [✓ Accept]  [Change →]                      │  │
│ └─────────────────────────────────────────────┘  │
│                                                 │
│ ── CATEGORY ──                                  │
│ [Select category ▸] (taps open picker)          │
│ (auto-filled if AI suggestion accepted)         │
│                                                 │
│ ── LOCATION ──                                  │
│ [📍 Use my current location]                     │
│    or                                           │
│ [🗺️ Pick on map ▸]                              │
│    or                                           │
│ [✏️ Type address]                                │
│                                                 │
│ Selected: 📍 Madina, Accra Metro ✓              │
│ [Small map preview with pin]                    │
│                                                 │
│ ── EVIDENCE ──                                  │
│ Add at least one piece of evidence              │
│                                                 │
│ [📸 Camera] [🖼️ Gallery] [📄 Document]          │
│                                                 │
│ ┌──────┐ ┌──────┐                              │
│ │ 📸 ✓ │ │ + Add│                              │
│ │      │ │ more │                              │
│ └──────┘ └──────┘                              │
│ ✅ Photo GPS matches location                   │
│                                                 │
│ ── LANGUAGE ──                                  │
│ Detected: English                               │
│ [Change language ▸]                             │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  [ 🗣️  Post Report ]                            │
│  (large gold button, full width)                │
│                                                 │
│  Your report will be verified by nearby users   │
│  within 24 hours.                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 6.3 Duplicate Check (Modal)

After tapping "Post Report," if the AI detects similar problems:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│ ⚠️ Similar problems already reported             │
│                                                 │
│ ┌─────────────────────────────────────────┐     │
│ │ "Pothole on Madina-Accra road"          │     │
│ │ 📍 Madina  •  👆 234 upvotes            │     │
│ │ Posted 12 days ago                      │     │
│ │ [Join this report →]                    │     │
│ └─────────────────────────────────────────┘     │
│                                                 │
│ ┌─────────────────────────────────────────┐     │
│ │ "Road damage near Madina market"        │     │
│ │ 📍 Madina  •  👆 89 upvotes             │     │
│ │ Posted 5 days ago                       │     │
│ │ [Join this report →]                    │     │
│ └─────────────────────────────────────────┘     │
│                                                 │
│ None of these match?                            │
│ [Post as a new problem →]                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 6.4 Post-Submission Confirmation

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              🎉                                  │
│                                                 │
│     Your problem has been reported!             │
│                                                 │
│     It's now being verified by people           │
│     near 📍 Madina, Accra Metro.                │
│                                                 │
│     We'll notify you when it's confirmed.       │
│                                                 │
│     [View your report]                          │
│     [Share on WhatsApp]                         │
│     [Back to Feed]                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

# 7. Problem Detail (The Thread View)

## 7.1 Design Philosophy

This is the equivalent of opening a tweet and seeing the full thread. The problem is the "original tweet" and the solutions, official responses, and community activity are the "replies."

## 7.2 Screen Layout

```
┌─────────────────────────────────────────────────┐
│ ← Back                              🔗 Share    │
├─────────────────────────────────────────────────┤
│                                                 │
│ ── THE PROBLEM ──                               │
│                                                 │
│ [Avatar] Kwame A. ✓                             │
│ 📍 Madina, Accra Metro  •  Mar 15, 2026        │
│                                                 │
│ The main road to Madina market has had a        │
│ massive pothole for 3 months. Cars swerve       │
│ into oncoming traffic to avoid it. Three        │
│ accidents this week alone. It's completely      │
│ dangerous and someone is going to die.          │
│                                                 │
│ [Full-width photo — tap to enlarge]             │
│ [Photo 2 — swipe for more]                      │
│                                                 │
│ 🛣️ Roads > Pothole                              │
│ 🔴 Severity: 78/100                             │
│ 📅 Open for 34 days                             │
│ 💰 Est. daily cost: GHS 15,240                  │
│                                                 │
│ 👆 347 Upvote  💬 12  🔗 Share                   │
│                                                 │
│ ✅ Community Verified (5 users)                  │
│ 🏛️ Acknowledged by Accra Metro Assembly          │
│                                                 │
│ ──────────────────────────────────               │
│                                                 │
│ [Tab: 💬 Responses] [Tab: 📅 Timeline]          │
│                                                 │
│ ── RESPONSES (sorted: Official first) ──        │
│                                                 │
│ ┌─ Official Response ────────────────────┐      │
│ │ 🏛️ Accra Metro Assembly ✓              │      │
│ │ Mar 18, 2026 • 11:02 AM                │      │
│ │                                         │      │
│ │ "We are aware of this issue and have    │      │
│ │ dispatched a maintenance team. Expected  │      │
│ │ repair date: April 5."                  │      │
│ │                                         │      │
│ │ Status: 🔧 In Progress                  │      │
│ │                                         │      │
│ │ Was this helpful?  👍 45  👎 12         │      │
│ └─────────────────────────────────────────┘      │
│                                                 │
│ ┌─ Peer Solution ────────────────────────┐      │
│ │ 💡 Ama K. ✓  [🏗️ Verified Engineer]    │      │
│ │ Mar 20, 2026                            │      │
│ │                                         │      │
│ │ "In the meantime, there's a side road   │      │
│ │ through Rawlings Park that avoids this   │      │
│ │ stretch entirely. It adds 5 min but is   │      │
│ │ much safer."                            │      │
│ │                                         │      │
│ │ Was this helpful?  👍 89  👎 4          │      │
│ └─────────────────────────────────────────┘      │
│                                                 │
│ ┌─ Business Solution ────────────────────┐      │
│ │ 🏢 RoadFix Ghana ✓  (Sponsored)        │      │
│ │ Mar 22, 2026                            │      │
│ │                                         │      │
│ │ "We offer emergency pothole repair.     │      │
│ │ 48-hour turnaround. Serving Accra."     │      │
│ │                                         │      │
│ │ 📞 024-XXX-XXXX  |  🌐 roadfix.com.gh  │      │
│ │                                         │      │
│ │ Was this helpful?  👍 23  👎 8          │      │
│ └─────────────────────────────────────────┘      │
│                                                 │
│ [💬 Add a solution...]                          │
│                                                 │
│ ── RELATED PROBLEMS ──                          │
│ [Card: "Road damage on Legon bypass" — 89 👆]   │
│ [Card: "Flooded road in East Legon" — 56 👆]    │
│                                                 │
└─────────────────────────────────────────────────┘
     [🏠] [🔥] [  ✚  ] [📊] [👤]
```

## 7.3 Response Ordering

Responses within the thread are ordered by:
1. **Official responses first** — always pinned to the top of the responses section
2. **Then by helpfulness** — highest helpful_percentage first
3. **Expert-badged solutions** get a visual boost (highlighted border)
4. **Business solutions** appear below peer solutions unless sponsored (then labelled clearly)

---

# 8. Resolution Timeline

Accessed via the "📅 Timeline" tab on the Problem Detail screen.

```
┌─────────────────────────────────────────────────┐
│                                                 │
│ ── TIMELINE ──                                  │
│                                                 │
│ ● Mar 15  📝 Reported                           │
│ │  by Kwame A. — 9:32 AM                       │
│ │                                               │
│ ● Mar 15  ✅ Community Verified                  │
│ │  Confirmed by 5 local users — 4:18 PM        │
│ │                                               │
│ ● Mar 17  👆 Milestone: 100 Upvotes             │
│ │                                               │
│ ● Mar 18  🏛️ Officially Acknowledged             │
│ │  Accra Metro Assembly:                        │
│ │  "We are aware and have dispatched a team."   │
│ │  — 11:02 AM                                   │
│ │                                               │
│ ● Mar 20  💡 Peer Solution Posted                │
│ │  by Ama K. (Verified Engineer)                │
│ │  Rated 96% helpful                            │
│ │                                               │
│ ● Mar 22  🔧 Status: In Progress                │
│ │  Updated by Accra Metro Assembly              │
│ │  "Repair crew scheduled for next week."       │
│ │                                               │
│ ● Mar 25  ⚠️ Severity Escalated (Score: 78)     │
│ │  Media verification requested                 │
│ │                                               │
│ ◉ NOW — Open for 34 days                        │
│   Awaiting resolution                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

Each node is colour-coded by type (see Section 20 for the colour system). The "NOW" node pulses gently to show the problem is still active.

---

# 9. Submit a Solution

Tapping "Add a solution" at the bottom of the thread view:

```
┌─────────────────────────────────────────────────┐
│ ✕ Cancel           Add a Solution       Post →  │
├─────────────────────────────────────────────────┤
│                                                 │
│ Responding to:                                  │
│ "Massive pothole on Madina road"                │
│                                                 │
│ ┌─────────────────────────────────────────┐     │
│ │ Share what worked for you...            │     │
│ │                                         │     │
│ │ (text area)                             │     │
│ │                               0 / 1500  │     │
│ └─────────────────────────────────────────┘     │
│                                                 │
│ [📸 Add photo] [📄 Add file]                    │
│                                                 │
│ [ 💡 Post Solution ]                            │
│ (gold button)                                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

Same compose feel as posting a problem — minimal, fast, familiar.

---

# 10. Community Verification

## 10.1 In-Feed Verification Card

When a nearby user is eligible to verify a problem, it appears in their feed:

```
┌─────────────────────────────────────────────────┐
│ 📍 Help verify — 1.2km from you                  │
│                                                 │
│ "Broken water pipe flooding Spintex junction"   │
│                                                 │
│ ┌─────────────────────────────────┐             │
│ │ 📸 Photo evidence               │             │
│ └─────────────────────────────────┘             │
│                                                 │
│ [Small map showing pin location]                │
│                                                 │
│ Can you confirm this problem exists?            │
│                                                 │
│ [✅ Yes]    [❌ No]    [🤷 Unsure]              │
│                                                 │
│ [📸 Add your own photo]  [💬 Comment]           │
└─────────────────────────────────────────────────┘
```

Voting is inline — user votes without leaving the feed. Card collapses to "Thanks for verifying ✓" after voting.

---

# 11. Resolution Verification

When a resolution is claimed, reporters and upvoters see:

```
┌─────────────────────────────────────────────────┐
│ 🎯 Resolution claimed                           │
│                                                 │
│ Accra Metro Assembly says:                      │
│ "The pothole on Madina Road has been repaired." │
│                                                 │
│ ┌──────────────┐  ┌──────────────┐             │
│ │ Before 📸     │  │ After 📸     │             │
│ │              │  │              │             │
│ └──────────────┘  └──────────────┘             │
│                                                 │
│ Did this fix your problem?                      │
│                                                 │
│ [✅ Yes, it's fixed!]  [❌ No, it's NOT fixed]  │
│                                                 │
│ [📸 Upload current photo]  [💬 Comment]         │
│                                                 │
│ ░░░░░░░░░░░░░░░░░░░░░░░░ 23/45 voted           │
│ 6 days remaining                                │
└─────────────────────────────────────────────────┘
```

---

# 12. Profile & My Activity

## 12.1 Layout (The "Me" Tab)

Feels like a Twitter profile page but focused on civic impact.

```
┌─────────────────────────────────────────────────┐
│ ⚙️                              [Edit Profile]  │
├─────────────────────────────────────────────────┤
│                                                 │
│        [Avatar — large, 80px]                   │
│        Kwame Asante ✓                           │
│        📍 Madina, Accra Metro                   │
│        Joined March 2026                        │
│                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │ 12       │ │ 347      │ │ 3        │         │
│ │ Reports  │ │ Upvotes  │ │ Solutions│         │
│ │ posted   │ │ received │ │ posted   │         │
│ └──────────┘ └──────────┘ └──────────┘         │
│                                                 │
│ ── YOUR IMPACT ──                               │
│ 🎉 3 of your problems have been resolved        │
│ 👆 Your reports received 347 total upvotes      │
│ 💡 Your solutions rated 89% helpful             │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Tab: My Reports] [Tab: My Upvotes]             │
│ [Tab: My Solutions] [Tab: Actions Needed]       │
│                                                 │
│ ── MY REPORTS ──                                │
│ [Problem Card — compact view]                   │
│ [Problem Card — compact view]                   │
│ [Problem Card — compact view]                   │
│                                                 │
│ ── ACTIONS NEEDED ──                            │
│ 🔵 2 verification requests near you             │
│ 🔵 1 resolution vote pending                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 12.2 Profile Tabs

| Tab | Content |
|-----|---------|
| My Reports | All problems posted by user, with status badges and upvote counts. Filter: All / Open / Resolved. |
| My Upvotes | Problems the user has upvoted. Like a "bookmarks" list — lets users track issues they care about. |
| My Solutions | Solutions posted by the user, with helpfulness ratings. |
| Actions Needed | Verification requests + resolution votes — highlighted with gold badge count. |

---

# 13. Accountability Scores (Public)

## 13.1 The Scores Tab

Accessed via 📊 in bottom nav. No login required.

```
┌─────────────────────────────────────────────────┐
│ 📊 Accountability Scores       [📍 Ghana ▾]     │
├─────────────────────────────────────────────────┤
│                                                 │
│ How are Ghana's officials performing?           │
│                                                 │
│ 🔍 Search an official or assembly...            │
│                                                 │
│ [Tab: 🏆 Rankings] [Tab: 🗺️ Map] [Tab: 📉 Data]│
│                                                 │
│ ── RANKINGS ──                                  │
│                                                 │
│ Filter: [All] [MPs] [District Assemblies]       │
│         [Agencies] [Utilities]                  │
│                                                 │
│ ┌─────────────────────────────────────────┐     │
│ │ #1  Sefwi Wiawso Assembly      🟢 89   │     │
│ │     Western North Region               │     │
│ │     Resolution: 78%  Avg: 12 days      │     │
│ └─────────────────────────────────────────┘     │
│ ┌─────────────────────────────────────────┐     │
│ │ #2  Keta Municipal Assembly    🟢 84   │     │
│ │     Volta Region                       │     │
│ │     Resolution: 71%  Avg: 18 days      │     │
│ └─────────────────────────────────────────┘     │
│ ┌─────────────────────────────────────────┐     │
│ │ #3  Tamale Metro Assembly      🟢 81   │     │
│ │     Northern Region                    │     │
│ │     Resolution: 68%  Avg: 21 days      │     │
│ └─────────────────────────────────────────┘     │
│                                                 │
│ ...scrollable list...                           │
│                                                 │
│ ┌─────────────────────────────────────────┐     │
│ │ #259 Accra Metro Assembly      🔴 23   │     │
│ │     Greater Accra                      │     │
│ │     Resolution: 8%  Avg: 67 days       │     │
│ └─────────────────────────────────────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 13.2 Official Profile Page

Tapping an official from the rankings:

```
┌─────────────────────────────────────────────────┐
│ ← Back                              🔗 Share    │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Logo/Crest]  Accra Metropolitan Assembly       │
│               District Assembly                 │
│               📍 Greater Accra                   │
│                                                 │
│        ┌────────────────┐                       │
│        │      23        │                       │
│        │    / 100       │ ← Large score, red    │
│        │  Rank #259     │                       │
│        └────────────────┘                       │
│                                                 │
│ ┌───────────┐┌───────────┐┌───────────┐        │
│ │Ack. Rate  ││Resolution ││Avg Time   │        │
│ │  34%      ││   8%      ││  67 days  │        │
│ │  🔴       ││   🔴      ││   🔴      │        │
│ └───────────┘└───────────┘└───────────┘        │
│                                                 │
│ [📈 Score trend chart — last 6 months]          │
│                                                 │
│ ── COMPARE ──                                   │
│ [Compare with another official ▸]               │
│                                                 │
│ ── RECENT RESPONSES ──                          │
│ [Response card 1]                               │
│ [Response card 2]                               │
│                                                 │
│ ── OPEN PROBLEMS IN JURISDICTION ──             │
│ [Problem Card 1]                                │
│ [Problem Card 2]                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 13.3 Map View Tab

Interactive map of Ghana showing:
- Colour-coded regions/districts by average accountability score
- 🟢 Green: Score > 70
- 🟡 Yellow: Score 40–70
- 🔴 Red: Score < 40
- Tap a region to zoom in and see district-level scores
- Tap a district to see the official's profile

## 13.4 Data View Tab

Public stats for data enthusiasts:
- Total open problems nationally
- Resolution rate by region (bar chart)
- Category breakdown (pie chart)
- Cost of inaction total with breakdown
- "Download report" link (for non-login users, basic PDF; for subscribers, full data)

---

# 14. Official Dashboard

Verified Officials see a different experience when logged in. The bottom nav is replaced with:

```
[📋 My Jurisdiction] [📊 My Score] [📈 Analytics] [⚙️ Settings]
```

### My Jurisdiction Screen:

```
┌─────────────────────────────────────────────────┐
│ 🏛️ Accra Metro Assembly Dashboard               │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│ │ 456  │ │ 34%  │ │  8%  │ │ 67d  │           │
│ │Open  │ │Ack'd │ │Rslvd │ │Avg   │           │
│ └──────┘ └──────┘ └──────┘ └──────┘           │
│                                                 │
│ Score: 23/100  •  Rank: #259                    │
│                                                 │
│ ── NEEDS YOUR RESPONSE ──                       │
│ (problems with no official response, by sevr.)  │
│                                                 │
│ 🔴 [Problem Card + "Respond" button]            │
│ 🔴 [Problem Card + "Respond" button]            │
│ 🟠 [Problem Card + "Respond" button]            │
│ 🟡 [Problem Card + "Respond" button]            │
│                                                 │
│ ── IN PROGRESS ──                               │
│ [Problem Card — status: In Progress]            │
│ [Problem Card — status: Acknowledged]           │
│                                                 │
│ ── RECENTLY RESOLVED ──                         │
│ [Problem Card — resolved 2 days ago]            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Analytics Screen:

- Problems by category (bar chart)
- Weekly report trend (line chart)
- Resolution funnel (Reported → Acknowledged → In Progress → Resolved)
- Hotspot map of jurisdiction
- Comparison with national averages and peer assemblies

---

# 15. Business Dashboard

Verified Businesses see:

```
[📋 Relevant Problems] [💡 My Solutions] [📢 Campaigns] [📈 Analytics]
```

### Relevant Problems:
- Feed filtered to business's registered categories and target regions
- Each card has "Post Solution" and "Boost" buttons

### My Solutions:
- List of solutions posted with helpfulness ratings and engagement data

### Campaigns:
- Active, paused, and completed ad campaigns
- Create new campaign flow: categories → regions → budget → bid → date range → launch
- Performance: impressions, clicks, cost, engagement rate

### Analytics:
- Which categories resonate most
- Which regions engage most with solutions
- Cost per engagement

---

# 16. Admin Panel

Full-width desktop layout (admins use desktop):

**Sidebar navigation:**
- Overview Dashboard
- Moderation Queue (with count badge)
- Flagged Reports (AI flags)
- User Management
- Verification Queue (Ghana Card / Expert / Official / Business)
- Ad Approval Queue
- Data Intelligence Export
- System Health
- Settings

**Overview Dashboard:**
- Key metric cards: Total users, Total problems, Open vs Resolved, Revenue
- Moderation items needing attention (count)
- Charts: Daily reports trend, User growth, Resolution rate over time

**Moderation Queue:**
- List of flagged items with flag reason, confidence score, preview
- Actions: Approve, Reject (with reason), Suspend user
- Bulk actions for efficient moderation

---

# 17. Notifications

## 17.1 Notification Bell (Top Bar)

Unread count badge (red dot with number). Tapping opens notification panel:

```
┌─────────────────────────────────────────────────┐
│ ← Notifications                    Mark all read│
├─────────────────────────────────────────────────┤
│                                                 │
│ ── TODAY ──                                     │
│                                                 │
│ 🔵 🏛️ Accra Metro Assembly responded to your    │
│      report "Pothole on Madina Road"            │
│      Status: In Progress     •    2 hours ago   │
│                                                 │
│    💡 Ama K. posted a solution to your report   │
│      "Pothole on Madina Road"                   │
│      Rated 96% helpful       •    5 hours ago   │
│                                                 │
│ ── YESTERDAY ──                                 │
│                                                 │
│ 🔵 📍 Help verify: "Flooding on Ring Road"      │
│      1.2km from you          •    Yesterday     │
│                                                 │
│    🎯 Resolution claimed on "Broken pipe on     │
│      Spintex." Vote now.     •    Yesterday     │
│                                                 │
│ ── EARLIER ──                                   │
│                                                 │
│    👆 Your report reached 100 upvotes!          │
│      "Pothole on Madina Road" •   3 days ago    │
│                                                 │
└─────────────────────────────────────────────────┘
```

- 🔵 Blue dot = unread
- Tap any notification → goes to relevant screen
- Grouped by time (Today, Yesterday, Earlier)
- Actionable notifications (verify, vote) show inline action buttons

---

# 18. Settings

```
┌─────────────────────────────────────────────────┐
│ ← Settings                                      │
├─────────────────────────────────────────────────┤
│                                                 │
│ ── ACCOUNT ──                                   │
│ Display name                           Kwame A. │
│ Phone number                     +233 XX XXX ▸  │
│ Ghana Card                         Verified ✓ ▸ │
│ Password                             Change ▸   │
│                                                 │
│ ── PREFERENCES ──                               │
│ Language                           English ▸    │
│ Location                      Accra Metro ▸     │
│ Categories you follow                     ▸     │
│ Low data mode                          [OFF]    │
│                                                 │
│ ── NOTIFICATIONS ──                             │
│ In-app                                 [ON]     │
│ SMS                                    [ON]     │
│ WhatsApp                               [ON]     │
│ Email                                  [OFF]    │
│ Notification types                        ▸     │
│                                                 │
│ ── PRIVACY ──                                   │
│ Show my name as          Kwame A. (default) ▸   │
│ Download my data                          ▸     │
│ Delete my account                         ▸     │
│                                                 │
│ ── ABOUT ──                                     │
│ Terms of Service                          ▸     │
│ Privacy Policy                            ▸     │
│ Contact Support                           ▸     │
│ Version 1.0.0                                   │
│                                                 │
│ [Log Out]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

# 19. Onboarding & Registration

## 19.1 Philosophy

No splash screens. No carousel tutorials. The user sees the **live feed first** (read-only). When they try to interact (upvote, post, comment), a prompt appears:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│    Join Kasa to make your voice count.          │
│                                                 │
│    [ 🇬🇭 Sign up with Ghana Card ]              │
│    (recommended — instant verification)         │
│                                                 │
│    [ 📱 Sign up with Phone Number ]              │
│                                                 │
│    Already have an account? [Log in]            │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 19.2 Ghana Card Flow

```
Screen 1: Enter Ghana Card number (GHA-XXXXXXXXX-X)
         → "Verify" button
         → Loading: "Checking with NIA..."
         → Success ✓ or Failure ✗ (try again / use phone)

Screen 2: Profile Setup
         → Display name (auto-filled from card)
         → District & Region (dropdowns)
         → Preferred language
         → Categories of interest (multi-select chips)
         → "Join Kasa" button

Screen 3: You're in!
         → Feed opens with personalised greeting
         → Subtle tooltip: "Tap ✚ to report your first problem"
```

## 19.3 Phone Flow

```
Screen 1: Enter phone number (+233 pre-filled)
         → "Send Code" button
         → 6-digit OTP input with 5-minute timer
         → "Resend code" link (greyed until timer expires)

Screen 2: Create password

Screen 3: Profile Setup (same as above)

Screen 4: You're in!
```

---

# 20. Component Library

## 20.1 Problem Card (Compact — Feed View)

See Section 4.2 for full specification. Summary:
- Poster line (avatar, name, badge, time, location)
- Description (3-line truncation)
- Evidence photo (full-width, 16:9, rounded)
- Category chip + severity badge
- Action bar (upvote, respond, duration, share)
- Status pills

## 20.2 Problem Card (Minimal — Lists & Related)

For use in "My Reports," "Related Problems," etc:

```
┌─────────────────────────────────────────────────┐
│ 🛣️ Pothole on Madina Road                       │
│ 📍 Madina  •  👆 347  •  📅 34d  •  🔴 78      │
│ ✅ Community Verified  •  🔧 In Progress        │
└─────────────────────────────────────────────────┘
```

## 20.3 Official Score Card

```
┌─────────────────────────────────────────────────┐
│ #23  Accra Metro Assembly           🔴 23/100   │
│      Greater Accra  •  Ack: 34%  •  Res: 8%    │
└─────────────────────────────────────────────────┘
```

## 20.4 Trending Item Card

```
┌─────────────────────────────────────────────────┐
│ 1. 💧 Water Crisis — Northern Region            │
│    1,247 reports  •  ⬆️ 340% this week          │
│    🔴 Severity: 94                              │
└─────────────────────────────────────────────────┘
```

## 20.5 Buttons

| Type | Style | Usage |
|------|-------|-------|
| Primary | Gold background (#D4A843), dark text, rounded 12px, full width | "Post Report", "Join Kasa", key CTAs |
| Secondary | White background, Kasa Green border, green text | "View Scores", "Share", secondary actions |
| Ghost | No background, gold text | "Read more", "Show more", inline links |
| Danger | Red background, white text | "Delete account", destructive actions |
| Action bar | Icon + text, no background, grey default, gold active | Upvote, share, respond (in cards) |

## 20.6 Badges & Pills

| Badge | Style | Usage |
|-------|-------|-------|
| Verified user ✓ | Small green checkmark next to name | All verified users |
| Expert badge | Blue pill "🏗️ Verified Engineer" | Experts in their field |
| Official badge | Blue shield icon | Government officials |
| Business badge | Purple briefcase icon | Verified businesses |
| Status pill | Colour-coded rounded rectangle | Problem status indicators |
| Severity badge | Colour-coded circle with number | Severity score display |
| Category chip | Rounded pill with icon | Category filters and labels |

## 20.7 Toast / Snackbar

Appears at the bottom of the screen for brief confirmations:
- "✓ Problem reported successfully"
- "✓ Upvote added"
- "✓ Solution posted"
- Dark background, white text, auto-dismiss after 3 seconds

---

# 21. User Flow Diagrams

## 21.1 First-Time User Journey

```
Opens Kasa (link, search, or QR code)
    │
    ▼
[Live Feed — read-only, no registration wall]
"What's happening in Ghana right now"
    │
    ├── Scrolls, explores, sees real problems
    │
    ├── Taps "Accountability Scores" → full access, no login
    │
    ├── Tries to upvote or post
    │        │
    │        ▼
    │   [Sign-up prompt appears]
    │   "Join Kasa to make your voice count"
    │        │
    │        ├── Ghana Card verification
    │        └── Phone verification
    │             │
    │             ▼
    │        [Profile setup: name, location, language, interests]
    │             │
    │             ▼
    │        [Personalised feed with greeting]
    │        "Good morning, Kwame. Here's what's happening in Accra Metro."
    │
    └── Shares a problem link on WhatsApp
         (recipient opens Kasa, sees the problem, gets hooked)
```

## 21.2 Report a Problem

```
[Tap ✚ Report]
    │
    ▼
[Compose screen — single scrollable page]
    │
    ├── Type description → AI suggests category
    ├── Confirm or change category
    ├── Set location (GPS / map / type)
    ├── Upload evidence (photo / doc)
    │    └── GPS match check runs automatically
    ├── Review everything
    │
    ▼
[Tap "Post Report"]
    │
    ├── Duplicate check → similar problems found?
    │    ├── Yes → "Join existing report" (adds as upvote)
    │    └── No / different → submit as new
    │
    ▼
[Submitted — status: PENDING_VERIFICATION]
    │
    ▼
[Nearby users notified for verification]
    │
    ├── 3+ confirm within 24h → COMMUNITY_VERIFIED → visible in feed
    └── Not enough → REVIEW_NEEDED → admin queue
```

## 21.3 Official Response

```
[Official opens dashboard]
    │
    ▼
[Sees problems sorted by severity, "Needs Response" tab]
    │
    ▼
[Taps "Respond" on a problem]
    │
    ├── Selects status: Acknowledged / In Progress / Resolved / Referred
    ├── Writes response
    ├── Attaches evidence (required if claiming resolved)
    │
    ▼
[Posts response]
    │
    ├── Problem status updated
    ├── Timeline event created
    ├── All reporters + upvoters notified
    ├── Accountability score recalculated
    │
    ├── If status = Resolved:
    │    ├── Resolution vote opens (7 days)
    │    ├── Reporters/upvoters vote
    │    ├── ≥70% Yes → RESOLVED_CONFIRMED
    │    └── <70% Yes → Denied, problem stays open, false claim flagged
    │
    └── Score updates live on public dashboard
```

## 21.4 Viral Loop — WhatsApp Sharing

```
[User reports a problem]
    │
    ▼
[Taps Share → WhatsApp]
    │
    ▼
[Sends link to group chat: "Look at this pothole! 347 people affected"]
    │
    ▼
[10 friends tap the link]
    │
    ├── See the problem on Kasa (no login needed)
    ├── See the accountability score
    ├── Try to upvote → prompted to sign up
    │
    ▼
[New users join, upvote, report their own problems]
    │
    ▼
[Cycle repeats — organic growth via WhatsApp]
```

---

# 22. Design System

## 22.1 Colour Palette

### Primary

| Name | Hex | Usage |
|------|-----|-------|
| Kasa Deep Green | `#1B4332` | Top bar, nav background, primary headers |
| Kasa Forest | `#2D6A4F` | Secondary headings, active nav items |
| Kasa Leaf | `#40916C` | Tertiary elements, links |
| Kasa Gold | `#D4A843` | Primary action buttons, Report button, upvote active, CTAs |
| Kasa Gold Light | `#F5E6B8` | Gold highlights, selected filter chips |

### Neutral

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#F5F5F5` | Page background (not pure white — easier on eyes) |
| Card Surface | `#FFFFFF` | Card backgrounds |
| Divider | `#E5E5E5` | Lines between cards, section dividers |
| Text Primary | `#1A1A1A` | Main body text |
| Text Secondary | `#666666` | Timestamps, secondary info, location |
| Text Muted | `#999999` | Placeholders, disabled states |
| Text on Dark | `#FFFFFF` | Text on dark backgrounds |

### Status

| Name | Hex | Usage |
|------|-----|-------|
| Verified Green | `#2E7D32` | Verification badges, resolved status, "Yes" votes |
| Warning Yellow | `#F9A825` | Pending states, warnings, caution |
| Danger Red | `#C62828` | High severity, errors, "No" votes, low scores |
| Official Blue | `#1565C0` | Official badges, acknowledged status |
| Business Purple | `#6A1B9A` | Business solution badges |
| Trending Orange | `#E65100` | Trending indicators, fire icons |

### Severity Scale

| Score | Colour | Hex |
|-------|--------|-----|
| 0–29 | Green | `#4CAF50` |
| 30–59 | Yellow | `#FFC107` |
| 60–79 | Orange | `#FF9800` |
| 80–100 | Red | `#F44336` |

## 22.2 Typography

**Font:** Inter (Google Fonts) — clean, modern, excellent mobile readability.
**Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif.

| Element | Size | Weight | Colour |
|---------|------|--------|--------|
| App name "KASA" | 20px | 800 (Extra Bold) | Kasa Deep Green |
| Screen titles | 22px | 700 (Bold) | Text Primary |
| Section headers | 16px | 700 (Bold) | Text Primary |
| Card poster name | 15px | 600 (Semi-bold) | Text Primary |
| Card description | 15px | 400 (Regular) | Text Primary |
| Category chips | 13px | 500 (Medium) | varies |
| Action bar text | 13px | 500 (Medium) | Text Secondary |
| Timestamps | 13px | 400 (Regular) | Text Muted |
| Badge text | 11px | 600 (Semi-bold) | White or varies |
| Button text (primary) | 16px | 600 (Semi-bold) | Text Primary on gold |

## 22.3 Spacing

Base unit: **4px.** All spacing is a multiple of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Between icon and label |
| `space-sm` | 8px | Padding inside chips, badges |
| `space-md` | 12px | Inside cards (compact padding) |
| `space-lg` | 16px | Between elements within a card |
| `space-xl` | 24px | Between cards in the feed |
| `space-2xl` | 32px | Section spacing |
| `space-3xl` | 48px | Top-of-page spacing |

## 22.4 Border Radius

| Element | Radius |
|---------|--------|
| Cards | 16px |
| Buttons (primary) | 12px |
| Chips / badges | 20px (fully rounded) |
| Avatars | 50% (circle) |
| Photo evidence | 12px |
| Input fields | 8px |
| Bottom sheet modals | 24px (top corners only) |

## 22.5 Shadows

| Level | Shadow | Usage |
|-------|--------|-------|
| Level 1 | `0 1px 3px rgba(0,0,0,0.08)` | Cards, chips |
| Level 2 | `0 4px 12px rgba(0,0,0,0.12)` | Floating buttons, modals |
| Level 3 | `0 8px 24px rgba(0,0,0,0.16)` | Bottom sheets, overlays |

## 22.6 Animation & Motion

| Interaction | Animation |
|------------|-----------|
| Upvote tap | Bounce scale (1.0 → 1.3 → 1.0) over 300ms + icon colour change to gold |
| Card enter feed | Fade in + slide up (200ms) |
| New problem banner | Slide down from top (300ms) |
| Bottom sheet open | Slide up with spring easing (400ms) |
| Pull to refresh | Spinner rotation in Kasa Gold |
| Severity badge pulse | Subtle scale pulse (1.0 → 1.05 → 1.0) every 2s for severity > 80 |
| Status change | Colour cross-fade (300ms) |
| Toast appear | Slide up from bottom, auto-dismiss after 3s with fade out |

## 22.7 Iconography

**Primary icon set:** Lucide Icons (open source, consistent line style, 24px default).

**Category icons:** Custom or emoji-based (see Section 4.2 filter chips). Used consistently everywhere a category appears.

## 22.8 Responsive Breakpoints

| Breakpoint | Layout | Nav |
|-----------|--------|-----|
| < 640px (phone) | Single column, full-width cards, stacked sections | Bottom nav bar |
| 640–1024px (tablet) | Single column with wider cards (max-width 600px, centred) | Bottom nav bar |
| > 1024px (desktop) | Three-column: left sidebar nav, centre feed (max-width 600px), right sidebar (trending + scores) | Left sidebar replaces bottom nav |

---

> **END OF UI SPECIFICATION v2.0**
>
> *Kasa UI Architecture — Mobile-First, Feed-Centric, Social-Media-Inspired*
> *Version 2.0 — March 2026*
> *Companion to the Kasa Product Requirements Document*
