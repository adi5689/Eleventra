-- Optional: run AFTER the function is deployed and Google Sheets works.
-- Replace the token below with the same private value as CRON_SECRET.
-- Do not commit the filled-in version or share that value.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

select vault.create_secret('REPLACE_WITH_YOUR_CRON_SECRET', 'eleventra_cron_secret');

-- Re-running the schedule replaces the job with this name.
select cron.schedule(
  'eleventra-sheets-retry',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://ytqazkdjrnsjpuneotkf.supabase.co/functions/v1/enquiries',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'eleventra_cron_secret')
    ),
    body := '{"action":"sync"}'::jsonb,
    timeout_milliseconds := 120000
  );
  $$
);
