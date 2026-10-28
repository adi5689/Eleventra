# Google Sheets integration

The Supabase Edge Function saves each enquiry before attempting Google Sheets sync. A Google failure leaves the record pending for retry; staff can still manage it in the dashboard.

## Credentials

1. Enable the Google Sheets API in your Google Cloud project.
2. Create or reuse a service account and its private JSON key.
3. Share the spreadsheet with the key's `client_email`, granting Editor access. Keep general sharing restricted.
4. In Supabase > Edge Functions > Secrets, add:
   - `GOOGLE_SERVICE_ACCOUNT_JSON`: the entire private JSON key contents.
   - `GOOGLE_SHEET_ID`: the ID from your spreadsheet URL.
   - `GOOGLE_SHEET_TAB`: `Eleventra enquiries`, or another dedicated empty tab.
5. Deploy the function with `npx supabase functions deploy enquiries --project-ref ytqazkdjrnsjpuneotkf`.
6. Sign in at `/admin`, use Retry sync, and confirm the row and sync status.

Never place the JSON key in `public/`, `src/`, frontend environment variables, or source control. Existing private local keys may be retained for configuring the hosted secret.

## Automatic retries

Set a private `CRON_SECRET` in the function secrets. Open `supabase/schedule-sync.sql`, replace its token placeholder privately with that same value, and run it in the SQL Editor. Keep the filled-in script out of source control. The schedule stores the token in Vault and invokes sync every minute.

Each run processes up to 50 records. A database lease prevents simultaneous sync workers. Enquiry IDs are reconciled with the sheet before appending, so an ambiguous failed response can be retried without duplicating a row. Check Cron history and function logs if pending counts stop decreasing.

## Worksheet behaviour

The sheet receives enquiry ID, UTC submission time, name, parent, phone, email, city, stage, service, interests, and message. RAW input preserves leading-zero phone numbers and prevents formula interpretation. Follow-up status is managed in the dashboard.

Use a dedicated empty worksheet or one with the matching generated headers. Keep headers and enquiry IDs unchanged. The app does not import arbitrary sheet rows or mirror manual sheet edits. A configured secret alone does not prove live Google access; verify a test submission after deployment.
