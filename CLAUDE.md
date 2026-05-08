# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

The Next.js application lives entirely in `next-app/`. All commands below should be run from `next-app/`.

## Commands

```bash
cd next-app

# Development
npm run dev          # Start dev server with Turbopack at localhost:3000

# Build & Production
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma generate  # Regenerate Prisma client (also runs on postinstall)
npx prisma migrate dev --name <name>  # Create and apply a new migration
npx prisma studio    # Open Prisma Studio GUI
```

No test framework is configured in this project.

## Environment Variables

Required in `next-app/.env.local`:

```
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_SECRET=<random-secret>
GOOGLE_CLIENT_ID=<google-oauth-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
GITHUB_CLIENT_ID=<github-oauth-id>
GITHUB_CLIENT_SECRET=<github-oauth-secret>
GROQ_API_KEY=<grok-api-key>
```

## Architecture

**Framework**: Next.js 15 App Router with React 19 and TypeScript strict mode.

**Path alias**: `@/*` maps to `next-app/*` (root of the Next.js project).

### Data Flow

The primary data source is a pre-computed CSV at `public/exoplanet_scores_Final.csv`. The `/api/exoplanets` route reads and paginates this file using `csv-parser`. There is no live NASA/ESA data fetching — the README describes future aspirations, not current implementation.

User-specific data (profile, discoveries) is stored in PostgreSQL via Prisma. Authentication is handled by NextAuth v4 with Google OAuth, GitHub OAuth, and email/password (Credentials provider).

The `/api/ai/generate-content` route calls Google Gemini 2.0 Flash to generate habitability summaries and image prompt descriptions for a given planet's data.

### Route Protection

`middleware.ts` guards `/dashboard` and `/profile` routes using NextAuth JWT validation, redirecting unauthenticated users to `/signin?callbackUrl=...`.

### Key Directories

- `app/` — Next.js App Router pages and API routes
- `app/api/` — Serverless API routes (auth, data, exoplanets, ai, user, register)
- `app/dashboard/` — Protected dashboard pages; `exoplanet/[pl_name]/` is the dynamic planet detail page
- `components/` — All React components; `components/ui/` contains Shadcn/ui primitives
- `lib/` — Shared utilities: `auth.ts` (NextAuth config), `db.ts`/`prisma.ts` (Prisma client singleton), `types.ts`, `utils.ts`
- `hooks/` — Custom React hooks including `use-ai-content.ts` and `useWindowSize.ts`
- `prisma/` — Schema and migrations

### Database Schema

Three models: `User` (with optional profile fields and `specializations` array), `SpecializedFields` (join table for user specializations), `Discovery` (user-saved planet records). Auth providers tracked via `Provider` enum (GOOGLE, GITHUB, CREDENTIALS).

### UI Stack

- **Shadcn/ui** (new-york style) + **Radix UI** primitives for accessible components
- **Tailwind CSS v4** with a custom cosmic theme: colors (`cosmic-dark`, `cosmic-purple`, etc.), fonts (Space Grotesk for display, Inter for body), and glow/float animations
- **Recharts** for data charts; custom SVG components for orbital and planet visualizations
- **Motion** (Framer Motion) for animations
- `reactStrictMode` is disabled in `next.config.ts`
