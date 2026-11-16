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
      and a.attname = 'direction'
  loop
    execute format('alter table public.people drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.people
  add constraint people_direction_check
    check (direction in ('', 'backend', 'frontend', 'mobile', 'gamedev', 'devops', 'data', 'ai', 'technopreneur', 'security', 'qa', 'analytics', 'uxui', 'pm', 'product', 'bioinf'));

commit;
