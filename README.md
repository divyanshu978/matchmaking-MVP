# Matchmaking Dashboard (MVP)

A lightweight internal matchmaking dashboard MVP built with Next.js, TypeScript, Tailwind CSS and static JSON data.

## Quick overview
- Purpose: internal CRM-style dashboard for matchmaking teams to view candidate profiles, add notes, and generate AI-assisted compatibility explanations and introductions.
- Data: static JSON seed at `src/data/seed-data.json` (generated from a provided CSV). The app runs without a database.
- AI: Gemini (Google) integration via `GEMINI_API_KEY` — used to generate explanations and introductions.

## Features
- Authentication (demo account)
- Dashboard with search, filter, sort, and basic stats
- Customer profile pages with notes and suggestions
- Notes: create and update notes (in-memory store)
- Match engine: rule-based scoring + AI explanations
- API routes for AI (`/api/ai/explanation`, `/api/ai/introduction`)

## Tech stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Gemini (`@google/generative-ai`) for AI copy generation

## Prerequisites
- Node.js (>=18 recommended)
- npm

## Install & run
1. Install dependencies

```bash
npm install
```

2. Create an `.env` file from `.env.example` and add your `GEMINI_API_KEY`:

```text
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret
DEMO_LOGIN_EMAIL=matchmaker@agency.com
DEMO_LOGIN_PASSWORD=matchmaker123
```

3. Run in development

```bash
npm run dev
```

4. Build / Start

```bash
npm run build
npm run start
```

## Useful scripts
- `npm run dev` — Start Next.js in development
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npx tsx scripts/run-matches.ts` — Run the offline matching runner that evaluates matches for the first few customers and prints results

Note: a CSV importer was used to generate `src/data/seed-data.json` originally. If you need to re-import from CSV, you can add a script to parse your CSV and write `src/data/seed-data.json`.

## Data flow
- `src/data/seed-data.json` — static seed data used at runtime
- `src/lib/store.ts` — in-memory store built from the seed JSON (provides `getCustomers`, `getNotesByCustomerId`, `addNote`, `getMatchesByCustomerId`, etc.)
- `src/lib/match-engine.ts` — evaluator that scores candidate matches
- `src/lib/suggestions.ts` — builds suggestions and calls AI for explanations and introductions

## AI integration
- AI wrapper: `src/lib/ai.ts` — uses `@google/generative-ai` and `GEMINI_API_KEY`.
- API routes: `src/app/api/ai/explanation/route.ts` and `src/app/api/ai/introduction/route.ts`.

## Important files & structure

- App
  - `src/app/layout.tsx` — root layout
  - `src/app/dashboard/page.tsx` — dashboard
  - `src/app/customers/[customerId]/page.tsx` — customer profile page

- Data & store
  - `src/data/seed-data.json` — static data source (customers, users — notes/matches may be empty)
  - `src/lib/store.ts` — runtime in-memory store built from seed JSON

- Logic
  - `src/lib/types.ts` — central TypeScript types
  - `src/lib/match-engine.ts` — scoring rules
  - `src/lib/suggestions.ts` — AI suggestion builder
  - `src/lib/ai.ts` — Gemini wrapper

- UI
  - `src/components/dashboard/*` — dashboard components
  - `src/components/customer/*` — profile and client components

## Notes & troubleshooting
- If you see hydration mismatch warnings in dev about extension-injected attributes (e.g. `cz-shortcut-listen`), they are typically caused by browser extensions. The root layout includes a hydration suppression on `<body>` so this does not break the UI.
- The app uses an in-memory store. Data modifications (notes/matches) are not persisted to disk — restart will reset the runtime state to `src/data/seed-data.json`.
- If AI responses return fallback text, verify `GEMINI_API_KEY` is set and valid.

## Next steps / Improvements
- Re-introduce a CSV import script (if you want regeneratable seed data from source CSV)
- Add persistence (Postgres/Prisma) for production-ready storage
- Improve match-engine rules, tuning, and add tests
- Add pagination and export features

## License
This project is an internal MVP scaffold (no license specified).

---

If you want, I can also: add a `README` section showing how to regenerate `src/data/seed-data.json` from your CSV, or create a simple CLI import script that maps your CSV columns to the `Customer` type.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
