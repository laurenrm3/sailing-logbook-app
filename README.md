# Sailing Logbook

A full-stack app for logging sailing trips and tracking crew — built with Next.js, TypeScript, and Prisma.

## Stack

- Next.js (App Router) + TypeScript
- Prisma 6 + SQLite
- NextAuth (email-based session, no password)
- Tailwind CSS

## Features

- Email-based login (NextAuth credentials provider)
- Log trips: date, boat name, duration, distance, conditions, notes
- Add and select crew members per trip (many-to-many relation)
- Trip list, trip detail, and delete
- Home dashboard with summary stats (total trips, hours, most frequent crew)

## Setup

```bash
npm install
cp .env.example .env
# generate a real value for NEXTAUTH_SECRET and paste it into .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Then visit http://localhost:3000, log in with any email (no password needed),
and start logging trips.

## Project structure

- `prisma/schema.prisma` — data models: `User`, `Trip`, `CrewMember` (and NextAuth's `Account`/`Session`/`VerificationToken`)
- `lib/prisma.ts` — Prisma client singleton
- `app/api/auth/[...nextauth]/route.ts` — auth config
- `app/api/trips/`, `app/api/crew/` — REST API routes
- `app/trips/`, `app/crew/`, `app/login/` — pages
- `app/nav.tsx`, `app/providers.tsx` — shared layout pieces

## Notes on the data model

`Trip` and `CrewMember` have an implicit many-to-many relation (a trip can
have multiple crew members, and a crew member can appear on multiple
trips). Crew members are shared across all users in this version — there's
no per-user crew list, since this was built as a single-user personal
logbook.
