**KASA**

*\"Speak\"*

Ghana's Problem-Solution Marketplace

**PRODUCT REQUIREMENTS DOCUMENT**

Version 1.0 \| March 2026

  -----------------------------------------------------------------------
  **Document Status: DRAFT --- Presentable v1 for Team Review**

  -----------------------------------------------------------------------

  ----------------------------------- -----------------------------------
  **Field**                           **Detail**

  Prepared By                         Kasa Founding Team

  Date                                28 March 2026

  Audience                            Founding Team + AI Coding Tool
                                      (Cursor)

  Confidentiality                     Strictly Confidential
  ----------------------------------- -----------------------------------

1\. Executive Summary

1.1 What Is Kasa?

Kasa --- meaning "Speak" in Twi --- is Ghana's first problem-solution
marketplace. It is a platform where any Ghanaian can report a real
problem affecting their life or community, and where solutions come from
three sources: fellow citizens who have found a fix, businesses whose
products or services address the problem, and government officials whose
job it is to resolve it.

Every problem is structured, categorised, and tied to a specific
location. Every official entity on the platform has a live public
accountability score that every Ghanaian can see. Every resolution claim
is verified by the community before a problem is marked as solved.

1.2 The Problem Kasa Solves

Ghana has no structured place for citizens to report problems and have
them heard, tracked, and resolved at scale. Today, complaints are
scattered across Facebook posts that get buried, Twitter threads that
are ignored, and WhatsApp messages that stay trapped in group chats.
Government portals are one-directional and bureaucratic. The result:
Ghana's real problems are invisible --- impossible to aggregate,
impossible to prioritise, and impossible to act on.

Kasa makes Ghana's problems visible, structured, measurable, and
solvable.

1.3 Why It Matters

-   Citizens finally have a single, trusted place to report problems and
    track whether anything is being done about them.

-   Government officials have a real-time dashboard showing exactly what
    their constituents need and how they are performing.

-   Businesses discover unmet needs in specific communities and can
    offer relevant solutions.

-   Researchers, NGOs, and policymakers access aggregated data showing
    where Ghana's biggest challenges are concentrated.

-   Ghana leads Africa in civic technology and transparent governance
    infrastructure.

2\. Vision and Mission

2.1 Mission Statement

*To give every Ghanaian a structured, trusted, and effective way to
report problems, find solutions, and hold responsible parties
accountable --- creating a transparent bridge between citizens,
businesses, and government.*

2.2 Long-Term Vision

Kasa begins in Ghana but is designed to expand across West Africa and
eventually the entire continent. The platform's architecture is built
for multi-country deployment, with each country having its own identity
verification system, local language support, and government
accountability structure. The long-term vision is to become Africa's
civic infrastructure layer --- the place where problems meet solutions
at national scale.

2.3 Core Values

-   Transparency: Every score, every timeline, every resolution status
    is public.

-   Verification: Every user, every problem, and every resolution is
    verified before it counts.

-   Inclusion: Works on basic smartphones, slow internet, and in local
    languages.

-   Accountability: Officials cannot hide from their performance data.

-   Community-Driven: The people closest to a problem verify it, rate
    solutions, and confirm resolutions.

3\. User Profiles

3.1 General Citizen

**Who they are:** Any Ghanaian with a Ghana Card or verified phone
number. They could be a student, a market trader, a farmer, a driver, or
a professional. They experience real problems daily --- broken roads,
water shortages, corruption, fake products --- and currently have no
effective channel to report them.

**What they want:** To be heard. To see their problem acknowledged. To
know that someone is working on it. To see whether their MP or assembly
member is actually doing their job.

**Their daily experience:** They open Kasa and see the problem feed
filtered to their district. They see problems other neighbours have
reported and upvote the ones they share. They post a new problem with a
photo and GPS tag. Over the next few days, they receive notifications:
their problem was community-verified, an official acknowledged it, a
peer shared a workaround, and a local business offered a relevant
service.

**Success looks like:** Their problem gets resolved, or at the very
minimum, it becomes visible to the people who can solve it, and those
people are held accountable for their response.

  --------------------- -------------------------------------------------
  **Permission**        **Details**

  Post problems         Structured post with category, location, evidence

  Upvote problems       One upvote per problem per user

  Submit peer solutions Text-based solutions that community can rate

  Rate solutions        Thumbs up/down on any solution

  Confirm/deny          Participate in resolution verification voting
  resolutions           

  View accountability   No login required for public dashboard
  scores                
  --------------------- -------------------------------------------------

3.2 Verified Expert

**Who they are:** A citizen who holds a verified professional credential
--- medical licence, engineering certificate, legal qualification,
teaching certificate, or similar. They have domain knowledge that makes
their solutions more credible.

**What they want:** To help their community using their expertise, and
to be recognised as a trusted voice on problems in their field.

**Their experience:** Same as General Citizen but their solutions in
their verified field carry a "Verified Expert" badge. They do not get
extra posting privileges --- just a trust marker.

**Technical specification:** The expert badge is stored as a user
attribute linked to one or more problem categories. When the expert
posts a solution to a problem in a matching category, the badge renders.
For non-matching categories, they appear as a regular citizen.

3.3 Verified Business

**Who they are:** A registered Ghanaian business with a verified GRA TIN
(Tax Identification Number) and business registration certificate. They
could be a construction company, a pharmacy, an ISP, a fintech, or any
enterprise.

**What they want:** To discover unmet needs in their market and offer
their products or services to Ghanaians who are actively looking for
solutions.

**Their experience:** They see a dashboard of problem categories
relevant to their registered business type. They can post commercial
solutions (clearly labelled) in relevant problem threads. They can bid
for contextual ad placement. They receive alerts when problem categories
they serve spike in their target regions.

  --------------------- -------------------------------------------------
  **Permission**        **Details**

  Post business         Labelled as \"Business Solution\" with company
  solutions             badge

  Contextual            Bid for promoted placement in relevant threads
  advertising           

  Analytics access      See which categories their solutions resonate
                        with

  Cannot post problems  Business accounts report problems through citizen
                        accounts
  --------------------- -------------------------------------------------

