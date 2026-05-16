-- Calendar cache table: stores pre-computed booked dates per room.
-- Written by the server-side sync script using the service role key.
-- Public (anon) can read; only service role can write (bypasses RLS).

create table if not exists public.calendar_cache (
  room_id text primary key,
  booked_dates text[] not null default '{}',
  synced_at timestamptz not null default now()
);

alter table public.calendar_cache enable row level security;

create policy "Public can read calendar cache"
on public.calendar_cache
for select
to anon, authenticated
using (true);
