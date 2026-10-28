# Supabase verification

Current architecture: React/Vite on the frontend; Supabase Auth, Postgres and the enquiries Edge Function for data and integrations.

## Cleanup checks — 28 October 2026

- `npm run lint`: passes.
- `npm test`: all five Supabase adapter tests pass, covering access checks, submission dispatch, HTTP errors, search/pagination, and invalid status updates.
- `npm run build`: passes with Supabase as the sole data provider.
- Edge Function tests also pass after cleanup: one Deno test with four security/submission checks.
- Legacy backend files, setup/export scripts, their tests, API proxy, fallback provider selection, and unused CSRF headers are removed. The dependency cleanup removed 114 installed packages.
- Private credential files, local database backups and the existing data export were preserved; they remain ignored by Git and blocked by Vite file serving.

## Migration checks

The Edge Function previously passed Deno type checking and four mocked-network runtime checks: input/origin/body limits, JWT/admin access, duplicate/conflicting submissions, and rate limits/cron scope. The database migration was applied twice in disposable PostgreSQL 17; tests verified staff-only RLS, column privileges, direct-insert denial, service-only RPCs, rate resets and sync leases.

The deployed function was checked without creating records: invalid input returned 400, and unauthenticated staff access returned 401 with the expected local origin. The user confirmed a contact submission and admin dashboard check after switching to Supabase.

Live Google Sheets access, scheduled retries, and Vercel deployment are still separate setup steps and have not been confirmed. See [setup](supabase-setup.md) and [Google Sheets](google-sheets-setup.md).

## Self-review

| Axis | Score | Evidence and limitation |
| --- | --- | --- |
| Accuracy | 4/5 | Build, lint and five adapter tests pass; a live authenticated browser flow was not repeated during this cleanup. |
| Completeness | 4/5 | Obsolete code, dependencies, config and guides are removed; private data backups are deliberately preserved. |
| Clarity | 4/5 | README and setup guides now describe one architecture; visual evidence remains labeled historical. |
| Actionability | 4/5 | Development uses `npm run dev`; environment examples contain only the two frontend values; hosted integrations still require their separate secret configuration. |
| Conciseness | 4/5 | Removed the unused transport wrapper and fallback logic; the request-shaped adapter remains to reuse the existing UI and tests. |

Overall: 4.0/5. Future verification should confirm Google Sheets retries and Vercel domain configuration. Would the user agree? The obsolete application code is removed without deleting private records or claiming untested integrations work.