3.4 Verified Official

**Who they are:** An MP, district assembly officer, government agency
representative, or utility company representative. Verified through
official government email and manual review.

**What they want:** To see what problems their constituents face,
respond publicly, and demonstrate performance. (Or, for the less
motivated: to avoid the public embarrassment of a low accountability
score.)

**Their experience:** A dedicated dashboard shows all problems tagged to
their jurisdiction, sorted by severity. They can post official
responses, update resolution status, and see their live accountability
score compared to peers nationally. Every action they take is
timestamped and public.

3.5 Platform Administrator

**Who they are:** Internal Kasa team members with full system access.

**Permissions:** Full access to all content, user accounts, flagged
reports, AI moderation queue, business advertising approvals, and data
intelligence export tools. Can suspend accounts, override AI decisions,
and manage verification queues.

4\. Full Feature List

4.1 Layer 1 --- The Problem Feed

4.1.1 Problem Posting

**What it does (plain language):**

Any verified user can post a problem. They select a category (e.g. Roads
& Transport), a subcategory (e.g. Pothole), and a location (region,
district, specific area). They write a description and attach at least
one piece of evidence --- a photo with GPS data for physical problems,
or a document/screenshot for non-physical problems. AI suggests the best
category as they type.

**Technical specification:**

POST /api/v1/problems endpoint. Request body: { category_id: int,
subcategory_id: int, location: { region: string, district: string,
coordinates: { lat: float, lng: float } }, description: string (max 2000
chars), language: enum \[en, tw, ga, ee, dag\], evidence: \[{ type: enum
\[photo, document, screenshot\], file_url: string, gps_metadata: { lat:
float, lng: float } \| null }\] }. On submission: (1) AI
auto-categorisation runs and returns suggested category --- user
confirms or overrides. (2) GPS metadata extracted from photo EXIF data
and compared against stated location. If distance \> 500m, user is
warned and must confirm. (3) Problem enters 24-hour pending verification
state. (4) Community verification notifications dispatched to verified
users within 10km radius. Response: 201 Created with problem_id. Status:
PENDING_VERIFICATION.

4.1.2 Problem Feed Display

**What it does (plain language):**

The main screen shows a scrollable list of problems. By default, users
see problems from their own district first, then their region. Each
problem card shows the category icon, location, description preview,
number of upvotes, verification status (pending, community-verified,
officially-acknowledged, resolved), and how long ago it was posted.
Users can filter by category, location, severity, recency, and
resolution status. They can sort by most upvoted, most recent, or
highest severity.

**Technical specification:**

GET /api/v1/problems/feed endpoint. Query parameters: region, district,
category_id, subcategory_id, severity_min, severity_max, status (pending
\| verified \| acknowledged \| resolved), sort_by (upvotes \| recency \|
severity), page, limit. Default: user's verified location. Response:
paginated array of problem objects with upvote_count, status,
severity_score, created_at, cluster_id (if part of a duplicate cluster),
response_count. Infinite scroll with cursor-based pagination. Feed
refreshes via WebSocket for real-time updates when viewing.

4.1.3 Upvoting

**What it does (plain language):**

If a user has the same problem, they tap the upvote button. This adds
their voice to the issue without creating a duplicate post. More upvotes
push the problem higher in the feed and contribute to its severity
score.

**Technical specification:**

POST /api/v1/problems/{id}/upvote. One upvote per verified user per
problem. Upvote increments the upvote_count and triggers a recalculation
of severity_score. Upvotes are stored as a junction table:
upvotes(user_id, problem_id, created_at). Duplicate upvotes return 409
Conflict. Upvote can be removed: DELETE /api/v1/problems/{id}/upvote.

4.2 Layer 2 --- The Resolution Engine

4.2.1 Peer Solutions

**What it does (plain language):**

Any verified user can post a solution that worked for them. For example,
if someone reports that their area has no clean water, a neighbour might
reply "I found a borehole company at this number that drilled for us
within two weeks." The community then rates whether this solution is
helpful.

**Technical specification:**

POST /api/v1/problems/{id}/solutions. Body: { type: \"peer\",
description: string (max 1500 chars), evidence: \[file\] \| null }.
Solutions are rated by community: POST /api/v1/solutions/{id}/rate {
helpful: boolean }. Solution displays: helpful_count, unhelpful_count,
helpfulness_percentage. If poster is a Verified Expert in the matching
category, expert_badge: true is added to response object.

4.2.2 Official Responses

**What it does (plain language):**

