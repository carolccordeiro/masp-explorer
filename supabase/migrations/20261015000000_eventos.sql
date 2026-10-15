-- KORA: eventos nos lugares (visitas guiadas, oficinas, palestras), com inscrição por apelido,
-- vagas, patrocinador e propostas de patrocínio enviadas pelas marcas.

create table if not exists public.venue_events (
  id text primary key default substr(md5(gen_random_uuid()::text), 1, 12),
  venue text not null check (venue in ('masp','ims','mam','ibirapuera','aquario')),
  kind text not null check (kind in ('visita','oficina','palestra','familia','acessivel','outro')),
  title text not null check (char_length(title) between 3 and 90),
  description text check (char_length(description) <= 400),
  starts_at timestamptz not null,
  duration_min int not null default 60 check (duration_min between 15 and 480),
  meeting_point text check (char_length(meeting_point) <= 90),
  capacity int not null default 20 check (capacity between 1 and 500),
  price text check (char_length(price) <= 40),
  lang text check (char_length(lang) <= 20),
  sponsor text check (char_length(sponsor) <= 60),
  sponsor_color text check (sponsor_color ~ '^#[0-9a-fA-F]{6}$'),
  sponsor_offer text check (char_length(sponsor_offer) <= 120),
  created_at timestamptz not null default now()
);
create index if not exists venue_events_idx on public.venue_events (venue, starts_at);

create table if not exists public.event_signups (
  event_id text not null references public.venue_events(id) on delete cascade,
  member_key text not null,
  nick text check (char_length(nick) <= 24),
  created_at timestamptz not null default now(),
  primary key (event_id, member_key)
);

create table if not exists public.sponsor_proposals (
  id bigint generated always as identity primary key,
  venue text not null check (venue in ('masp','ims','mam','ibirapuera','aquario')),
  brand text not null check (char_length(brand) between 2 and 60),
  brand_color text check (brand_color ~ '^#[0-9a-fA-F]{6}$'),
  contact text not null check (char_length(contact) between 5 and 120),
  kind text not null,
  title text not null check (char_length(title) between 3 and 90),
  description text check (char_length(description) <= 400),
  wanted_at timestamptz,
  capacity int check (capacity between 1 and 500),
  offer text check (char_length(offer) <= 120),
  status text not null default 'pendente' check (status in ('pendente','aprovada','recusada')),
  created_at timestamptz not null default now()
);

alter table public.venue_events enable row level security;
alter table public.event_signups enable row level security;
alter table public.sponsor_proposals enable row level security;

create or replace view public.venue_events_public with (security_invoker = false) as
  select e.id, e.venue, e.kind, e.title, e.description, e.starts_at, e.duration_min, e.meeting_point, e.capacity, e.price, e.lang,
         e.sponsor, e.sponsor_color, e.sponsor_offer,
         (select count(*) from public.event_signups s where s.event_id = e.id)::int as signups
  from public.venue_events e
  where e.starts_at > now() - interval '3 hours' and e.starts_at < now() + interval '60 days';
grant select on public.venue_events_public to anon, authenticated;

-- inscrição: respeita as vagas
create or replace function public.event_signup(p_id text, p_key text, p_nick text, p_on boolean) returns int language plpgsql security definer set search_path = public as $$
declare v_cap int; v_n int;
begin
  if char_length(p_key) < 16 then raise exception 'chave inválida'; end if;
  if not p_on then
    delete from event_signups where event_id = p_id and member_key = p_key;
  else
    select capacity into v_cap from venue_events where id = p_id and starts_at > now() - interval '30 minutes' for update;
    if v_cap is null then raise exception 'evento indisponível'; end if;
    select count(*) into v_n from event_signups where event_id = p_id;
    if v_n >= v_cap and not exists (select 1 from event_signups where event_id = p_id and member_key = p_key) then raise exception 'lotado'; end if;
    if not kora_text_ok(p_nick) then raise exception 'texto bloqueado'; end if;
    insert into event_signups (event_id, member_key, nick) values (p_id, p_key, left(p_nick, 24))
    on conflict (event_id, member_key) do update set nick = excluded.nick;
  end if;
  return (select count(*) from event_signups where event_id = p_id);
