begin;

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select c.conname
    from pg_constraint c
    join pg_attribute a on a.attrelid = c.conrelid and c.conkey = array[a.attnum]
    where c.conrelid = 'public.people'::regclass
      and c.contype = 'c'
      and a.attname = 'telegram'
  loop
    execute format('alter table public.people drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.people
  alter column telegram set default '',
  add constraint people_telegram_check
    check (telegram = '' or telegram ~ '^[A-Za-z][A-Za-z0-9_]{4,31}$');

commit;