When a government official responds to a problem, their response is
prominently displayed with an official badge. Their response updates the
problem status (e.g., from "unresolved" to "acknowledged" or "in
progress"). Every official response is timestamped and permanent --- it
cannot be deleted.

**Technical specification:**

POST /api/v1/problems/{id}/responses. Body: { type: \"official\",
status_update: enum \[acknowledged, in_progress, resolved, referred\],
description: string, resolution_evidence: \[file\] \| null }. Only users
with role: VERIFIED_OFFICIAL and jurisdiction matching problem location
can post. Response creates an entry in the problem timeline. Status
change triggers notification to all reporters and upvoters. Official
responses are append-only --- no DELETE endpoint. All responses update
the official's accountability metrics in real time.

4.2.3 Business Solutions

**What it does (plain language):**

Verified businesses can post their product or service as a solution.
These are clearly labelled as "Business Solution" so users know it is a
commercial offering. The community rates business solutions the same way
they rate peer solutions.

**Technical specification:**

POST /api/v1/problems/{id}/solutions. Body: { type: \"business\",
description: string, product_name: string, pricing_info: string \| null,
contact_info: string, website: string \| null }. Rendered with distinct
visual styling and "Business Solution" label. Business must have
verified_business role and their registered business categories must
match the problem category. Non-matching categories require admin
approval before display.

4.3 Layer 3 --- Accountability Score

See Section 7 for full specification of the Accountability Score system.

4.4 Layer 4 --- AI Intelligence Engine

See Section 6 for full specification of all AI features.

4.5 Layer 5 --- Data Intelligence Layer

4.5.1 Subscription Data Access

**What it does (plain language):**

Businesses, NGOs, researchers, and government agencies can subscribe to
access aggregated, anonymised data about what problems are trending
where, which categories are growing, which issues have been unresolved
the longest, and the estimated economic impact of unresolved issues by
region.

**Technical specification:**

GET /api/v1/intelligence/reports. Authenticated via API key linked to
subscription tier. Query parameters: region, district, category,
date_range, sort_by. Response: aggregated data objects --- no individual
user data, no reporter identities, no specific location coordinates more
precise than district level. Subscription tiers control access level
(see Section 8). Rate limited: Basic 100 req/day, Standard 500 req/day,
Premium 2000 req/day + WebSocket streaming.

4.5.2 The Public Accountability Dashboard

**What it does (plain language):**

A public webpage --- no login required --- shows a national map of Ghana
with all open problems colour-coded by severity, a real-time ranking of
officials by resolution score, the top 10 most severe unresolved
problems, and trending problem categories. This is the "front page" of
Ghana's civic health.

**Technical specification:**

GET /api/v1/dashboard/public. No authentication required. Returns: (1)
GeoJSON of open problems with severity colour mapping (green \< 30,
yellow 30--60, orange 60--80, red \> 80). (2) Ranked list of official
entities with scores. (3) Top 10 problems by severity_score descending.
(4) Category breakdown with volume and resolution rates. (5) 7-day
trending data. (6) Total cost_of_inaction sum. Dashboard is server-side
rendered for fast load on slow connections. Data cached at 5-minute
intervals. Map rendered with Mapbox GL JS or Leaflet.

5\. Verification System

The platform's credibility depends entirely on verified, authentic
reports. This section describes the six verification layers that work
together to ensure trust.

5.1 Layer 1 --- Reporter Identity Verification

**What it does (plain language):**

Every user must prove they are a real person before they can post
anything. The primary method is linking their Ghana Card number ---
entered once during registration, checked against the National
Identification Authority (NIA) database, and never asked for again. For
users without a Ghana Card, a verified Ghanaian phone number (one SIM
per account, verified by OTP code) serves as the secondary method. Each
verified identity can only hold one Kasa account permanently. If someone
tries to create a second account with the same Ghana Card or phone
number, the system blocks it.

**Technical specification:**

Registration flow: (1) User enters Ghana Card number (PIN format:
GHA-XXXXXXXXX-X). (2) System calls NIA verification API (or approved
third-party KYC provider such as Hubtel Verify or Smile Identity) with
the card number. (3) API returns match/no-match with name and date of
birth. (4) On match, ghana_card_hash (bcrypt hash of the number) is
stored --- the raw number is NOT stored in the database. (5) A unique
constraint on ghana_card_hash prevents duplicate accounts. Secondary
flow: (1) User enters phone number. (2) OTP sent via SMS gateway (e.g.
Arkesel, Hubtel, or Twilio). (3) User enters 6-digit OTP within 5-minute
window. (4) phone_number_hash stored with unique constraint. Schema:
users table includes ghana_card_hash (unique, nullable), phone_hash
(unique, nullable), verification_method enum \[ghana_card, phone\],
verification_status enum \[unverified, pending, verified, suspended\],
false_report_count int (default 0). If false_report_count \>= 3,
posting_privileges set to false.

5.2 Layer 2 --- Evidence Requirements

**What it does (plain language):**

Every problem post requires at least one piece of evidence. For physical
problems like broken roads, open gutters, or collapsed buildings, the
user must upload a photo. The system automatically reads the GPS
coordinates embedded in the photo and checks that they match the
location the user selected. If the photo was taken more than 500 metres
from the stated location, the user is warned before they can submit. For
non-physical problems like fraud, fake job adverts, or policy failures,
the user uploads a document, screenshot, or file as evidence.

**Technical specification:**

File upload: POST /api/v1/uploads. Accepted formats: JPEG, PNG, PDF,
DOC, DOCX. Max file size: 10MB. For photos: server extracts EXIF GPS
data using a library (e.g. exifr for Node.js, Pillow for Python). GPS
coordinates compared against stated problem location using Haversine
formula. If distance \> 500m: return warning flag to client, user must
acknowledge mismatch before proceeding. If distance \> 5km: submission
blocked, user must re-take photo at location. Photos are stored in cloud
storage (AWS S3 or Google Cloud Storage) with unique keys. Original EXIF
data is preserved for audit but stripped from the publicly displayed
version to protect reporter privacy. Evidence table: evidence(id,
problem_id, type enum \[photo, document, screenshot\], file_url,
original_gps_lat, original_gps_lng, location_match boolean,
upload_timestamp).

5.3 Layer 3 --- Community Cross-Verification

**What it does (plain language):**

When someone posts a new problem, it does not immediately appear in the
main feed. Instead, it enters a 24-hour "pending verification" state.
During this time, verified users who live near the reported location
receive a notification asking: "Can you confirm this problem exists? Yes
/ No / I don't know." If three or more independent local users confirm
within 24 hours, the problem becomes "community verified" and fully
visible in the feed. If not enough confirmations arrive, the problem is
held for manual review by the platform team.

**Technical specification:**

On problem creation: (1) Status set to PENDING_VERIFICATION. (2) System
queries users table for verified users with location within 10km radius
of problem coordinates. (3) Up to 20 users are notified via push
notification, SMS, and/or WhatsApp. (4) Verification votes stored:
community_verifications(id, problem_id, user_id, vote enum \[yes, no,
unknown\], created_at). (5) Cron job runs every hour: if yes_count \>= 3
AND (yes_count / (yes_count + no_count)) \> 0.6, status changes to
COMMUNITY_VERIFIED. (6) If 24 hours elapse without sufficient
confirmations, status changes to REVIEW_NEEDED and enters admin queue.
(7) Users who voted cannot have also been the reporter (user_id !=
problem.reporter_id constraint). (8) Voters must have
verification_status = verified.

5.4 Layer 4 --- AI Pattern Analysis

**What it does (plain language):**

AI checks every submission for signs of manipulation. It looks for
coordinated campaigns (multiple new accounts all reporting the same
thing within a short time), photos that have been manipulated or stolen
from the internet, vague reports with no real detail, and users posting
about locations they have never been associated with.

**Technical specification:**

On each submission, the following checks run asynchronously: (1)
Coordination detection: query for problems with semantic similarity \>
0.85 submitted within 2 hours by accounts created within 48 hours of
each other. If cluster size \>= 3, flag all for review. (2) Image
verification: reverse image search via Google Vision API or TinEye API.
If match found, flag with source URL. (3) Linguistic vagueness: NLP
analysis of description length, specificity score (presence of named
entities, numbers, specific locations), and readability. Descriptions
scoring below threshold receive credibility_penalty. (4) Location
consistency: compare problem location against user's posting history
centroid. If \> 100km from usual area and no verified address in that
district, flag for review. Results stored in ai_flags table:
ai_flags(id, problem_id, flag_type, confidence_score float, details
jsonb, reviewed boolean, reviewer_id, review_outcome).

5.5 Layer 5 --- Severity Escalation Verification

**What it does (plain language):**

When a problem becomes very severe (high severity score, many reports,
wide geographic spread), the platform takes extra steps: it requests
field verification from nearby users by sending a special "urgent
verification" notification, and it alerts registered journalists and
media organisations so they can independently investigate and report.

**Technical specification:**

Trigger: when a problem's severity_score crosses 75 (out of 100).
Actions: (1) Send URGENT_VERIFICATION notification to 10 nearest
verified users requesting photo/video evidence from the location. (2)
Send MEDIA_ALERT to users with role: MEDIA in the same region. (3)
Problem card displays "Media Verification Requested" badge. (4) If a
MEDIA user submits a response, it is flagged as media_verified: true and
the problem gains an additional trust indicator. Escalation events
stored in: escalation_log(id, problem_id, trigger_score,
media_notified_count, field_verifications_requested,
field_verifications_received, created_at).

5.6 Layer 6 --- Resolution Verification

**What it does (plain language):**

When anyone claims a problem is resolved --- whether an official, a
business, or a peer --- the original reporters and upvoters are notified
and asked: "Did this actually fix your problem?" They have seven days to
vote Yes or No. If 70% or more say Yes, the problem is marked as
"Resolved (Confirmed)." If the majority says No, the problem stays open
and the false resolution claim is flagged publicly. For physical
problems, the person claiming resolution must also upload a new photo
taken at the matching GPS coordinates showing the problem is fixed.

**Technical specification:**

POST /api/v1/problems/{id}/resolution-claim. Body: { claimant_type: enum
\[official, business, peer\], description: string, evidence: \[file\] \|
null }. For physical problems: evidence must include photo with GPS
within 500m of original problem location. On claim: (1) All reporters
and upvoters notified. (2) Resolution vote opens for 7 days. (3) Votes
stored: resolution_votes(id, problem_id, claim_id, user_id, vote
boolean, created_at). (4) After 7 days or when all eligible voters have
voted: if yes_votes / total_votes \>= 0.70, status = RESOLVED_CONFIRMED,
resolved_at = now(). If \< 0.70, status remains OPEN, claim flagged as
false_resolution: true, and false resolution count incremented on
claimant's profile. (5) Minimum 5 votes required for resolution to be
confirmed; if fewer than 5 votes received, review period extends by 3
days, then falls to admin review.

6\. AI Features

AI runs silently behind the platform performing six core functions. Each
is described below in plain language and technical specification.

6.1 Auto-Categorisation

**What it does (plain language):**

As the user types their problem description, the AI reads the text in
real time and suggests the most appropriate category and subcategory.
For example, if someone types "the road to my house has had a huge
pothole for three months," the AI suggests "Roads & Transport \>
Pothole." The user can accept the suggestion or choose a different
category manually.

**Technical specification:**

Implementation: On each keystroke (debounced at 500ms), send the current
text to a classification endpoint: POST /api/v1/ai/categorise { text:
string, language: string }. The endpoint uses a fine-tuned text
classifier (options: fine-tuned GPT model via OpenAI API, or a locally
hosted model such as a fine-tuned BERT/RoBERTa on Ghanaian problem
categories). Model is trained on a labelled dataset of Ghanaian civic
complaints mapped to the platform's category taxonomy. Response: {
suggested_category_id: int, suggested_subcategory_id: int, confidence:
float }. If confidence \> 0.7, suggestion is displayed prominently. If
confidence 0.4--0.7, suggestion shown with "Not sure? Choose manually"
option. If confidence \< 0.4, no suggestion displayed. Model supports
input in all five platform languages.

