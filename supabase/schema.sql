-- Схема для Supabase: выполнить в SQL Editor один раз.
create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  nick text not null check (nick ~ '^[A-Za-z][A-Za-z0-9_-]{1,23}$'),
  name text not null check (char_length(btrim(name)) between 1 and 50),
  telegram text not null check (telegram ~ '^[A-Za-z][A-Za-z0-9_]{4,31}$'),
  direction text not null default '' check (direction in ('', 'backend', 'frontend', 'mobile', 'gamedev', 'devops', 'data', 'ai', 'security', 'qa', 'analytics', 'uxui', 'pm', 'bioinf')),
  bio text not null default '' check (char_length(bio) <= 600),
  interests text[] not null default '{}' check (interests <@ array['games', 'esports', 'boardgames', 'chess', 'films', 'series', 'anime', 'manga', 'cosplay', 'music', 'musicmaking', 'podcasts', 'books', 'art', 'photography', 'dance', 'creativity', 'languages', 'speaking', 'science', 'technology', 'pc', 'electronics', 'robotics', 'printing3d', 'linux', 'ai', 'sport', 'gym', 'running', 'swimming', 'football', 'tennis', 'martialarts', 'cycling', 'hiking', 'travel', 'cars', 'cooking', 'pets', 'investing', 'startups']),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  cancel_token text not null default replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now()
);

create unique index if not exists people_nick_key on public.people (lower(nick));
create index if not exists people_created_idx on public.people (created_at desc);

alter table public.people enable row level security;

drop policy if exists "people read approved" on public.people;
drop policy if exists "people submit pending" on public.people;
drop policy if exists "people cancel own" on public.people;
drop policy if exists "people edit own" on public.people;

-- Токен заявки приезжает в заголовке x-s21-token: без регистрации это единственное
-- доказательство авторства, поэтому сверяется внутри политики, а не фильтром клиента.
create policy "people read approved" on public.people
  for select to anon, authenticated
  using (
    status = 'approved'
    or cancel_token = nullif(current_setting('request.headers', true)::json ->> 'x-s21-token', '')
  );

create policy "people submit pending" on public.people
  for insert to anon, authenticated
  with check (status = 'pending');

create policy "people cancel own" on public.people
  for delete to anon, authenticated
  using (
    status <> 'approved'
    and cancel_token = nullif(current_setting('request.headers', true)::json ->> 'x-s21-token', '')
  );

-- Правка своей заявки до одобрения: после сохранения строка снова pending.
create policy "people edit own" on public.people
  for update to anon, authenticated
  using (
    status <> 'approved'
    and cancel_token = nullif(current_setting('request.headers', true)::json ->> 'x-s21-token', '')
  )
  with check (status = 'pending');

-- Ник, дата и токен — идентификаторы заявки: автору они не принадлежат на изменение.
-- Триггер смотрит на роль, чтобы модерация из дашборда осталась свободной.
create or replace function public.people_edit_guard() returns trigger language plpgsql as $$
begin
  if current_user in ('anon', 'authenticated')
    and (new.nick <> old.nick or new.created_at <> old.created_at or new.cancel_token <> old.cancel_token) then
    raise exception 'nick, created_at and cancel_token are immutable';
  end if;
  return new;
end $$;

drop trigger if exists people_edit_guard on public.people;
create trigger people_edit_guard before update on public.people
  for each row execute function public.people_edit_guard();

revoke all on public.people from anon, authenticated;
grant select, insert, update, delete on public.people to anon, authenticated;

-- Модерация (SQL Editor):
-- select id, nick, name, telegram, created_at from public.people where status = 'pending' order by created_at;
-- update public.people set status = 'approved' where id = 'UUID';
-- update public.people set status = 'rejected' where id = 'UUID';
