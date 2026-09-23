-- KORA: eventos anônimos de uso (sem dados pessoais)
create table if not exists public.events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  museum text not null check (museum in ('masp','ims','mam','hub')),
  type text not null check (char_length(type) <= 40),
  path text check (char_length(path) <= 120),
  artwork_id text check (char_length(artwork_id) <= 80),
  session_id text not null check (char_length(session_id) <= 40),
  device text check (device in ('totem','mobile','desktop')),
  lang text check (lang in ('pt','en','es')),
  value numeric
);
create index if not exists events_created_idx on public.events (created_at desc);
create index if not exists events_museum_idx on public.events (museum, created_at desc);

alter table public.events enable row level security;

drop policy if exists "anon insert events" on public.events;
create policy "anon insert events" on public.events for insert to anon, authenticated with check (true);

drop policy if exists "anon read events" on public.events;
create policy "anon read events" on public.events for select to anon, authenticated using (created_at > now() - interval '30 days');

-- tempo real para o painel
do $$ begin
  alter publication supabase_realtime add table public.events;
exception when duplicate_object then null; end $$;