6.2 Duplicate Clustering

**What it does (plain language):**

When a new problem is submitted, the AI compares it against all existing
open problems --- not just matching keywords, but understanding the
meaning. If a very similar problem already exists, the user is shown the
existing thread and offered the option to join it as an upvote instead
of creating a duplicate. If they insist their problem is different, they
can override and post separately, with a link to the related thread.

**Technical specification:**

On submission, before the problem is saved: (1) Generate a text
embedding of the description using an embedding model (e.g. OpenAI
text-embedding-3-small or a locally hosted sentence-transformer). (2)
Query a vector database (e.g. Pinecone, Qdrant, or pgvector extension in
PostgreSQL) for existing open problems within the same region with
cosine similarity \> 0.82. (3) If matches found, return top 3 matches to
the client with similarity scores. (4) Client displays: "This looks
similar to an existing report. Join that thread instead?" (5) If user
chooses to join: their submission becomes an upvote on the existing
problem with their description appended as a supporting report. (6) If
user overrides: their problem is saved as a new record with
related_problem_ids linking to the matched problems. (7) For clustered
problems, a cluster record is created: clusters(id, primary_problem_id,
problem_ids jsonb, total_reporters int, geographic_spread jsonb,
ai_summary text, severity_score int).

6.3 Severity Scoring

