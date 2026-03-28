# Kasa — hackathon web demo

This folder is a **small, working slice** of the Kasa product idea from your PRD: people can **post a civic problem**, **see a feed**, **open a detail page**, and **upvote** (one tap per browser, using a cookie — **not** real Ghana Card login).

## What you need installed

- **Node.js** (LTS is fine). This is the free runtime that runs JavaScript on your computer.
- **Internet** the first time you run the project, so your machine can download dependencies.

## Run it on your computer (plain steps)

1. Open a terminal in this folder: `kasa-web`.
2. Copy the example environment file:
   - **Windows (PowerShell):** `Copy-Item .env.example .env`
   - **Mac / Linux:** `cp .env.example .env`
3. Install packages (only needed once, or after changes to `package.json`):

   ```bash
   npm install
   ```

4. Create the local database tables (SQLite file under `prisma/`):

   ```bash
   npx prisma db push
   ```

5. Start the site:

   ```bash
   npm run dev
   ```

6. Open **http://localhost:3000** in your browser.

You should see the **feed**, links to **Report**, and be able to submit a problem. Photos or PDFs you attach are saved under `public/uploads/` for this demo only.

## What is included vs the full PRD

| In this demo | Not built yet (from PRD) |
| --- | --- |
| Local database, feed, filters, detail page | Ghana Card / NIA verification |
| Optional file upload (local disk) | Cloud storage (S3/GCS), EXIF GPS checks |
| Upvotes with a browser cookie | Logged-in users, one account per citizen |
| “Mark community verified” **in development only** | Real 24h neighbourhood confirmation |
| English UI | Twi/Ga/Ewe/Dagbani i18n |
| | Maps, official dashboards, AI, ads, Paystack |

The footer and on-page notes remind viewers this is a **hackathon prototype**, not a government service.

## Useful commands

- **`npm run dev`** — local development server with live reload.
- **`npm run build`** — check that everything compiles for production.
- **`npx prisma studio`** — simple spreadsheet-style view of the database (optional).

## Project layout (short)

- `src/app/` — pages: home feed (`/`), new report (`/problems/new`), detail (`/problems/[id]`).
- `src/app/actions/problems.ts` — server actions that write to the database (create post, upvote, demo verify).
- `prisma/schema.prisma` — data model: problems, evidence files, upvotes.
