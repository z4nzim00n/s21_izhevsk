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

revoke all on public.people from anon, authenticated;
grant select, insert, delete on public.people to anon, authenticated;

-- Модерация (SQL Editor):
-- select id, nick, name, telegram, created_at from public.people where status = 'pending' order by created_at;
-- update public.people set status = 'approved' where id = 'UUID';
-- update public.people set status = 'rejected' where id = 'UUID';
