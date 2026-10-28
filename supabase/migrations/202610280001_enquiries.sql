-- Clear any transaction left aborted by a previous failed attempt.
rollback;
begin;

-- Safe to run after the initial table/policies from the setup conversation.
create table if not exists public.enquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  data jsonb not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  sheet_synced_at timestamptz
);
create index if not exists enquiries_created on public.enquiries(created_at desc, id desc);
create index if not exists enquiries_pending on public.enquiries(created_at) where sheet_synced_at is null;
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;
grant select on public.enquiries to authenticated;
grant update (status) on public.enquiries to authenticated;
grant all on public.enquiries to service_role;
drop policy if exists "Admin can read enquiries" on public.enquiries;
create policy "Admin can read enquiries" on public.enquiries for select to authenticated
using ((select auth.uid()) = '6e82755f-6036-40a6-b257-354c3530c8af'::uuid);
drop policy if exists "Admin can update enquiry status" on public.enquiries;
create policy "Admin can update enquiry status" on public.enquiries for update to authenticated
using ((select auth.uid()) = '6e82755f-6036-40a6-b257-354c3530c8af'::uuid)
with check ((select auth.uid()) = '6e82755f-6036-40a6-b257-354c3530c8af'::uuid);

create table if not exists public.enquiry_limits (
  bucket text primary key,
  hits integer not null,
  resets_at timestamptz not null
);
create index if not exists enquiry_limits_expiry on public.enquiry_limits(resets_at);
alter table public.enquiry_limits enable row level security;
revoke all on public.enquiry_limits from anon, authenticated;
grant all on public.enquiry_limits to service_role;

create or replace function public.consume_enquiry_limit(bucket_key text, max_hits integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare hit_count integer;
begin
  delete from public.enquiry_limits where resets_at < now() - interval '1 day';
  insert into public.enquiry_limits as limits (bucket, hits, resets_at)
  values (bucket_key, 1, now() + interval '15 minutes')
  on conflict (bucket) do update set
    hits = case when limits.resets_at <= now() then 1 else limits.hits + 1 end,
    resets_at = case when limits.resets_at <= now() then now() + interval '15 minutes' else limits.resets_at end
  returning hits into hit_count;
  return hit_count <= max_hits;
end;
$$;
revoke all on function public.consume_enquiry_limit(text, integer) from public, anon, authenticated;
grant execute on function public.consume_enquiry_limit(text, integer) to service_role;

create table if not exists public.enquiry_sync_state (
  id integer primary key check (id = 1),
  locked_until timestamptz not null default '-infinity',
  last_success_at timestamptz,
  last_error text
);
insert into public.enquiry_sync_state(id) values (1) on conflict do nothing;
alter table public.enquiry_sync_state enable row level security;
revoke all on public.enquiry_sync_state from anon, authenticated;
grant all on public.enquiry_sync_state to service_role;

create or replace function public.acquire_enquiry_sync()
returns boolean language sql security definer set search_path = '' as '
  with acquired as (
    update public.enquiry_sync_state
    set locked_until = now() + interval ''5 minutes''
    where id = 1 and locked_until < now()
    returning id
  )
  select exists(select 1 from acquired);
';
revoke all on function public.acquire_enquiry_sync() from public, anon, authenticated;
grant execute on function public.acquire_enquiry_sync() to service_role;

commit;