end $$;

create or replace function public.my_events(p_key text) returns setof text language sql security definer set search_path = public as $$
  select event_id from event_signups where member_key = p_key;
$$;

-- proposta de patrocínio (qualquer marca pode enviar; só a equipe do lugar lê)
create or replace function public.propose_event(p_venue text, p_brand text, p_color text, p_contact text, p_kind text, p_title text, p_description text, p_wanted timestamptz, p_capacity int, p_offer text)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_id bigint;
begin
  if (select count(*) from sponsor_proposals where contact = p_contact and created_at > now() - interval '1 hour') >= 5 then raise exception 'muitas propostas'; end if;
  insert into sponsor_proposals (venue, brand, brand_color, contact, kind, title, description, wanted_at, capacity, offer)
  values (p_venue, p_brand, nullif(p_color, ''), p_contact, p_kind, p_title, nullif(p_description, ''), p_wanted, p_capacity, nullif(p_offer, ''))
  returning id into v_id;
  return v_id;
end $$;

-- gestão (código do lugar)
create or replace function public.list_proposals(p_venue text, p_pin text) returns setof public.sponsor_proposals language plpgsql security definer set search_path = public, extensions as $$
begin
  if not check_pin(p_venue, p_pin) then raise exception 'código inválido'; end if;
  return query select * from sponsor_proposals where venue = p_venue order by created_at desc limit 100;
end $$;

create or replace function public.decide_proposal(p_venue text, p_pin text, p_id bigint, p_status text) returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not check_pin(p_venue, p_pin) then raise exception 'código inválido'; end if;
  update sponsor_proposals set status = p_status where id = p_id and venue = p_venue;
end $$;

create or replace function public.upsert_event(p_venue text, p_pin text, p_id text, p jsonb) returns text language plpgsql security definer set search_path = public, extensions as $$
declare v_id text;
begin
  if not check_pin(p_venue, p_pin) then raise exception 'código inválido'; end if;
  if p_id is null or p_id = '' then
    insert into venue_events (venue, kind, title, description, starts_at, duration_min, meeting_point, capacity, price, lang, sponsor, sponsor_color, sponsor_offer)
    values (p_venue, p->>'kind', p->>'title', nullif(p->>'description',''), (p->>'starts_at')::timestamptz, coalesce((p->>'duration_min')::int, 60), nullif(p->>'meeting_point',''),
            coalesce((p->>'capacity')::int, 20), nullif(p->>'price',''), nullif(p->>'lang',''), nullif(p->>'sponsor',''), nullif(p->>'sponsor_color',''), nullif(p->>'sponsor_offer',''))
    returning id into v_id;
  else
    update venue_events set kind = p->>'kind', title = p->>'title', description = nullif(p->>'description',''), starts_at = (p->>'starts_at')::timestamptz,
      duration_min = coalesce((p->>'duration_min')::int, 60), meeting_point = nullif(p->>'meeting_point',''), capacity = coalesce((p->>'capacity')::int, 20),
      price = nullif(p->>'price',''), lang = nullif(p->>'lang',''), sponsor = nullif(p->>'sponsor',''), sponsor_color = nullif(p->>'sponsor_color',''), sponsor_offer = nullif(p->>'sponsor_offer','')
    where id = p_id and venue = p_venue returning id into v_id;
  end if;
  return v_id;
end $$;

create or replace function public.delete_event(p_venue text, p_pin text, p_id text) returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not check_pin(p_venue, p_pin) then raise exception 'código inválido'; end if;
  delete from venue_events where id = p_id and venue = p_venue;
end $$;

grant execute on function public.event_signup, public.my_events, public.propose_event, public.list_proposals, public.decide_proposal, public.upsert_event, public.delete_event to anon, authenticated;