**What it does (plain language):**

Every clustered problem receives an automatic severity score from 1 to
100. The score is based on five factors: how many people have reported
it, how geographically widespread the reports are, how long the problem
has been open without a solution, whether reports are accelerating (more
this week than last week), and whether any escalation events have
occurred such as media coverage or official acknowledgement.

**Technical specification:**

Severity score calculated by a weighted formula, recalculated every hour
via a scheduled job. Formula: severity_score = (0.25 \*
normalised_reporter_count) + (0.20 \* geographic_spread_score) + (0.20
\* duration_score) + (0.20 \* acceleration_rate) + (0.15 \*
escalation_bonus). Where: normalised_reporter_count =
min(total_reporters / 100, 1.0) \* 100. geographic_spread_score =
(unique_districts_reported / total_districts_in_region) \* 100.
duration_score = min(days_open / 90, 1.0) \* 100. acceleration_rate =
(reports_last_7_days / max(reports_previous_7_days, 1)) normalised to
0--100. escalation_bonus = 0 if no escalation, 50 if media_verified, 30
if officially_acknowledged. Final score capped at 100. Stored in
severity_scores table with timestamped history for trend analysis.

6.4 Manipulation Detection

**What it does (plain language):**

AI watches for signs that someone is trying to game the system --- for
example, creating fake accounts to flood the platform with false reports
about a political opponent, or uploading stolen photos. Flagged
submissions go to human review before they become visible.

**Technical specification:**

Five detection modules run on each submission: (1) Account coordination:
flag if \>= 3 semantically similar reports from accounts created within
48 hours. (2) Photo duplication: hash-based comparison (pHash) against
all previously uploaded photos + reverse image search API. (3) GPS
mismatch: compare EXIF GPS against stated location (threshold: 500m).
(4) Velocity check: flag if a single account submits \> 5 reports in 1
hour or \> 15 in 24 hours. (5) History pattern: flag accounts where \>
30% of past reports were marked false or unverified. Each flag generates
a record in ai_flags with confidence_score. If any flag has confidence
\> 0.8, the submission is held for human review. If confidence 0.5--0.8,
submission proceeds but is marked for monitoring. Below 0.5, no action.

6.5 Cost of Inaction Calculator

**What it does (plain language):**

For serious problems, the AI estimates the economic cost of leaving the
problem unresolved. For example, a broken road that adds 45 minutes to
the daily commute of 500 people generates an estimated daily
productivity loss in Ghana cedis. This figure appears on the problem
thread and is updated weekly. It makes the invisible cost of inaction
visible and tangible.

**Technical specification:**

Triggered when severity_score \>= 60. Uses category-specific cost
models. Example for transport: cost_per_day = affected_population \*
additional_commute_minutes \* (average_hourly_wage / 60). Average hourly
wage sourced from Ghana Statistical Service data (configurable
constant). Affected population estimated from reporter count \*
geographic multiplier (based on district population density). Models
stored as configurable JSON templates per category. Result stored:
cost_of_inaction(problem_id, daily_cost_ghs float, calculation_model
string, last_updated timestamp). Displayed on problem card and
aggregated on the public dashboard. Weekly recalculation cron job.

6.6 Multilingual Support

**What it does (plain language):**

The platform supports posting and reading in five languages: English,
Twi, Ga, Ewe, and Dagbani. Users can post in any language. The AI
translates all posts into English for the central database, and displays
them in each reader's preferred language automatically. So a
Twi-speaking user can post in Twi, and an English-speaking user sees the
same post in English.

**Technical specification:**

Translation pipeline: (1) On submission, original language detected
using language detection (e.g. Google Cloud Translation API or lingua
library). (2) Original text stored with language tag. (3) English
translation generated and stored as the canonical version for search,
embedding, and clustering. (4) On read, if user's preferred language
differs from original, translation is generated on-demand and cached.
Cache key: problem_id:target_language. (5) Translation API: Google Cloud
Translation v3 (supports custom glossaries for Ghanaian terms) or
fine-tuned NLLB (No Language Left Behind) model for local languages. (6)
UI strings (buttons, labels, menus) are localised via i18n framework
(e.g. react-i18next) with translation files for all five languages.
Schema addition: problems table includes original_language enum and
translations jsonb column.

7\. The Accountability Score

7.1 What It Is (Plain Language)

Every official entity on Kasa --- every MP, every district assembly,
every government agency, every utility company --- has a live public
score visible to all Ghanaians. The score measures one thing: how well
this entity responds to and resolves the problems in its jurisdiction.
It is calculated from four metrics, updated in real time, and ranked
nationally. No official can hide from it. No login is required to see
it.

7.2 The Four Metrics

  --------------------- -------------------------------------------------
  **Metric**            **Description**

  Problems Received     Total problems tagged to their jurisdiction

  Acknowledgement Rate  Percentage of received problems that received an
                        official response

  Resolution Rate       Percentage of received problems confirmed
                        resolved by the community

  Average Resolution    Average number of days from first report to
  Time                  confirmed resolution
  --------------------- -------------------------------------------------

7.3 Score Calculation (Technical)

The accountability_score is a composite score from 0 to 100, calculated
as follows:

accountability_score = (0.20 \* acknowledgement_rate_pct) + (0.40 \*
resolution_rate_pct) + (0.25 \* timeliness_score) + (0.15 \*
response_quality_score)

Where: acknowledgement_rate_pct = (problems_acknowledged /
problems_received) \* 100. resolution_rate_pct =
(problems_resolved_confirmed / problems_received) \* 100.
timeliness_score = 100 - min((avg_resolution_days / 90) \* 100, 100) ---
so faster resolution means higher score, with 90 days as the baseline.
response_quality_score = average community rating of the official's
responses (1--5 scale normalised to 0--100).

