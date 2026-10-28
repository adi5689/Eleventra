# Eleventra Career Architects

React, Vite and Tailwind CSS website with Supabase enquiry storage, staff authentication, and Google Sheets integration.

## Run locally

```sh
npm install
cp -n .env.example .env.local
```

For a new checkout, fill in the Supabase project URL and publishable key in `.env.local` before running `npm run dev`. If `.env.local` already exists, keep its configured values.

```sh
npm run dev
```

Open http://127.0.0.1:5173. Staff sign in at `/admin` with their Supabase email and password. Staff sessions are held in memory; reloading requires sign-in.

## Commands

- `npm run build`: create the production site in `dist/`.
- `npm run preview`: preview the production build locally.
- `npm run lint`: check JavaScript and React code.
- `npm test`: test the Supabase frontend adapter.
- `npm run test:edge`: type-check and test the hosted function with mocked network calls using Deno.

## Structure

```text
src/components/       Shared navigation, footer and content cards
src/pages/            Public pages and staff dashboard
src/data/             Career catalogue, packages and site content
src/lib/              Supabase client and enquiry transport
supabase/functions/   Validated submissions and Google Sheets sync
supabase/migrations/  Database access policies, rate limits and sync lease
supabase/schedule-sync.sql  Optional scheduled Sheets retry
public/assets/        Local images and logos
tests/                Adapter, Edge Function and database policy checks
docs/                 Setup, verification and visual evidence
```

## Deploy

Deploy the frontend to Vercel using the included `vercel.json`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as Vercel environment variables. Contact submissions use the Supabase Edge Function; staff queries and status updates use database Row Level Security.

Follow [Supabase setup](docs/supabase-setup.md) and [Google Sheets setup](docs/google-sheets-setup.md). Store private function credentials in Supabase, never in frontend variables. Private local backups and credential files remain ignored by Git.

The site includes searchable careers, service-specific contact links, accessible validation, responsive layouts, and protected enquiry management. Placeholder contact details, testimonials and policy text still need production content. Earlier visual checks are in [validation notes](docs/validation.md); current backend checks are in [Supabase verification](docs/supabase-validation.md).
