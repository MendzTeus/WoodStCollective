-- F-01: live Airbnb calendar cache must exist and be readable.
-- Public clients may read booked dates; writes are reserved for service-role
-- sync jobs, which bypass RLS.

create table if not exists public.calendar_cache (
  room_id text primary key,
  booked_dates text[] not null default '{}',
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint calendar_cache_valid_room
    check (room_id in (
      'classic-en-suite',
      'city-view-studio',
      'penthouse-suite',
      'loft-residency',
      'master-suite',
      'executive-studio'
    )),
  constraint calendar_cache_reasonable_size
    check (cardinality(booked_dates) <= 5000)
);

alter table public.calendar_cache
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.calendar_cache
  drop constraint if exists calendar_cache_valid_room;

alter table public.calendar_cache
  add constraint calendar_cache_valid_room
  check (room_id in (
    'classic-en-suite',
    'city-view-studio',
    'penthouse-suite',
    'loft-residency',
    'master-suite',
    'executive-studio'
  ));

alter table public.calendar_cache
  drop constraint if exists calendar_cache_reasonable_size;

alter table public.calendar_cache
  add constraint calendar_cache_reasonable_size
  check (cardinality(booked_dates) <= 5000);

drop trigger if exists set_calendar_cache_updated_at on public.calendar_cache;
create trigger set_calendar_cache_updated_at
before update on public.calendar_cache
for each row execute function private.set_updated_at();

alter table public.calendar_cache enable row level security;

revoke all on public.calendar_cache from anon, authenticated;
grant select (room_id, booked_dates, synced_at) on public.calendar_cache to anon, authenticated;

drop policy if exists "Public can read calendar cache" on public.calendar_cache;
create policy "Public can read calendar cache"
on public.calendar_cache
for select
to anon, authenticated
using (true);