Stored in: accountability_scores(official_id, score float,
acknowledgement_rate float, resolution_rate float, avg_resolution_days
float, response_quality float, last_calculated timestamp). Recalculated
every 15 minutes via scheduled job. Historical scores stored for trend
charts: score_history(official_id, score, timestamp).

7.4 Public Display

The accountability dashboard is accessible at /dashboard without login.
It shows a ranked list of all officials from highest score to lowest, a
map view with colour-coded jurisdictions (green = high score, red = low
score), individual official profiles with all four metrics charted over
time, and a comparison view where users can compare two or more
officials side by side. The dashboard is server-side rendered for speed
and SEO. Data is cached and refreshed every 5 minutes.

8\. Business Model

8.1 Revenue Stream 1 --- Contextual Advertising

**What it does (plain language):**

When a problem category receives many reports in a specific area,
businesses whose products or services solve that category of problem can
pay to have their solution shown prominently within relevant problem
threads. These ads are clearly labelled as "Sponsored Business Solution"
so users know the difference between an organic solution and a paid one.
Pricing depends on how severe the problems are and how many people are
seeing them. Payment is via mobile money (MTN MoMo, Vodafone Cash,
AirtelTigo Money) or card.

**Technical specification:**

Ad system: businesses create campaigns targeting specific category_ids
and region/district combinations. Campaign model: campaigns(id,
business_id, category_ids jsonb, target_regions jsonb, daily_budget_ghs
float, bid_per_impression_ghs float, start_date, end_date, status). Ad
serving: when a user views a problem thread, query eligible campaigns
matching the problem's category and location. Rank by bid_per_impression
\* relevance_score. Display max 1 ad per thread, labelled "Sponsored
Business Solution." Billing: impression-based (CPM) or click-based
(CPC), configurable per campaign. Payment integration: Paystack
(supports MTN MoMo, Vodafone Cash, cards) or Hubtel Payment API. Minimum
campaign spend: GHS 50.

8.2 Revenue Stream 2 --- Data Intelligence Subscriptions

  ----------------- ------------------- ----------------- -----------------
  **Tier**          **Access Level**    **Price/Month**   **API Calls/Day**

  Basic             National trending,  GHS 500           100
                    top categories                        

  Standard          \+                  GHS 2,000         500
                    Regional/category                     
                    filters, export CSV                   

  Premium           \+ Custom reports,  GHS 5,000         2,000
                    full API,                             
                    historical data,                      
                    WebSocket streaming                   
  ----------------- ------------------- ----------------- -----------------

Technical: Subscription management via Paystack recurring billing. API
authentication via API keys tied to organisation accounts. Usage
tracking middleware counts requests per API key per day. Rate limiting
returns 429 Too Many Requests when exceeded. Data endpoints return only
aggregated, anonymised data --- minimum aggregation unit is district
level, minimum group size is 10 reports before data is included.

8.3 Revenue Stream 3 --- Verified Official Account Subscriptions

  ----------------------- ----------------------- -----------------------
  **Tier**                **Entity Type**         **Price/Month**

  District                District Assembly       GHS 200

  Regional                Regional agencies, MPs  GHS 500

  National                National agencies,      GHS 1,500
                          ministries, utilities   
  ----------------------- ----------------------- -----------------------

All tiers include: full response dashboard, jurisdiction problem feed,
resolution tracking, accountability score display, ability to send
official notifications to constituents, and constituency analytics.
National tier adds cross-regional analytics and API access.

9\. Geographic Architecture

9.1 Location Hierarchy

Ghana's administrative structure on Kasa: National \> Region (16
regions) \> District (261 districts) \> Community/Area (user-defined
with GPS coordinates). Every problem is tagged to a specific point
(lat/lng) and automatically mapped to its district and region.

9.2 How Location Works Across Features

  --------------------- -------------------------------------------------
  **Feature**           **Location Behaviour**

  Default feed          User's verified district first, then region. User
                        can switch to any region or national.

  Posting a problem     Requires GPS confirmation (user is physically at
                        location) OR a verified address in that district
                        on their profile.

  Community             Only verified users within 10km of the problem
  verification          can vote.

  Diaspora users        Can view any feed. Can only post about locations
                        where they have a verified address on record.

  Non-Ghanaians         Can view public dashboard only. Can purchase data
                        subscriptions. Cannot post or upvote.

  Official jurisdiction Officials see problems from their assigned
                        jurisdiction (district, region, or national).

  Business targeting    Businesses select target regions for ads.
                        Solutions visible nationally unless geo-targeted.
  --------------------- -------------------------------------------------

9.3 Technical Implementation

Location storage: every problem has coordinates (lat, lng) stored as
PostGIS geography type for efficient spatial queries. Reverse geocoding
via Google Maps Geocoding API or OpenStreetMap Nominatim maps
coordinates to district and region. User locations stored as
primary_location(district_id, region_id) with optional
additional_addresses for diaspora users. Spatial queries use PostGIS
ST_DWithin for radius-based lookups (community verification, nearby
problems). A pre-computed district_boundaries table with GeoJSON
polygons enables fast point-in-polygon lookups.

10\. Notification System

10.1 Notification Types

  --------------------- ------------------------ ------------------------
  **Event**             **Who Gets It**          **Channels**

  Official response to  Reporter + all upvoters  In-app, SMS, WhatsApp
  your problem                                   

  Peer solution posted  Reporter + upvoters      In-app, SMS

  Resolution claim      Reporter + upvoters      In-app, SMS, WhatsApp
                        (with vote link)         

  Status change         Reporter + upvoters      In-app

  New problem in        Verified Officials       In-app, email
  jurisdiction                                   

  Score change          Verified Officials       In-app, email
  (significant)                                  

  Category spike in     Verified Businesses      In-app, email
  target region                                  

  Severity threshold    Media accounts           In-app, email, SMS
  crossed                                        

  Community             Nearby verified users    In-app, SMS
  verification request                           
  --------------------- ------------------------ ------------------------

