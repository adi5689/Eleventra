# Supabase setup

The website uses Supabase directly. Development only needs the Vite frontend.

## Frontend

Set these values in `.env.local` locally and in Vercel environment variables for deployment:

```env
VITE_SUPABASE_URL=https://ytqazkdjrnsjpuneotkf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
```

Run `npm run dev`. Keep private service-role and Google credentials out of `VITE_*` variables.

## Database and staff access

Run `supabase/migrations/202610280001_enquiries.sql` in the SQL Editor when setting up a project. It is repeatable and preserves enquiry rows. Only staff user `6e82755f-6036-40a6-b257-354c3530c8af` can read enquiries and update their status. Other users cannot access records. Public inserts are forbidden; submissions pass through the validated function.

Disable public signup in Supabase Auth. Staff use their Supabase email and password at `/admin`. Sessions remain in memory, so reloading requires signing in again.

## Function secrets

Configure these in Supabase > Edge Functions > Secrets:

| Name | Value |
| --- | --- |
| `APP_ORIGINS` | Comma-separated exact website origins; locally `http://127.0.0.1:5173,http://localhost:5173` |
| `RATE_LIMIT_SALT` | A private random value generated with `openssl rand -hex 32` |
| `CRON_SECRET` | A different private random value generated the same way |
| `GOOGLE_SHEET_ID` | Spreadsheet ID, when connecting Sheets |
| `GOOGLE_SHEET_TAB` | Dedicated worksheet name, normally `Eleventra enquiries` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Entire service-account JSON, when connecting Sheets |

Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` automatically. Enquiries remain saved and pending until Sheets is configured.

## Function deployment

```sh
npx supabase login
npx supabase functions deploy enquiries --project-ref ytqazkdjrnsjpuneotkf
```

The config disables gateway JWT verification because visitor submissions are public. Staff actions independently verify user JWTs and the exact staff ID. A private cron token permits sync only. The function applies origin checks, body limits, schema validation, a honeypot, and database-backed IP/email/global limits. Origin checks alone do not authenticate bots; monitor abuse.

See [Google Sheets setup](google-sheets-setup.md) for Google credentials and scheduled retries.

## Verify

1. Submit a clearly marked test enquiry through `/contact`.
2. Sign in at `/admin` and find it once in the list.
3. Check search, filters, pagination, and status updates.
4. Sign out and verify the dashboard requires authentication.
5. Verify another authenticated account cannot read enquiries.
6. After configuring Sheets, check the row and sync status; use Retry sync if needed.

## Vercel

Use Vite, Node 24, build command `npm run build`, and output directory `dist`. Add the two frontend environment variables above, then redeploy. The included `vercel.json` provides SPA routing and security headers.

Add the exact Vercel/custom domain origin to `APP_ORIGINS` and update Auth > URL Configuration. Redeploy the function after changing its secrets to load the updated origins. Preview origins must be added explicitly if they need enquiry access. The CSP in `vercel.json` permits this Supabase project and Google Fonts; update it if changing projects.

Private local backup files are not application dependencies and are excluded from Git and Vite file serving.

## Home contact widget

The home page's Contact tab submits name, email, phone and interest area to the same enquiries function and database used by the full contact form. The staff dashboard lists these enquiries with the selected service; current level is shown as “Not provided”. No database migration is required.

Deploy the updated `enquiries` function before using the widget: its schema now permits an omitted current level. Existing full contact form submissions remain supported. The widget reports success only after the function confirms storage; failed submissions retain the entered details for retry.

The “Home widget” dashboard tab filters on `data.source = "home-widget"`. Deploy the current `validation.ts`, including `source: z.enum(["contact-form", "home-widget"]).default("contact-form")`, as well as the optional stage change. Existing records remain visible in All enquiries.
