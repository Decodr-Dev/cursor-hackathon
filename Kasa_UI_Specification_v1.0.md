# KASA — UI Architecture & Screen Specification

## Complete Guide to Every Screen, Section, Flow & Process

**Version 1.0 | March 2026**

---

## Table of Contents

1. [Navigation Structure](#1-navigation-structure)
2. [Onboarding & Authentication Screens](#2-onboarding--authentication-screens)
3. [The Problem Feed (Home)](#3-the-problem-feed-home)
4. [Post a Problem Flow](#4-post-a-problem-flow)
5. [Problem Detail Screen](#5-problem-detail-screen)
6. [Resolution Timeline](#6-resolution-timeline)
7. [Submit a Solution Flow](#7-submit-a-solution-flow)
8. [Community Verification Flow](#8-community-verification-flow)
9. [Resolution Verification Flow](#9-resolution-verification-flow)
10. [Citizen Dashboard (My Kasa)](#10-citizen-dashboard-my-kasa)
11. [Verified Official Dashboard](#11-verified-official-dashboard)
12. [Verified Business Dashboard](#12-verified-business-dashboard)
13. [Public Accountability Dashboard](#13-public-accountability-dashboard)
14. [Settings & Profile](#14-settings--profile)
15. [Admin Panel](#15-admin-panel)
16. [Notification Centre](#16-notification-centre)
17. [Search & Discovery](#17-search--discovery)
18. [Reusable UI Components](#18-reusable-ui-components)
19. [User Flow Diagrams](#19-user-flow-diagrams)
20. [Mobile-First Design Principles](#20-mobile-first-design-principles)

---

# 1. Navigation Structure

## 1.1 Mobile Bottom Navigation Bar (Primary — visible on all screens)

The bottom nav is always visible and has 5 tabs:

| Tab | Icon | Label | Goes To |
|-----|------|-------|---------|
| 1 | 🏠 Home icon | Feed | The Problem Feed (main home screen) |
| 2 | 🔍 Search icon | Explore | Search & Discovery screen |
| 3 | ➕ Plus icon (larger, centre, accent colour) | Report | Post a Problem flow |
| 4 | 📊 Chart icon | Scores | Public Accountability Dashboard |
| 5 | 👤 Person icon | Me | Citizen Dashboard / Profile |

The centre "Report" button is larger and uses the Kasa gold accent colour to draw attention — this is the primary action of the platform.

## 1.2 Top Bar (Persistent)

On every screen, the top bar contains:

- **Left:** Kasa logo (small) + current screen title
- **Centre:** Location pill showing the user's current feed location (e.g. "Accra Metro" or "National"). Tappable to change location.
- **Right:** Notification bell icon with unread count badge

## 1.3 Official Dashboard Navigation (Different Layout)

Verified Officials see a **sidebar navigation** on desktop and a **hamburger menu** on mobile with:

- Jurisdiction Feed (problems in their area)
- My Responses
- Accountability Score
- Constituency Analytics
- Notifications
- Settings

## 1.4 Business Dashboard Navigation

Verified Businesses see:

- Relevant Problems (matching their categories)
- My Solutions
- Advertising Campaigns
- Analytics
- Notifications
- Settings

## 1.5 Admin Panel Navigation

Platform Administrators see a full sidebar:

- Dashboard Overview
- Moderation Queue
- Flagged Reports
- User Management
- Verification Queue
- Business Ad Approvals
- Data Intelligence Export
- System Settings

---

# 2. Onboarding & Authentication Screens

## 2.1 Splash / Welcome Screen

**What the user sees:**

- Kasa logo (large, centred)
- Tagline: "Speak. Be Heard. Get Solutions."
- A brief 3-step carousel explaining the platform:
  - Slide 1: "Report any problem affecting your community" (illustration of someone taking a photo of a pothole)
  - Slide 2: "Get solutions from neighbours, businesses, and government" (illustration of different people responding)
  - Slide 3: "Hold officials accountable with live public scores" (illustration of the accountability dashboard)
- Two buttons at the bottom:
  - **"Get Started"** (primary button, gold accent)
  - **"View Public Dashboard"** (secondary/text link — no account needed)
- Language selector at the very top: EN | TWI | GA | EWE | DAG

**Technical:** This screen shows only on first launch. After first visit, it goes straight to the login screen. The "View Public Dashboard" link goes to `/dashboard` which requires no authentication.

## 2.2 Registration Screen

**Step 1 — Choose Verification Method**

- Screen title: "Create Your Account"
- Two large card buttons:
  - **"Verify with Ghana Card"** (recommended badge) — icon of Ghana Card
  - **"Verify with Phone Number"** — icon of a phone
- Small text below: "You need to verify your identity to post problems and solutions. This keeps Kasa trustworthy."

**Step 2a — Ghana Card Verification**

- Input field: "Enter your Ghana Card number" with format hint `GHA-XXXXXXXXX-X`
- Input field: "Full name (as it appears on your card)"
- Input field: "Date of birth"
- A "Verify" button
- Loading state: "Checking with the National Identification Authority…" (spinner animation)
- **Success state:** Green checkmark. "Your identity is verified! Let's set up your profile."
- **Failure state:** Red message. "We couldn't verify this Ghana Card number. Please double-check and try again, or use phone verification instead."

**Step 2b — Phone Number Verification**

- Input field: "Enter your phone number" with Ghana country code +233 pre-filled
- "Send OTP" button
- Next screen: 6-digit OTP input with countdown timer (5 minutes)
- "Resend code" link (greyed out until timer expires)
- **Success state:** Green checkmark. "Phone verified!"
- **Failure state:** "Invalid code. Please try again."

**Step 3 — Profile Setup**

- Input: Display name (first name + last initial auto-filled from Ghana Card if available)
- Dropdown: Primary region
- Dropdown: Primary district (filtered by selected region)
- Dropdown: Preferred language (English, Twi, Ga, Ewe, Dagbani)
- Multi-select: "What problem categories interest you most?" (used to personalise the feed)
  - Roads & Transport
  - Water & Sanitation
  - Electricity & Power
  - Healthcare
  - Education
  - Security & Safety
  - Government Services
  - Employment & Jobs
  - Environment
  - Housing
  - Corruption & Fraud
  - Digital & Telecom
- Optional: Profile photo upload
- "Complete Registration" button

**Step 4 — Confirmation**

- Success screen: "Welcome to Kasa! You're ready to speak."
- Brief tooltip tour highlighting: the Feed, the Report button, and the Scores tab
- "Explore the Feed" button takes them to the home screen

## 2.3 Login Screen

- Input: Phone number or email
- Input: Password
- "Log In" button
- "Forgot password?" link
- "Don't have an account? Sign up" link
- Social login options (Google) — optional for Phase 2

---

# 3. The Problem Feed (Home)

## 3.1 Screen Layout

This is the main screen users land on after login. It is a scrollable vertical list of problem cards.

**Top section (sticky):**

- Location pill: Shows current feed location (e.g. "Accra Metro"). Tap to change.
- Filter bar: Horizontal scrollable row of filter chips:
  - All Categories | Roads | Water | Health | Education | Security | *(etc. — all categories)*
  - Tapping a category chip filters the feed instantly
- Sort dropdown (right side): "Most Upvoted" | "Most Recent" | "Most Severe"
- Status filter tabs: "All" | "Unresolved" | "In Progress" | "Resolved"

**Feed body:**

- Vertical scrolling list of Problem Cards (see Component spec in Section 18)
- Infinite scroll — loads 20 problems at a time
- Pull-to-refresh gesture

**Empty states:**

- If no problems in the selected filters: "No problems matching your filters. Try broadening your search or switch to the National feed."
- If the platform is brand new: "Be the first to report a problem in your area! Tap the + button below."

## 3.2 Location Picker (Modal)

When the user taps the location pill, a bottom sheet modal slides up:

- "Your Location" section: Shows user's verified district (default)
- "Browse by Region" section: List of all 16 Ghana regions, each expandable to show districts
- "National" option at the top to see all problems across Ghana
- Search bar at the top to type a district or region name
- Selecting a location closes the modal and refreshes the feed

## 3.3 Feed Behaviour

- **Default:** Shows problems from the user's verified district, sorted by a blend of recency and severity
- **Real-time updates:** New problems appear at the top with a subtle "New problem reported" banner. Tapping the banner scrolls to the top.
- **Upvote animation:** When user taps upvote, the count increments with a subtle bounce animation and the arrow turns gold
- **Problem status badges** are colour-coded:
  - 🟡 Yellow: Pending Verification
  - 🟢 Green: Community Verified
  - 🔵 Blue: Officially Acknowledged
  - 🟣 Purple: In Progress
  - ✅ Green checkmark: Resolved
  - 🔴 Red: High Severity (score > 75)

---

# 4. Post a Problem Flow

This is the most important user flow on the platform. It must be simple enough for someone who has never used a reporting app before.

## 4.1 Step 1 — What's the problem? (Description)

**Screen title:** "Report a Problem"

- Large text area: "Describe the problem…" (placeholder text: "E.g. The main road to Madina market has had a huge pothole for 3 months. Cars swerve into oncoming traffic to avoid it. Multiple accidents have happened here.")
- Character counter: 0 / 2000
- Language indicator: Auto-detected language badge appears as user types (e.g. "Writing in: Twi")
- **AI suggestion area:** As user types, a suggestion card slides in below the text area:
  - "Suggested category: **Roads & Transport > Pothole**"
  - Two buttons: "✓ Accept" | "✗ Choose Different"
  - If confidence is low: "Not sure about the category? Choose manually below."
- "Next" button (disabled until at least 50 characters typed)

## 4.2 Step 2 — Category Selection

**Screen title:** "What type of problem is this?"

- If AI suggestion was accepted in Step 1, this step is pre-filled and the user can skip ahead
- If not, show a list of categories with icons:
  - 🛣️ Roads & Transport
  - 💧 Water & Sanitation
  - ⚡ Electricity & Power
  - 🏥 Healthcare
  - 🎓 Education
  - 🛡️ Security & Safety
  - 🏛️ Government Services
  - 💼 Employment & Jobs
  - 🌿 Environment
  - 🏠 Housing
  - 🚨 Corruption & Fraud
  - 📱 Digital & Telecom
- On selecting a category, subcategories slide in below:
  - E.g. Roads & Transport → Pothole | Road Blocked | Traffic Light Broken | Flooding on Road | Bridge Damaged | No Street Lights | Other
- "Next" button

## 4.3 Step 3 — Location

**Screen title:** "Where is this problem?"

- **Option A — Use current location:** Big button: "📍 I'm here now — use my GPS location." Tapping this requests location permission, captures GPS coordinates, and shows the location on a small embedded map with a pin. User can drag the pin to adjust.
- **Option B — Choose on map:** Interactive map (Mapbox/Leaflet) where user can tap to drop a pin. Map starts at user's registered district.
- **Option C — Type address:** Text input for manually typing the area/landmark. Autocomplete suggests known areas.
- Below the map: auto-filled text showing "Region: Greater Accra | District: Accra Metro | Area: Madina" based on the pin location.
- "Next" button

## 4.4 Step 4 — Evidence

**Screen title:** "Add Evidence"

- Explanation text: "Upload at least one piece of evidence so your report can be verified."
- **For physical problems** (auto-detected from category):
  - "📸 Take a Photo" button — opens camera directly
  - "🖼️ Upload from Gallery" button
  - After upload: thumbnail preview with GPS match indicator:
    - ✅ "Photo location matches" (green)
    - ⚠️ "Photo was taken 2km from stated location. Is this correct?" (yellow warning with "Yes, it's correct" / "Retake photo" options)
    - ❌ "Photo location doesn't match (>5km away). Please take a new photo at the location." (red, blocks submission)
- **For non-physical problems** (fraud, policy, jobs, etc.):
  - "📄 Upload Document" button — accepts PDF, DOC
  - "📱 Upload Screenshot" button — accepts PNG, JPEG
  - "📎 Upload File" — any supported format
- Upload progress bar for each file
- Up to 5 files can be attached
- "Next" button (disabled until at least 1 evidence file uploaded)

## 4.5 Step 5 — Review & Submit

**Screen title:** "Review Your Report"

- Summary card showing:
  - **Description:** (full text, editable — tap to go back to step 1)
  - **Category:** Roads & Transport > Pothole (editable — tap to go back)
  - **Location:** Madina, Accra Metro, Greater Accra (editable — tap to go back) + small map
  - **Evidence:** Thumbnail(s) of uploaded files
  - **Language:** English (auto-detected)
- **Duplicate check section:** If AI found similar problems:
  - Yellow card: "⚠️ Similar reports found:"
  - List of 1–3 similar problems with title preview and upvote count
  - "This is the same problem — join the existing report" button (merges as upvote)
  - "My problem is different — submit anyway" button (posts as new with link to related)
- **Disclaimer text:** "Your report will enter a 24-hour verification period. Verified users near this location will be asked to confirm it."
- **"Submit Report"** button (large, gold accent)

## 4.6 Step 6 — Confirmation

- Success screen with animation (checkmark or confetti)
- "Your problem has been submitted! 🎉"
- "It's now in the verification queue. We'll notify you when local users confirm it."
- Problem card preview showing their new post with "⏳ Pending Verification" status
- Two buttons:
  - "View My Report" — goes to the Problem Detail screen
  - "Report Another Problem" — goes back to Step 1
  - "Back to Feed" — goes to home

---

# 5. Problem Detail Screen

This is the full view of a single problem. It's the most information-dense screen on the platform.

## 5.1 Layout (Top to Bottom)

**Header section:**

- Back arrow (returns to feed)
- Share button (share link via WhatsApp, Twitter, copy link)
- Bookmark/save button

**Problem status banner (full width, colour-coded):**

- "⏳ Pending Verification" (yellow) OR
- "✅ Community Verified" (green) OR
- "📢 Officially Acknowledged" (blue) OR
- "🔧 In Progress" (purple) OR
- "✅ Resolved" (green with checkmark) OR
- "🔴 High Severity — Media Verification Requested" (red)

**Problem info section:**

- Category badge: "🛣️ Roads & Transport > Pothole"
- Location: "📍 Madina, Accra Metro, Greater Accra"
- Posted by: "Kwame A." with verification badge + time ago ("3 days ago")
- Severity score badge (if community verified): coloured circle with number (e.g. "72" in orange)

**Description:**

- Full problem description text
- Language indicator: "Originally posted in Twi — Translated to English" (with toggle to view original)

**Evidence gallery:**

- Horizontal scrollable row of photo thumbnails
- Tap to view full-screen with pinch-to-zoom
- Document files shown as file icons with filename

**Stats bar (horizontal row):**

- 👆 "347 Upvotes" (tappable to upvote)
- 💬 "12 Solutions" (tappable to scroll to solutions section)
- 📊 "Severity: 72/100"
- 📅 "Open for 34 days"

**Cost of inaction card (if severity >= 60):**

- "💰 Estimated daily cost of this problem: GHS 15,240"
- Small text: "Based on 500 affected commuters losing 45 min/day"
- "Updated weekly"

**Upvote button (large, sticky at bottom or in stats bar):**

- "👆 I Have This Problem Too" — tapping adds an upvote
- After upvoting: changes to "✅ You upvoted this" (gold, tapping again removes)

## 5.2 Tabs Below the Problem Info

Three tabs to organise the content below:

### Tab 1: Solutions

- **Official Responses** (shown first, highlighted with blue badge and government icon):
  - Official's name, title, jurisdiction
  - Response text
  - Status update: "Status changed to: In Progress"
  - Timestamp
  - Community rating: 👍 45 👎 12
  
- **Business Solutions** (labelled "Sponsored" if paid, "Business Solution" if organic):
  - Business name with verified badge
  - Solution description
  - Product/service name
  - Contact info
  - Community rating: 👍 23 👎 5
  
- **Peer Solutions** (from fellow citizens):
  - User name with verification badge (and expert badge if applicable)
  - Solution text
  - Community rating: 👍 67 👎 3
  - "Verified Expert in Civil Engineering" badge (if applicable)

- **"Submit a Solution"** button at bottom of tab

### Tab 2: Timeline

- See [Section 6 — Resolution Timeline](#6-resolution-timeline) for full specification

### Tab 3: Verification

- Community verification status: "Verified by 5 local users" or "Awaiting verification — 1 of 3 needed"
- List of verification votes (anonymous): "✅ Confirmed | ✅ Confirmed | ❓ Unknown | ✅ Confirmed"
- If pending: "Know this area? Help verify this report" with Yes / No / Don't Know buttons (only shown to eligible nearby users)

---

# 6. Resolution Timeline

## 6.1 Layout

The timeline is a vertical sequence of events displayed as a connected series of nodes and lines, like a delivery tracking screen.

Each event shows:

- **Dot/node** on the left (colour-coded by event type)
- **Event title** (bold)
- **Event description** (normal text)
- **Timestamp** (grey, small)
- **Actor** (who triggered this event, if applicable)

## 6.2 Event Types and Visual Treatment

| Event | Node Colour | Icon | Example Display |
|-------|------------|------|----------------|
| First Reported | Grey | 📝 | "Reported by Kwame A. — Mar 15, 2026, 9:32 AM" |
| Evidence Added | Grey | 📎 | "2 additional photos added by Ama K." |
| Community Verified | Green | ✅ | "Verified by 5 local users — Mar 15, 2026, 4:18 PM" |
| Upvote Milestone | Gold | 👆 | "Reached 100 upvotes — Mar 17, 2026" |
| Officially Acknowledged | Blue | 🏛️ | "Acknowledged by Accra Metro Assembly — Mar 18, 2026. Response: 'We are aware of this issue and have dispatched a team.'" |
| Official Update | Blue | 📢 | "Status changed to: In Progress — Mar 22, 2026. 'Repair crew has been scheduled for next week.'" |
| Peer Solution Added | Teal | 💡 | "Solution posted by Kofi M. — Rated 89% helpful" |
| Business Solution Added | Purple | 🏢 | "Business solution posted by RoadFix Ltd." |
| Severity Escalated | Orange | ⚠️ | "Severity crossed 75 — Media verification requested" |
| Media Verification | Red | 📰 | "Verified by Joy FM News — Mar 25, 2026" |
| Resolution Claimed | Yellow | 🎯 | "Resolution claimed by Accra Metro Assembly — Mar 28, 2026" |
| Resolution Confirmed | Green | 🎉 | "Resolved! Confirmed by 84% of reporters — Apr 4, 2026" |
| Resolution Denied | Red | ❌ | "Resolution claim rejected — 72% said NOT resolved" |

## 6.3 Current Status Indicator

At the top of the timeline, a prominent status bar shows the current state:

- "⏳ Open for 34 days | Last activity: 2 hours ago"
- OR "✅ Resolved in 20 days | Confirmed by 84% of reporters"

---

# 7. Submit a Solution Flow

## 7.1 For Peer Solutions

**Triggered by:** Tapping "Submit a Solution" on the Problem Detail screen.

**Screen 1 — Write Your Solution:**

- Screen title: "Share Your Solution"
- Problem title shown at top (for context)
- Text area: "Describe what worked for you…" (max 1500 characters)
- Optional: "📎 Attach evidence" (photo or document showing the solution worked)
- "Submit Solution" button

**Screen 2 — Confirmation:**

- "Your solution has been posted! The community will rate how helpful it is."
- Shows the solution as it will appear in the thread

## 7.2 For Official Responses

**Triggered by:** Official taps "Respond" on a problem from their jurisdiction dashboard.

**Screen 1 — Official Response:**

- Problem title + severity score shown at top
- Status update dropdown: "Acknowledged" | "In Progress" | "Resolved" | "Referred to [other entity]"
- Text area: "Your official response…"
- Optional: "📎 Attach evidence of action taken"
- If selecting "Resolved": additional section:
  - "📸 Upload before/after photo" (required for physical problems)
  - Warning: "Resolution claims are verified by the community. False claims are flagged publicly."
- "Post Official Response" button

## 7.3 For Business Solutions

**Triggered by:** Business taps "Post Solution" on a relevant problem thread.

**Screen 1 — Business Solution:**

- Problem title shown at top
- Input: Product/service name
- Text area: "How does your product/service solve this problem?"
- Input: Pricing info (optional)
- Input: Contact information
- Input: Website URL (optional)
- Checkbox: "I confirm this is a genuine business solution relevant to this problem"
- Note: "Your solution will be labelled as a 'Business Solution'"
- "Post Business Solution" button

---

# 8. Community Verification Flow

## 8.1 How the User Encounters It

A verified user near a newly reported problem receives a notification (in-app, SMS, or WhatsApp):

> "A new problem has been reported near you: 'Broken water pipe on Spintex Road.' Can you confirm this? Tap to verify."

## 8.2 Verification Screen

**Tapping the notification opens:**

- Problem summary card (description, photo thumbnail, location on small map)
- Distance indicator: "📍 This was reported 1.2km from your location"
- Three large buttons stacked vertically:
  - **"✅ Yes, I can confirm this problem exists"** (green)
  - **"❌ No, this problem does not exist"** (red)
  - **"🤷 I don't know / Haven't seen it"** (grey)
- Optional text input: "Add a comment (optional)" — e.g. "Yes, I pass this every day, it's been there for months"
- Optional: "📸 Add your own photo" for additional evidence

## 8.3 After Voting

- "Thank you! Your verification helps keep Kasa trustworthy."
- Shows current verification progress: "2 of 3 confirmations received"
- "View this problem" link to the Problem Detail screen

---

# 9. Resolution Verification Flow

## 9.1 How the User Encounters It

When a resolution is claimed on a problem the user reported or upvoted, they receive a notification:

> "Accra Metro Assembly says the pothole on Madina Road has been fixed. Did this solve your problem? Vote now."

## 9.2 Resolution Vote Screen

- **Resolution claim summary:**
  - Who claimed it: "Accra Metro Assembly"
  - What they said: "The pothole has been repaired by our maintenance team."
  - Evidence: Before/after photos (tappable to view full-screen)
  - Date claimed: "March 28, 2026"

- **Voting section:**
  - "Did this resolve your problem?"
  - Two large buttons:
    - **"✅ Yes, it's fixed!"** (green)
    - **"❌ No, it's NOT fixed"** (red)
  - Optional text: "Add a comment" — e.g. "They only patched half of it, the rest is still broken"
  - Optional: "📸 Upload a current photo" to prove it's not actually fixed

- **Voting progress bar:** "23 of 45 people have voted | 6 days remaining"

## 9.3 After Voting

- "Thanks for your vote! We'll notify you of the final result."
- If voting closes with >= 70% Yes: "🎉 This problem has been confirmed resolved!"
- If voting closes with < 70% Yes: "This resolution claim was rejected. The problem remains open."

---

# 10. Citizen Dashboard (My Kasa)

## 10.1 Layout

Accessed via the "Me" tab in bottom navigation.

**Profile header:**

- Profile photo (or default avatar)
- Display name with verification badge
- Joined date
- Stats row: "12 Reports | 45 Upvotes Given | 3 Solutions Posted"

**Dashboard sections (stacked cards):**

### My Reports

- List of all problems the user has posted
- Each shows: title, status badge, upvote count, last activity date
- Filter tabs: "All" | "Open" | "Resolved"
- Tap to go to Problem Detail

### My Upvotes

- List of problems the user has upvoted
- Same display as My Reports
- Useful for tracking problems they care about

### My Solutions

- List of solutions the user has posted
- Shows: problem title, solution preview, helpfulness rating (👍 67 👎 3)

### Pending Actions

- **Verification requests:** "2 problems near you need verification" — with direct links
- **Resolution votes:** "1 resolution claim needs your vote" — with direct link
- These are highlighted with a gold accent to draw attention

### My Impact

- "Your reports have received 1,234 total upvotes"
- "3 of your 12 reports have been resolved"
- "Your solutions have been rated helpful by 89% of users"

---

# 11. Verified Official Dashboard

## 11.1 Overview (Landing Screen)

This is a separate experience from the citizen app. Officials see this when they log in.

**Top summary cards (4 cards in a row on desktop, stacked on mobile):**

| Card | Content |
|------|---------|
| Total Problems | Number of open problems in jurisdiction, with trend arrow (↑12% this week) |
| Acknowledgement Rate | Percentage + colour indicator (green if > 70%, yellow 40-70%, red < 40%) |
| Resolution Rate | Percentage + colour indicator |
| Avg Resolution Time | Days + colour indicator (green if < 30, yellow 30-60, red > 60) |

**Accountability Score (prominent):**

- Large circular gauge showing score out of 100 (colour-coded)
- "Your rank: #23 of 261 district assemblies"
- Trend: "↑ 4 points from last month"
- Link: "See how you compare" → goes to the public ranking

## 11.2 Jurisdiction Problem Feed

- Same layout as the citizen problem feed but filtered to the official's jurisdiction only
- Additional sort option: "Awaiting My Response" (shows problems with no official response yet, sorted by severity)
- Each problem card has a prominent **"Respond"** button
- **Priority indicators:**
  - 🔴 Red border: Severity > 75, needs immediate attention
  - 🟡 Yellow border: Multiple reports, growing fast
  - Blue border: Has been open > 30 days with no official response

## 11.3 My Responses

- List of all problems the official has responded to
- Shows: problem title, response date, current status, community rating of response
- Filter: "Acknowledged" | "In Progress" | "Resolved" | "Referred"

## 11.4 Constituency Analytics

- **Problems by Category:** Bar chart showing which categories have the most reports in their area
- **Trend Over Time:** Line chart showing total problems reported per week for the last 3 months
- **Resolution Funnel:** Visual funnel showing Reported → Acknowledged → In Progress → Resolved (with drop-off percentages)
- **Hotspot Map:** Map of the jurisdiction with heat map overlay showing where problems are concentrated
- **Comparison:** Side-by-side comparison with national averages

---

# 12. Verified Business Dashboard

## 12.1 Overview Screen

**Top summary cards:**

| Card | Content |
|------|---------|
| Relevant Problems | Problems matching business categories in target regions |
| Solutions Posted | Total business solutions posted |
| Solution Rating | Average helpfulness rating across all solutions |
| Active Campaigns | Number of running ad campaigns |

## 12.2 Relevant Problem Feed

- Problem feed filtered to categories matching the business's registered product/service categories
- Filtered by the business's target regions
- Each card shows: problem title, category, location, severity, upvote count
- **"Post Solution"** button on each card
- **"Boost This"** button to create an ad campaign targeting this problem thread

## 12.3 My Solutions

- List of all business solutions posted
- Shows: problem title, solution name, community rating, views/impressions
- Analytics per solution: helpful votes, clicks on contact info

## 12.4 Advertising Campaigns

- List of active, paused, and completed campaigns
- Each shows: target categories, target regions, daily spend, impressions, clicks, CTR
- **"Create Campaign"** button → Campaign creation flow:
  1. Select target categories
  2. Select target regions
  3. Set daily budget (GHS)
  4. Set bid per impression or per click
  5. Set date range
  6. Upload ad creative (or use auto-generated from business solution)
  7. Review and launch
- Campaign analytics: impressions, clicks, cost, conversions

## 12.5 Category Alerts

- Configuration screen where the business selects which problem categories and regions to monitor
- When a spike is detected, they receive an alert with: category, region, percentage increase, number of new reports
- "View trending problems" link goes to the filtered feed

---

# 13. Public Accountability Dashboard

## 13.1 Access

This is accessible at `kasa.com/dashboard` — **no login required**. Anyone in the world can view it.

## 13.2 Layout (Top to Bottom)

**Hero section:**

- Title: "Ghana's Civic Health Dashboard"
- Subtitle: "Real-time accountability scores for every public official and entity"
- Key stats bar:
  - "X open problems | Y resolved this month | Z officials on platform"
  - "Total estimated cost of inaction: GHS X,XXX,XXX"

**Section 1 — National Map**

- Full-width interactive map of Ghana
- All open problems shown as dots, colour-coded by severity:
  - 🟢 Green dot: severity < 30
  - 🟡 Yellow dot: severity 30–60
  - 🟠 Orange dot: severity 60–80
  - 🔴 Red dot: severity > 80
- Tap/click a dot to see a popup with problem title, category, severity, upvotes
- Tap popup to go to Problem Detail page
- Zoom in to see district-level clusters
- Region boundaries drawn on the map
- Heat map toggle: switch between individual dots and heat map overlay

**Section 2 — Official Rankings**

- Table/list of all verified officials ranked by accountability score (highest first)
- Columns: Rank | Name/Entity | Jurisdiction | Score (/100) | Acknowledgement Rate | Resolution Rate | Avg Resolution Time
- Search bar to find a specific official
- Filter by: Region | Entity Type (MP, District Assembly, Agency, Utility)
- Tap any row to see the official's full profile page

**Section 3 — Top 10 Most Severe Unresolved Problems**

- List of the 10 highest-severity open problems nationally
- Each shows: severity score, title, category, location, days open, upvote count
- Updated in real time
- Tap to go to Problem Detail

**Section 4 — Category Breakdown**

- Horizontal bar chart showing all categories ranked by total open problems
- For each category: total problems | resolution rate | average days to resolve
- The categories with the LOWEST resolution rates are highlighted in red

**Section 5 — Trending This Week**

- Cards showing which problem categories have grown the most in the last 7 days
- Each card: category name, percentage increase, number of new reports, top affected region
- E.g. "⬆️ Water & Sanitation +340% this week — 89 new reports, mostly in Northern Region"

**Section 6 — Cost of Inaction**

- Large display number: "Estimated combined daily cost of all unresolved high-severity problems: **GHS 2,456,000**"
- Breakdown by category (pie chart or bar chart)
- Breakdown by region

---

# 14. Settings & Profile

## 14.1 Settings Screen

Accessed from profile/dashboard screen via gear icon.

**Sections:**

### Account
- Edit display name
- Change phone number (requires re-verification)
- Change password
- Link/verify Ghana Card (if registered via phone)
- Delete account (with confirmation and data export option)

### Notifications
- Toggle on/off per notification type:
  - Problem updates (responses, status changes)
  - Verification requests
  - Resolution votes
  - Category alerts
- Toggle per channel:
  - In-app notifications: ON/OFF
  - SMS: ON/OFF
  - WhatsApp: ON/OFF
  - Email: ON/OFF (if email provided)

### Language
- Preferred display language: English | Twi | Ga | Ewe | Dagbani
- Changing this translates the entire UI and future problem posts shown to the user

### Location
- Primary location (district, region) — editable
- Additional addresses (for diaspora users to post about other locations)
- Manage addresses: add/remove

### Privacy
- Display name visibility: "Show my name as Kwame A." (default) or "Show as Anonymous"
- Data export: "Download all my data" — generates a ZIP with all reports, votes, and account data
- Data deletion: "Delete all my data and close my account"

### About
- App version
- Terms of service
- Privacy policy
- Contact support
- Licenses

---

# 15. Admin Panel

## 15.1 Dashboard Overview

**Key metrics cards:**

- Total users (with growth trend)
- Total problems (open vs resolved)
- Problems pending moderation
- Reports flagged by AI
- Active verified officials
- Active verified businesses
- Revenue summary (ads + subscriptions)

## 15.2 Moderation Queue

- List of problems flagged by AI or reported by users
- Each item shows: problem title, flag reason, AI confidence score, reporter info
- Actions per item:
  - "Approve" — publish to feed
  - "Reject" — remove with reason (reporter notified)
  - "Request More Info" — send back to reporter
  - "Suspend Reporter" — flag the account

## 15.3 User Management

- Searchable, filterable table of all users
- Columns: Name | Role | Verification Status | Reports Posted | False Report Count | Posting Privileges | Joined
- Actions: View profile | Suspend | Ban | Reset false report count | Change role

## 15.4 Verification Queue

- Pending Ghana Card verifications (if manual review needed)
- Pending Expert credential verifications (document review)
- Pending Official account verifications (government email + manual review)
- Pending Business verifications (TIN + registration document review)

## 15.5 Ad Approval Queue

- Pending business ad campaigns
- Each shows: business name, ad creative, target categories, target regions, bid amount
- Actions: Approve | Reject (with reason) | Request Changes

## 15.6 Data Intelligence Export

- Interface to generate and download aggregated reports
- Filters: date range, region, district, category
- Export formats: CSV, JSON, PDF
- Manage API keys for subscription customers
- View subscription status and usage per customer

---

# 16. Notification Centre

## 16.1 Access

Tapping the bell icon in the top bar opens the Notification Centre.

## 16.2 Layout

- Full-screen list of all notifications, newest first
- Each notification shows:
  - Icon (colour-coded by type)
  - Title text (bold): e.g. "Accra Metro Assembly responded to your report"
  - Preview text: "Status changed to: In Progress"
  - Time ago: "2 hours ago"
  - Unread indicator: blue dot on the left
- Tap any notification to go to the relevant screen (Problem Detail, Resolution Vote, Verification, etc.)
- "Mark all as read" button at top right
- Filter tabs: "All" | "My Reports" | "Verification Requests" | "Resolution Votes"

---

# 17. Search & Discovery

## 17.1 Access

Tapping the "Explore" tab in bottom navigation.

## 17.2 Layout

**Search bar (top, prominent):**

- Placeholder: "Search problems, categories, locations…"
- Search supports: keywords, category names, district names, problem descriptions
- Results appear as a filtered problem feed below

**Below search bar (when not searching):**

### Trending Categories
- Horizontal scrollable cards showing categories with biggest growth this week
- Each card: category icon, name, "+X% this week", tap to view filtered feed

### Trending Problems
- Vertical list of top-trending problems (fastest growing upvotes in last 24 hours)

### Browse by Region
- Grid of all 16 regions with problem count badges
- Tap to see that region's feed

### Browse by Category
- Grid of all categories with icons and problem count badges
- Tap to see that category's feed (all locations)

---

# 18. Reusable UI Components

## 18.1 Problem Card

The most frequently used component on the platform. Appears in feeds, dashboards, and search results.

```
┌─────────────────────────────────────────────────┐
│ [Category Icon] Roads & Transport > Pothole      │
│                                        [Status] │
│ ─────────────────────────────────────────────── │
│ 📍 Madina, Accra Metro, Greater Accra           │
│                                                  │
│ The main road to Madina market has had a huge    │
│ pothole for 3 months. Cars swerve into oncoming  │
│ traffic to avoid it...                           │
│                                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐                     │
│ │ 📸   │ │ 📸   │ │ 📸   │  (photo thumbnails) │
│ └──────┘ └──────┘ └──────┘                      │
│                                                  │
│ 👆 347  💬 12 Solutions  📊 72  📅 34 days      │
│                                                  │
│ Posted by Kwame A. ✓  •  3 days ago             │
├─────────────────────────────────────────────────┤
│ [💰 Est. daily cost: GHS 15,240]  (if severe)   │
└─────────────────────────────────────────────────┘
```

**States:**
- Default (community verified, showing normally)
- Pending verification (yellow left border, dimmed slightly)
- High severity (red left border, severity badge prominent)
- Resolved (green left border, strikethrough-style or green overlay)

## 18.2 Solution Card

```
┌─────────────────────────────────────────────────┐
│ [Type Badge: 🏛️ Official / 💡 Peer / 🏢 Business] │
│                                                  │
│ [Avatar] Accra Metro Assembly ✓                  │
│          Official Response • 2 days ago          │
│                                                  │
│ "We have dispatched a maintenance team to repair │
│ the pothole. Expected completion: April 5."      │
│                                                  │
│ Status update: In Progress ──────────────────    │
│                                                  │
│ 👍 45  👎 12  •  "Was this helpful?"            │
└─────────────────────────────────────────────────┘
```

## 18.3 Official Score Card

```
┌─────────────────────────────────────────────────┐
│ [Avatar/Logo]  Accra Metropolitan Assembly       │
│                District Assembly  •  Greater Accra│
│                                                  │
│         ┌───────────┐                            │
│         │    67     │   ← Large score number     │
│         │  /100     │      colour-coded          │
│         └───────────┘                            │
│                                                  │
│ Acknowledgement: 78%  │  Resolution: 42%         │
│ Avg Time: 34 days     │  Rank: #23 of 261        │
│                                                  │
│ [View Full Profile →]                            │
└─────────────────────────────────────────────────┘
```

## 18.4 Timeline Event Node

```
  ●──── Community Verified
  │     Verified by 5 local users
  │     Mar 15, 2026 • 4:18 PM
  │
  ●──── Officially Acknowledged
  │     Accra Metro Assembly responded:
  │     "We are aware and have dispatched a team."
  │     Mar 18, 2026 • 11:02 AM
  │
  ◎──── Current: In Progress
        Status updated by Accra Metro Assembly
        Mar 22, 2026 • 9:15 AM
```

## 18.5 Notification Item

```
┌─────────────────────────────────────────────────┐
│ 🔵 🏛️  Accra Metro Assembly responded            │
│        to your report on "Pothole on Madina Rd"  │
│        Status: In Progress                       │
│                                     2 hours ago  │
└─────────────────────────────────────────────────┘
```

## 18.6 Verification Vote Card

```
┌─────────────────────────────────────────────────┐
│ 📍 1.2km from you                                │
│                                                  │
│ "Broken water pipe on Spintex Road flooding      │
│  the entire junction"                            │
│                                                  │
│ [📸 Photo thumbnail]                             │
│                                                  │
│ Can you confirm this problem exists?             │
│                                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐     │
│ │ ✅ Yes   │ │ ❌ No    │ │ 🤷 Don't Know│     │
│ └──────────┘ └──────────┘ └──────────────┘     │
└─────────────────────────────────────────────────┘
```

## 18.7 Category Chip

Small, rounded pill component used in filter bars:

```
[ 🛣️ Roads & Transport ]  [ 💧 Water ]  [ ⚡ Electricity ]  [ 🏥 Health ]
```

- Default state: white background, grey border
- Active/selected state: gold background, dark text
- With count badge: `[ 🛣️ Roads (1,234) ]`

## 18.8 Severity Badge

Circular badge showing the severity score:

- Score < 30: green background
- Score 30–60: yellow background
- Score 60–80: orange background
- Score > 80: red background, pulsing animation
- Always shows the number inside

## 18.9 Status Badge

Rounded rectangle with colour and icon:

- ⏳ Pending Verification — yellow bg
- ✅ Community Verified — green bg
- 📢 Acknowledged — blue bg
- 🔧 In Progress — purple bg
- ✅ Resolved — green bg with checkmark
- 🔴 High Severity — red bg

---

# 19. User Flow Diagrams

## 19.1 New User Registration Flow

```
[Open Kasa] → [Splash / Welcome Screen]
    │
    ├── [View Public Dashboard] → (no account needed)
    │
    └── [Get Started]
         │
         ├── [Verify with Ghana Card]
         │    → Enter card number
         │    → NIA verification check
         │    → ✅ Success → Profile Setup
         │    → ❌ Failure → Try again or switch to phone
         │
         └── [Verify with Phone]
              → Enter phone number
              → Receive OTP
              → Enter OTP
              → ✅ Success → Profile Setup
              → ❌ Failure → Resend / Try again
                                │
                          [Profile Setup]
                          → Set name, location, language, interests
                          → [Complete Registration]
                          → [Welcome Screen + Tooltip Tour]
                          → [Feed]
```

## 19.2 Report a Problem Flow

```
[Tap + Button on Bottom Nav]
    │
    [Step 1: Describe Problem]
    → Type description (AI suggests category as you type)
    → Accept or reject AI suggestion
    │
    [Step 2: Select Category]
    → Choose category → choose subcategory
    │
    [Step 3: Set Location]
    → Use GPS / Pick on map / Type address
    │
    [Step 4: Add Evidence]
    → Take photo or upload file
    → GPS match check runs automatically
    │
    [Step 5: Review & Submit]
    → Review all info
    → Duplicate check: similar problems shown
    │   ├── [Join existing thread] → Added as upvote → Done
    │   └── [Submit as new] → Continue
    │
    [Submission]
    → Status: PENDING_VERIFICATION
    → Nearby users notified for verification
    → Reporter sees confirmation screen
    │
    [24-hour Verification Window]
    → 3+ local users confirm → COMMUNITY_VERIFIED → Visible in feed
    → Not enough votes → REVIEW_NEEDED → Admin queue
```

## 19.3 Official Response Flow

```
[Official logs in] → [Official Dashboard]
    │
    [Sees problem in jurisdiction feed]
    → Sorted by severity, "Awaiting Response" filter
    │
    [Taps "Respond"]
    → Select status: Acknowledged / In Progress / Resolved / Referred
    → Write response text
    → Attach evidence (optional, required if claiming resolution)
    → Submit
    │
    [Response posted]
    → Problem status updated
    → Timeline event created
    → All reporters + upvoters notified
    → Official's accountability metrics recalculated
    │
    [If status = Resolved]
    → Resolution verification flow triggered
    → Reporters/upvoters vote for 7 days
    → ≥ 70% Yes → RESOLVED_CONFIRMED
    → < 70% Yes → Resolution denied, problem stays open
```

## 19.4 Business Solution Flow

```
[Business logs in] → [Business Dashboard]
    │
    [Sees relevant problem in feed]
    │
    ├── [Post Solution (organic)]
    │    → Fill in product/service details
    │    → Submit → Appears as "Business Solution" in thread
    │    → Community rates helpfulness
    │
    └── [Create Ad Campaign (paid)]
         → Select target categories
         → Select target regions
         → Set budget and bid
         → Set date range
         → Submit for admin approval
         → Approved → Ads start showing as "Sponsored Business Solution"
         → Billing via Paystack (mobile money / card)
```

## 19.5 Community Verification Flow

```
[New problem submitted] → Status: PENDING_VERIFICATION
    │
    [System identifies nearby verified users (10km radius)]
    → Up to 20 users notified (in-app + SMS)
    │
    [Notified user taps notification]
    → Sees problem summary + photo + map
    → Votes: ✅ Yes / ❌ No / 🤷 Don't Know
    → Optionally adds own photo
    │
    [Hourly cron job checks votes]
    → If 3+ Yes AND yes_ratio > 60% → COMMUNITY_VERIFIED
    → If 24 hours pass without enough votes → REVIEW_NEEDED
    → If majority votes No → FLAGGED → Admin reviews
```

## 19.6 Resolution Verification Flow

```
[Resolution claimed on a problem]
    │
    [All reporters + upvoters notified]
    → "Did this fix your problem? Vote now."
    │
    [User taps notification]
    → Sees resolution claim details + evidence
    → Votes: ✅ Yes, fixed! / ❌ No, not fixed
    → Optionally uploads current photo + comment
    │
    [7-day voting window]
    │
    [After 7 days or all voted:]
    ├── ≥ 70% Yes + ≥ 5 votes → RESOLVED_CONFIRMED
    │   → Problem closed → Timeline updated → All users notified
    │
    ├── < 70% Yes → RESOLUTION_DENIED
    │   → Problem stays open → False resolution flagged on claimant
    │
    └── < 5 total votes → Extended 3 days
        → Still < 5 → Admin review
```

---

# 20. Mobile-First Design Principles

## 20.1 Core Principles

Kasa is designed mobile-first because most Ghanaians access the internet primarily through smartphones, often with slow data connections.

**Thumb-friendly design:**
- All primary action buttons are in the lower third of the screen (reachable by thumb)
- Bottom navigation is the primary nav structure
- The "Report" button is centre-bottom, always accessible
- Minimum tap target size: 48 × 48 pixels

**Speed and performance:**
- Pages must load in under 3 seconds on a 3G connection
- Images are lazy-loaded (only load when scrolled into view)
- Photo thumbnails are compressed to max 100KB; full-size loaded on tap
- Server-side rendering for initial page load (critical for slow connections)
- Service worker caches the app shell so returning visits load instantly

**Data efficiency:**
- Total initial page load: under 500KB
- Infinite scroll loads 20 items at a time
- Photos are displayed at appropriate resolution (not full-size in feed)
- Option in settings: "Low Data Mode" — text only, photos load on tap

**Offline capability (PWA):**
- Service worker caches the last viewed feed
- Users can draft problem reports offline — submitted when connection returns
- Cached public dashboard data viewable offline (with "last updated X minutes ago" indicator)

## 20.2 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| < 640px (mobile) | Single column, bottom nav, full-width cards |
| 640–1024px (tablet) | Two-column feed, bottom nav persists |
| > 1024px (desktop) | Three-column layout: left sidebar nav, centre feed, right sidebar (trending/scores). Bottom nav replaced by sidebar. |

## 20.3 Colour System

| Colour | Hex Code | Usage |
|--------|----------|-------|
| Kasa Green (primary) | `#1B4332` | Headers, primary text, nav background |
| Kasa Forest | `#2D6A4F` | Secondary headings, buttons |
| Kasa Leaf | `#40916C` | Tertiary elements, links |
| Kasa Gold (accent) | `#D4A843` | Primary action buttons, highlights, the Report button |
| Background | `#FAFAFA` | Page backgrounds |
| Card Background | `#FFFFFF` | Card surfaces |
| Light Green Tint | `#F0F7F4` | Alternating table rows, subtle backgrounds |
| Text Primary | `#1A1A1A` | Main body text |
| Text Secondary | `#666666` | Timestamps, secondary info |
| Text Muted | `#999999` | Placeholders, disabled states |
| Success | `#2E7D32` | Verified badges, resolved status |
| Warning | `#F9A825` | Pending states, warnings |
| Error/Danger | `#C62828` | High severity, error states |
| Official Blue | `#1565C0` | Official badges, acknowledged status |
| Business Purple | `#6A1B9A` | Business solution badges |

## 20.4 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page titles (H1) | Inter / Arial | 24px | Bold |
| Section titles (H2) | Inter / Arial | 20px | Bold |
| Sub-headings (H3) | Inter / Arial | 18px | Semi-bold |
| Body text | Inter / Arial | 16px | Regular |
| Secondary text | Inter / Arial | 14px | Regular |
| Captions / timestamps | Inter / Arial | 12px | Regular |
| Button text | Inter / Arial | 16px | Semi-bold |

**Note:** Inter is the preferred font (available via Google Fonts, excellent readability on mobile). Arial is the fallback for maximum compatibility.

## 20.5 Spacing System

Base unit: **4px**. All spacing is a multiple of 4.

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing between related elements |
| sm | 8px | Inside components (padding between icon and text) |
| md | 16px | Standard spacing between elements |
| lg | 24px | Between sections within a screen |
| xl | 32px | Between major sections |
| 2xl | 48px | Top of page, before first content |

## 20.6 Iconography

Use **Lucide Icons** (open-source, consistent, clean line style) for all UI icons. Category-specific icons use a custom set or emoji fallbacks.

---

> **END OF UI SPECIFICATION**
>
> *Kasa UI Architecture v1.0 — March 2026 — Companion to the Kasa PRD*