10.2 Technical Implementation

Notification service: event-driven architecture using a message queue
(e.g. Redis Pub/Sub, RabbitMQ, or AWS SQS). When a trigger event occurs,
a notification event is published to the queue with payload: {
event_type, recipient_ids, data, channels }. Notification workers
consume events and dispatch to appropriate channels. In-app: WebSocket
push via Socket.io or Pusher. SMS: Arkesel or Hubtel SMS API. WhatsApp:
WhatsApp Business API via official provider (e.g. 360dialog or Twilio).
Email: Resend, SendGrid, or AWS SES. Users configure preferred channels
in settings. Critical notifications (resolution claims, verification
requests) are sent on all enabled channels. Low-priority notifications
(status changes) default to in-app only. Schema: notifications(id,
user_id, event_type, data jsonb, channel enum \[in_app, sms, whatsapp,
email\], sent_at, read_at, status enum \[pending, sent, delivered,
failed\]).

11\. Technical Stack Recommendation

This section explains what each piece of technology does in plain
language and specifies exactly what an AI coding tool should use.

  ----------------------- ----------------------- -----------------------
  **Component**           **Recommended           **Why (Plain
                          Technology**            Language)**

  Frontend (what users    Next.js 14+ with React, Works great on mobile
  see)                    Tailwind CSS            browsers, fast loading,
                                                  can become a PWA for
                                                  offline use

  Progressive Web App     Next.js PWA plugin +    Lets users \"install\"
                          Service Workers         the website on their
                                                  phone without
                                                  downloading from an app
                                                  store

  Backend (server logic)  Node.js with Express.js Handles all the
                          or Next.js API routes   business logic, user
                                                  verification, problem
                                                  processing

  Database (data storage) PostgreSQL with PostGIS Stores all data;
                          extension               PostGIS adds powerful
                                                  location/map features
                                                  built-in

  Vector search (AI       pgvector (PostgreSQL    Lets AI find similar
  similarity)             extension) or Pinecone  problems by meaning,
                                                  not just keywords

  AI processing           OpenAI API (GPT-4o,     Powers
                          embeddings) or local    auto-categorisation,
                          Hugging Face models     translation, severity
                                                  scoring, manipulation
                                                  detection

  Real-time updates       Socket.io or Pusher     Makes the feed update
                                                  live without page
                                                  refresh --- new
                                                  upvotes, status changes
                                                  appear instantly

  File storage (photos,   AWS S3 or Google Cloud  Stores all uploaded
  docs)                   Storage                 photos and documents
                                                  securely in the cloud

  Authentication          NextAuth.js or Auth0    Manages user login
                                                  sessions and security

  Payment processing      Paystack                Handles mobile money
                                                  (MTN MoMo, Vodafone
                                                  Cash) and card payments
                                                  --- built for Ghana

  SMS/WhatsApp            Arkesel (SMS) +         Sends notifications to
                          WhatsApp Business API   users via text message
                                                  and WhatsApp

  Hosting / deployment    Vercel (frontend) +     Where the platform
                          Railway or AWS          lives on the internet;
                          (backend + DB)          Vercel is fast and
                                                  easy, Railway handles
                                                  backend

  Map display             Mapbox GL JS or Leaflet Shows the interactive
                          with OpenStreetMap      map of Ghana with
                                                  problem pins and
                                                  severity colours

  Background jobs         BullMQ (with Redis) or  Runs scheduled tasks
                          node-cron               like recalculating
                                                  severity scores and
                                                  accountability scores

  Identity verification   Smile Identity or       Connects to Ghana's NIA
                          Hubtel Verify           database to verify
                                                  Ghana Card numbers
  ----------------------- ----------------------- -----------------------

12\. Data Privacy and Security

12.1 Ghana Data Protection Act 2012 (Act 843) Compliance

Kasa must comply with Ghana's Data Protection Act (Act 843) and register
with the Data Protection Commission. The platform processes personal
data (Ghana Card numbers, phone numbers, locations) and must follow the
eight data protection principles: lawful processing, purpose limitation,
data minimisation, accuracy, storage limitation, integrity and
confidentiality, accountability, and individual rights.

12.2 What Is Public vs Private

  ----------------------------------- -----------------------------------
  **Public (visible to all)**         **Private (visible only to
                                      user/admin)**

  Problem descriptions, categories,   Ghana Card numbers (hashed, never
  locations (district level)          stored in plain text)

  Upvote counts, severity scores      Phone numbers (hashed)

  Official responses and              Exact GPS coordinates of reporter's
  accountability scores               home

  Resolution timelines                User's real name (displayed as
                                      first name + last initial only)

  Aggregated data intelligence        Verification documents
  ----------------------------------- -----------------------------------

12.3 Security Measures

-   All data transmitted over HTTPS (TLS 1.3). No unencrypted
    connections accepted.

-   Ghana Card numbers are hashed using bcrypt before storage. Raw
    numbers are never stored.

-   Database encryption at rest using AES-256.

-   API authentication via JWT tokens with 24-hour expiry and refresh
    token rotation.

-   Role-based access control (RBAC) enforced at API middleware level.

-   Photo EXIF GPS data stripped from publicly displayed images but
    retained in secure audit log.

-   Regular security audits and penetration testing.

-   Data retention policy: inactive accounts archived after 2 years,
    deleted after 5 years.

-   GDPR-style data export and deletion rights provided to all users via
    settings page.

13\. Success Metrics

13.1 User Growth Metrics

  ----------------------- ----------------------- -----------------------
  **Metric**              **Target (6 Months)**   **Target (12 Months)**

  Verified users          50,000                  250,000

  Monthly active users    15,000                  100,000

  Verified officials on   50                      200
  platform                                        

  Verified businesses     100                     500
  ----------------------- ----------------------- -----------------------

