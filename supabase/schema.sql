-- ————————————————————————————————————————————————————————————————
-- Vow · Supabase schema (NOT YET APPLIED — see README "Connect Supabase")
--
-- Access model: the static site holds only the anon key. Row Level
-- Security denies everything; ALL access flows through SECURITY DEFINER
-- RPCs that require a valid per-guest token. Guest data never sits in
-- a table the anon role can read directly.
-- ————————————————————————————————————————————————————————————————

create extension if not exists pgcrypto;

-- ——— guests: the approved list; one row per individual ———
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  token text unique not null default encode(gen_random_bytes(9), 'base64'),
  full_name text not null,
  email text,
  whatsapp text,
  -- per-event tiering: possible, not currently used (all guests → all events)
  invited_events text[] not null default array['all'],
  plus_one_allowed boolean not null default true,
  is_proxy_managed boolean not null default false, -- the phone-less guest
  created_at timestamptz not null default now()
);

-- ——— rsvps: one per guest, editable until the deadline ———
create table if not exists public.rsvps (
  guest_id uuid primary key references public.guests (id) on delete cascade,
  attending boolean not null,
  plus_one_name text,
  dietary text[] not null default '{}', -- vegan | vegetarian | glutenFree | lactoseFree
  allergies text not null default '',
  message text not null default '',
  updated_at timestamptz not null default now()
);

-- ——— photos: uploaded via Storage, moderated before public ———
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests (id) on delete cascade,
  storage_path text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ——— site_content: values that must not live in the public repo ———
-- keys: booking_code, emergency_phone, menu_en, menu_de
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- ——— RLS: deny everything to anon; RPCs are the only door ———
alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.photos enable row level security;
alter table public.site_content enable row level security;

-- ——— RPCs ———

-- Validates a magic-link token; returns the guest's own public fields.
create or replace function public.gate_check(p_token text)
returns table (guest_id uuid, full_name text, plus_one_allowed boolean)
language sql security definer set search_path = public as $$
  select id, full_name, plus_one_allowed
  from guests where token = p_token;
$$;

-- Upserts the guest's own RSVP. Deadline is enforced here, server-side.
create or replace function public.rsvp_upsert(
  p_token text,
  p_attending boolean,
  p_plus_one_name text,
  p_dietary text[],
  p_allergies text,
  p_message text
) returns void
language plpgsql security definer set search_path = public as $$
declare v_guest uuid;
begin
  select id into v_guest from guests where token = p_token;
  if v_guest is null then raise exception 'invalid token'; end if;
  if now() > timestamptz '2026-08-30 23:59:59 Europe/Berlin' then
    raise exception 'rsvp closed';
  end if;
  insert into rsvps (guest_id, attending, plus_one_name, dietary, allergies, message)
  values (v_guest, p_attending, p_plus_one_name, p_dietary, p_allergies, p_message)
  on conflict (guest_id) do update set
    attending = excluded.attending,
    plus_one_name = excluded.plus_one_name,
    dietary = excluded.dietary,
    allergies = excluded.allergies,
    message = excluded.message,
    updated_at = now();
end;
$$;

-- Runtime content (booking code, emergency phone, menu) — token required.
create or replace function public.content_get(p_token text)
returns table (key text, value text)
language sql security definer set search_path = public as $$
  select c.key, c.value from site_content c
  where exists (select 1 from guests g where g.token = p_token);
$$;

-- Lock the RPCs down to the anon/authenticated roles explicitly.
revoke all on function public.gate_check(text) from public;
revoke all on function public.rsvp_upsert(text, boolean, text, text[], text, text) from public;
revoke all on function public.content_get(text) from public;
grant execute on function public.gate_check(text) to anon, authenticated;
grant execute on function public.rsvp_upsert(text, boolean, text, text[], text, text) to anon, authenticated;
grant execute on function public.content_get(text) to anon, authenticated;

-- ——— Storage (run in dashboard or via CLI) ———
-- 1. Create PRIVATE bucket `photos`.
-- 2. Uploads go through an Edge Function that validates the guest token and
--    returns a signed upload URL (browser → Storage direct, no account).
-- 3. A GitHub Action (rclone, scheduled) syncs approved photos to the
--    couple's OneDrive. See .github/workflows/ (added when photos go live).

-- ——— Admin ———
-- The admin panel authenticates via Supabase Auth (email+password, the
-- site owner only) with service-role access mediated by RLS policies
-- `to authenticated` — added together with the /admin build.
