# SQL NOIR — The Black Ledger Conspiracy

> A noir detective game that teaches SQL. You play a detective in the fictional
> Indian metropolis of **Devgarh**, cracking an eight-level conspiracy by writing
> real SQL queries against real (in-browser) databases. Every clue is a query;
> every query is run against a live SQLite engine in your browser.

Built on Next.js, sql.js (WASM SQLite), Clerk authentication, and MongoDB for
progress. No SQL is faked — the same query you'd type into a real database is the
query that solves the case.

---

## Table of Contents

1. [Premise](#premise)
2. [The Curriculum](#the-curriculum)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Architecture](#architecture)
6. [Data Flow](#data-flow)
7. [Project Structure](#project-structure)
8. [The SQL Engine](#the-sql-engine)
9. [Objective Validation](#objective-validation)
10. [The SQL Academy (Tutorials)](#the-sql-academy-tutorials)
11. [Progression & Unlocking](#progression--unlocking)
12. [Persistence Model](#persistence-model)
13. [Authentication](#authentication)
14. [Getting Started](#getting-started)
15. [Environment Variables](#environment-variables)
16. [Running Locally](#running-locally)
17. [NPM Scripts](#npm-scripts)
18. [Verification & Testing](#verification--testing)
19. [Authoring New Content](#authoring-new-content)
20. [Routes](#routes)
21. [Deployment](#deployment)
22. [Project Status & Roadmap](#project-status--roadmap)
23. [Credits & License](#credits--license)

---

## Premise

Detective Inspector Kulkarni of Precinct 47 is handed a missing-witness case that
unravels into something far larger: a laundering network moving money through a
hotel, an auction house, and a phantom shipping manifest — all traceable through
records that someone on the inside has been quietly editing. Across eight cases
you follow the paper trail to a records-administrator insider, and the final case
demands a validated, evidence-based accusation before you can close the ledger.

The setting is India-centric throughout — Devgarh's neighborhoods, Indian names,
amounts in ₹ (INR) — and no real person, company, or place is attributed to any
crime.

<!-- SECTION-ANCHOR: curriculum -->

## The Curriculum

Eight cases, each teaching exactly **two cumulative SQL concepts** (SQLite
dialect). Later cases assume everything taught before them. Cases unlock
sequentially — you must close a case to open the next.

| # | Case | Concepts | Status |
|---|------|----------|--------|
| 1 | The Vanishing Witness | `SELECT`, `WHERE` | ✅ Playable |
| 2 | The Hotel on Ash Street | `ORDER BY`, `LIMIT` | ✅ Playable |
| 3 | The Silent Witnesses | `DISTINCT`, Aggregates (`COUNT`/`SUM`/`AVG`/`MIN`/`MAX`) | ✅ Playable |
| 4 | The Corrupt Precinct | `GROUP BY`, `HAVING` | ✅ Playable |
| 5 | The Midnight Exchange | `INNER JOIN`, `LEFT JOIN` | ✅ Playable |
| 6 | The Auction House | Self-join, `UNION` | ✅ Playable |
| 7 | The Phantom Shipment | Subqueries, `EXISTS` | ✅ Playable |
| 8 | The Black Ledger | CTEs, Window functions | ✅ Playable |

All eight cases are fully authored and SQL-verified, unlocking in sequence as the
player advances. See [Project Status & Roadmap](#project-status--roadmap).

## Features

- **Play by writing real SQL.** Each objective is solved by running a query in an
  in-browser terminal; the result rows are validated, not the query text.
- **A live SQLite engine in the browser** via sql.js (WASM). Queries run entirely
  client-side against per-case seed databases.
- **A story mode** — arc intros and per-quest cutscenes with a typewriter dialog
  player wrap the queries in a noir narrative.
- **The SQL Academy** — a data-driven tutorial track that teaches each concept in
  a sandbox before the case demands it.
- **Detective Dossier** — a profile page with real progress: cases solved,
  objectives completed, and a 16-concept SQL Skill Matrix driven by actual
  completion data (nothing is fabricated).
- **Sequential progression** persisted per user in MongoDB.
- **A verification harness + test suite** that proves every objective is solvable
  with the concepts already taught.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router, `next dev --turbopack`) |
| Language | TypeScript |
| UI | React, Tailwind CSS, shadcn/ui, lucide-react, framer-motion |
| Notifications | sonner |
| SQL engine | sql.js 1.14 (WASM SQLite), client-side |
| Auth | Clerk |
| Database (progress only) | MongoDB via mongoose |
| Tooling | ESLint 9 (flat config), Vitest, tsx |

<!-- SECTION-ANCHOR: architecture -->

## Architecture

Three responsibilities are kept strictly separate:

- **The SQL engine is client-side and disposable.** Case databases are seeded from
  plain SQL strings (`src/data/caseSeeds.ts`) into a fresh sql.js instance in the
  browser. Nothing about the puzzle data lives on a server; queries never leave the
  client.
- **MongoDB stores progress only** — which cases/quests/lessons a user has
  completed and their current objective per case. It never stores puzzle content
  or query results.
- **Clerk owns identity.** Every route except the landing page, sign-in/up, and the
  Clerk webhook is authentication-protected by the middleware in `src/proxy.ts`.

Content (cases, seeds, story scripts, tutorials) is **data-driven**: the pages are
generic renderers, and adding a level means adding data, not components.

## Data Flow

1. A signed-in user opens a case. `useSqlEngine(caseId)` seeds a sql.js database
   from `CASE_SEEDS[caseId]`.
2. The user types a query and wraps their answer in `submit(...)` in the terminal.
3. The terminal runs the query through sql.js and passes the result rows to the
   current objective's `validationFn`.
4. On success, the client calls the progress API, which advances the user's
   objective/quest/case state in MongoDB via `useGameProgress`.
5. When the last objective of a case validates, the case is marked complete and the
   next case unlocks.

## Project Structure

```
src/
  app/
    page.tsx                 # Landing page
    cases/page.tsx           # Case-file "folder" browser (animated page-flip)
    case/[slug]/page.tsx     # A single case: story + SQL terminal
    tutorials/page.tsx       # The SQL Academy index
    tutorials/[slug]/page.tsx# A single concept lesson + practice sandbox
    profile/page.tsx         # Detective Dossier (stats + skill matrix)
    api/progress/            # GET progress; POST advance / reset / lesson
    api/webhooks/clerk/      # Clerk user webhook
  components/
    terminal/SqlTerminal.tsx # The query terminal (shared by cases & tutorials)
    story/                   # DialogPlayer, QuestLog, cutscene UI
    Header.tsx               # Home / Cases / Tutorials / Profile nav
  data/
    cases.ts                 # 8 cases: objectives, quests, validators
    caseSeeds.ts             # SQL seed strings per case
    storyScripts.ts          # Arc/quest dialog scripts
    tutorials.ts             # 16-concept curriculum + training sandbox seed
  hooks/
    useSqlEngine.ts          # sql.js lifecycle (number caseId | raw seed string)
    useGameProgress.ts       # Progress read/write against the API
  lib/sqlEngine.ts           # sql.js init + query helpers
  models/GameProgress.ts     # Mongoose schema (progress only)
  proxy.ts                   # Clerk middleware / route protection
scripts/
  verify-cases.ts            # Standalone SQL verification harness
  solutions.ts               # Canonical answer key (shared with tests)
  sql.test.ts                # Vitest suite
```

<!-- SECTION-ANCHOR: engine -->

## The SQL Engine

`sql.js` compiles SQLite to WebAssembly and runs it in the browser. On mount,
`useSqlEngine` loads the WASM binary (served from `public/`), creates a `Database`,
and runs the seed SQL. The hook accepts either:

- a **numeric case id** → seeds from `CASE_SEEDS[id]`, or
- a **raw seed string** → used directly (this is how the tutorial sandbox reuses
  the same engine with its `TRAINING_SEED`).

Because everything is client-side and in-memory, a page reload re-seeds a clean
database — there is no query state to corrupt.

## Objective Validation

An objective never inspects the player's SQL text. It runs the query and inspects
the **result rows**:

```ts
interface CaseObjective {
  id: string;
  title: string;
  description: string;
  hint: string;
  questId: string;
  validationFn: (rows: Record<string, unknown>[]) => boolean;
  successMessage: string;
  narrativeAfter: string;
}
```

Validators are built from small, column-agnostic helpers (`countIs`, `anyRowHas`,
`everyRowHas`, `firstRowHas`, `isSorted`, `scalarIs`, `scalarApprox`,
`allDistinct`). They are lenient about *which* columns you select but strict about
the answer — e.g. a bare `SELECT *` fails a filtered objective because the row
count is wrong. In the terminal, `submit(tableName)` is sugar for
`SELECT * FROM tableName`; `submit(SELECT ...)` runs and validates your query.

## The SQL Academy (Tutorials)

`src/data/tutorials.ts` defines a **16-concept curriculum** (two per level, matching
the eight cases). All sixteen concepts are `available` with full lesson content and a
verified practice exercise, unlocking alongside their case as the player advances.

Each available concept renders as reading blocks (`text` / `code` / `tip` /
`warning`) plus a live sandbox. The sandbox reuses the exact `SqlTerminal` the cases
use, driven by a synthetic `CaseObjective` built from the concept's exercise — so
practice validation and case validation share one code path. Completing an exercise
records a lesson id in your progress.

## Progression & Unlocking

- Case 1 is unlocked for everyone; each later case unlocks when the previous one is
  completed.
- Within a case, objectives advance in order; completing all objectives in a quest
  completes the quest, and completing all quests completes the case.
- Tutorials mirror the same level gating (a concept is locked until its case is
  reachable).
- Progress is read once via `useGameProgress` and written on each validated
  objective/lesson.

<!-- SECTION-ANCHOR: persistence -->

## Persistence Model

A single Mongoose collection stores per-user progress and nothing else:

```ts
GameProgress {
  userId: string            // Clerk user id (unique, indexed)
  completedCases: number[]  // case ids
  completedQuests: string[] // quest ids
  completedLessons: string[]// tutorial concept ids
  currentObjectives: Map<string, number> // caseId -> objective index
}
```

Puzzle content, seed data, and query results are **never** persisted — they live in
code (`src/data`) and in the client-side sql.js instance.

The progress API:

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/progress` | Load the signed-in user's progress |
| `POST` | `/api/progress/advance` | Advance an objective / complete a quest or case |
| `POST` | `/api/progress/lesson` | Mark a tutorial lesson complete |
| `POST` | `/api/progress/reset` | Reset all progress for the user |
| `POST` | `/api/webhooks/clerk` | Clerk user lifecycle webhook |

## Authentication

Clerk provides sign-in/up and the user session. `src/proxy.ts` runs
`clerkMiddleware` and treats only `/`, `/sign-in(.*)`, `/sign-up(.*)`, and
`/api/webhooks(.*)` as public — every other route (`/cases`, `/case/*`,
`/tutorials`, `/profile`, and the progress APIs) requires a signed-in user. This is
why the app cannot be smoke-tested past the landing page without signing in.

<!-- SECTION-ANCHOR: getting-started -->

## Getting Started

**Prerequisites**

- Node.js 18+ and npm
- A MongoDB connection string (Atlas or local)
- A Clerk application (publishable + secret keys)

**Install**

```bash
npm install
```

## Environment Variables

Create a `.env` (or `.env.local`) in the project root. Names only — supply your own
values:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/cases
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/cases
CLERK_WEBHOOK_SECRET=

# MongoDB
MONGODB_URI=
```

> Never commit real secret values. `.env` is git-ignored; treat the keys above as a
> template.

## Running Locally

```bash
npm run dev
```

Then open http://localhost:3000, sign in, and start with Case 1.

## NPM Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |
| `npm run lint:fix` | ESLint with autofix |
| `npm run verify` | Run the standalone SQL verification harness |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |

<!-- SECTION-ANCHOR: verification -->

## Verification & Testing

Puzzle correctness is guaranteed by code, not by hand-checking.

- **`npm run verify`** — the standalone harness (`scripts/verify-cases.ts`) seeds
  each available case, runs the canonical answer key (`scripts/solutions.ts`) plus
  every tutorial exercise, and asserts each result satisfies its `validationFn`. It
  currently passes **96/96** (80 case objectives across all eight levels + 16 tutorial
  exercises) and exits non-zero on any failure.
- **`npm test`** — the Vitest suite (`scripts/sql.test.ts`) reuses the same shared
  answer key so the two can't drift. For every available objective and tutorial
  exercise it checks that (a) a canonical solution exists, (b) the solution
  validates, and (c) an empty result set is rejected — plus a strictness check that
  a bare `SELECT *` fails a filtered objective. **283 tests** pass.
- **`npx tsc --noEmit`** — type-checks clean.
- **`npm run lint`** — passes with 0 errors.

The single source of truth for solutions is `scripts/solutions.ts`, imported by
both the harness and the tests.

## Authoring New Content

To bring a locked case (4–8) online:

1. **Seed** — add the case's `CREATE TABLE` + `INSERT` SQL to
   `src/data/caseSeeds.ts` under its case id.
2. **Objectives & quests** — in `src/data/cases.ts`, fill the case's `schema`,
   `objectives` (each with a `validationFn` built from the helpers), and `quests`,
   then flip `status` from `"in-development"` to `"available"`.
3. **Story** — add the arc/quest dialog script to `src/data/storyScripts.ts` and
   register it in `ALL_SCRIPTS`.
4. **Answer key** — add one canonical query per objective to
   `scripts/solutions.ts`.
5. **Tutorials** — promote the level's two `coming-soon` concepts in
   `src/data/tutorials.ts` to `available` with lesson blocks and a verified
   exercise.
6. **Verify** — run `npm run verify` and `npm test`; both must stay green before the
   case is considered shippable.

Content rules: every mandatory query must be solvable with concepts already taught;
keep the setting India-centric (Devgarh, Indian names, ₹ INR); attribute no crime to
any real person, company, or place.

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/sign-in`, `/sign-up` | Public | Clerk auth |
| `/cases` | Auth | Animated case-file browser |
| `/case/[slug]` | Auth | Play a case (story + terminal) |
| `/tutorials` | Auth | The SQL Academy index |
| `/tutorials/[slug]` | Auth | A concept lesson + sandbox |
| `/profile` | Auth | Detective Dossier |

## Deployment

Any platform that runs a Next.js App Router app works (e.g. Vercel). Set all
[environment variables](#environment-variables) in the host, point
`MONGODB_URI` at your database, and configure the Clerk webhook endpoint at
`/api/webhooks/clerk`. `public/sql-wasm.wasm` must be served as a static asset
(it ships in `public/`).

## Project Status & Roadmap

**Done**

- All 8 levels fully authored and SQL-verified (SELECT/WHERE through CTEs and window
  functions), each ending in the one Devgarh conspiracy.
- Data-driven tutorial engine with all 16 concepts `available` and verified exercises.
- Progress persistence, sequential unlocking, profile dossier + skill matrix.
- Verification harness (96/96), Vitest suite (283 tests), ESLint flat config.

**Planned**

- Landing page → dashboard restyle.

The curriculum is complete and playable end to end; every case and every tutorial
concept is unlocked in sequence as the player advances.

## Credits & License

- SQL engine: [sql.js](https://github.com/sql-js/sql.js)
- Auth: [Clerk](https://clerk.com)
- UI: [shadcn/ui](https://ui.shadcn.com), [lucide](https://lucide.dev),
  [framer-motion](https://www.framer.com/motion/)

Story, characters, and the city of Devgarh are fictional. No license file is
currently included in this repository; add one before public distribution.