13.2 Engagement Metrics

  --------------------- -------------------------------------------------
  **Metric**            **Target**

  Problems posted per   5,000+ by month 6
  month                 

  Average upvotes per   \> 10
  problem               

  Community             \> 70% within 24 hours
  verification          
  completion rate       

  Official response     \> 40% within 7 days
  rate                  

  Resolution rate       \> 20% within 90 days
  (confirmed)           
  --------------------- -------------------------------------------------

13.3 Revenue Metrics

  --------------------- -------------------------------------------------
  **Stream**            **Target (12 Months)**

  Contextual            GHS 100,000/month
  advertising           

  Data intelligence     20 paying organisations
  subscriptions         

  Official account      50 paying entities
  subscriptions         
  --------------------- -------------------------------------------------

14\. Phased Launch Plan

14.1 Phase 1 --- Foundation (Months 1--3)

**Build and launch the core platform with essential features. This is
the minimum viable product (MVP) --- the smallest version that delivers
real value.**

-   User registration and verification (Ghana Card + phone OTP)

-   Problem posting with category selection, location tagging, and photo
    evidence

-   Basic problem feed with filtering by category, location, and recency

-   Upvoting system

-   Community cross-verification (24-hour pending state)

-   Peer solutions with community ratings

-   Basic notification system (in-app + SMS)

-   Public accountability dashboard (basic version --- list of
    officials, not yet scored)

-   Admin panel for content moderation and user management

-   Mobile-responsive web app (no native app needed yet)

-   Support for English and Twi only in Phase 1

**Launch target:** Greater Accra Region as pilot region.

14.2 Phase 2 --- Intelligence (Months 4--6)

**Add the AI layer and official engagement.**

-   AI auto-categorisation

-   Duplicate clustering and severity scoring

-   Manipulation detection

-   Verified Official accounts with response dashboard

-   Full accountability score calculation and display

-   Official response workflow and resolution verification

-   Resolution timeline on every problem

-   WhatsApp notification channel

-   Add Ga and Ewe language support

-   Expand to Ashanti and Western regions

14.3 Phase 3 --- Monetisation (Months 7--12)

**Activate revenue streams and scale nationally.**

-   Contextual advertising system for businesses

-   Data intelligence subscription tier and API

-   Verified Business accounts and commercial solutions

-   Cost of inaction calculator

-   Verified Expert badge system

-   PWA (Progressive Web App) for offline capability

-   Add Dagbani language support

-   National rollout to all 16 regions

-   Media account verification and severity escalation alerts

-   Public dashboard v2 with map, trending, and cost of inaction

14.4 Phase 4 --- Scale (Year 2+)

-   Native mobile apps (iOS and Android) if user demand warrants

-   API marketplace for third-party integrations

-   West Africa expansion (starting with Nigeria or Côte d'Ivoire)

-   Advanced analytics and machine learning models trained on Ghanaian
    data

-   Partnerships with international development organisations

-   Open data initiatives for academic research

15\. Glossary

Every technical term used in this document, explained in plain language
so every team member fully understands.

  --------------------- -------------------------------------------------
  **Term**              **What It Means**

  API                   Application Programming Interface --- a way for
                        different software systems to talk to each other.
                        Like a waiter taking your order to the kitchen.

  Backend               The behind-the-scenes part of the platform that
                        users never see --- it processes data, runs AI,
                        and manages the database.

  Bcrypt                A method of scrambling sensitive data (like Ghana
                        Card numbers) so that even if someone accesses
                        the database, they cannot read the original
                        number.

  CPM / CPC             Cost Per Mille (per 1000 views) / Cost Per Click
                        --- two ways of charging advertisers.

  CRUD                  Create, Read, Update, Delete --- the four basic
                        operations you can do with data.

  Cursor-based          A way of loading large lists in small chunks
  pagination            (like scrolling through Instagram --- it loads
                        more as you scroll down).

  Database              Where all the platform's data is stored --- like
                        a giant organised filing cabinet for digital
                        information.

  Embedding             A way AI represents text as numbers so it can
                        compare the meaning of different sentences, not
                        just the words.

  Endpoint              A specific URL that the app calls to perform an
                        action (like submitting a problem or getting the
                        feed).

  EXIF data             Hidden information stored in every photo,
                        including when and where it was taken (GPS
                        coordinates).

  Frontend              The part of the platform users actually see and
                        interact with --- the screens, buttons, and
                        forms.

  GeoJSON               A standard format for representing geographic
                        features (like district boundaries) that maps can
                        read.

  GPS                   Global Positioning System --- the technology in
                        your phone that knows your exact location.

  Hash                  A one-way scramble of data. You can verify a
                        match without ever knowing the original value.

  JWT                   JSON Web Token --- a secure digital pass that
                        proves you are logged in without sending your
                        password every time.

  MVP                   Minimum Viable Product --- the smallest version
                        of the product that still delivers real value to
                        users.

  NLP                   Natural Language Processing --- AI that
                        understands and processes human language.

  OTP                   One-Time Password --- the 6-digit code sent to
                        your phone to verify it is really you.

  PostGIS               An add-on for PostgreSQL that lets the database
                        understand maps and locations natively.

  PostgreSQL            A powerful, free database system used by many
                        large companies worldwide.

  PWA                   Progressive Web App --- a website that can be
                        \"installed\" on your phone and works like a
                        native app, even with slow internet.

  RBAC                  Role-Based Access Control --- a system that gives
                        different users different permissions based on
                        their role.

  Server-Side Rendering The server prepares the full page before sending
  (SSR)                 it to your phone, so it loads faster ---
                        important for slow connections.

  Vector database       A special kind of database optimised for finding
                        things that are similar in meaning (used for
                        duplicate detection).

  WebSocket             A live connection between your phone and the
                        server that lets updates appear instantly without
                        refreshing the page.
  --------------------- -------------------------------------------------

**END OF DOCUMENT**

Kasa PRD v1.0 --- March 2026 --- Prepared for Team Review and AI Coding
Tool Handoff
