-- Run only in a disposable local database after applying the migration.
begin;
insert into public.enquiries(id,data) values
('00000000-0000-0000-0000-000000000001','{"student":"Test student"}');

set local role authenticated;
select set_config('request.jwt.claim.sub','6e82755f-6036-40a6-b257-354c3530c8af',true);
do $$ begin
  assert (select count(*) from public.enquiries) = 1, 'Admin must see enquiry';
  update public.enquiries set status='contacted';
  assert (select status from public.enquiries limit 1) = 'contacted';
  begin
    update public.enquiries set data='{}';
    raise exception 'Data update must be denied';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.enquiries(id,data) values(gen_random_uuid(),'{}');
    raise exception 'Direct authenticated inserts must be denied';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.acquire_enquiry_sync();
    raise exception 'Staff must not acquire service-only sync lease';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',true);
do $$ begin
  assert (select count(*) from public.enquiries) = 0, 'Other users must see no enquiries';
  update public.enquiries set status='closed';
  assert not found, 'Other users must not update enquiries';
end $$;

reset role;
set local role anon;
do $$ begin
  begin
    perform count(*) from public.enquiries;
    raise exception 'Anonymous reads must be denied';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;
set local role service_role;
do $$ begin
  assert public.consume_enquiry_limit('test',2);
  assert public.consume_enquiry_limit('test',2);
  assert not public.consume_enquiry_limit('test',2), 'Third call must be rate limited';
  update public.enquiry_limits set resets_at=now()-interval '1 minute' where bucket='test';
  assert public.consume_enquiry_limit('test',2), 'Expired bucket must reset';
  assert public.acquire_enquiry_sync(), 'First worker acquires lease';
  assert not public.acquire_enquiry_sync(), 'Concurrent worker must not acquire lease';
  update public.enquiry_sync_state set locked_until=now()-interval '1 minute' where id=1;
  assert public.acquire_enquiry_sync(), 'Expired lease must be recoverable';
end $$;
rollback;
