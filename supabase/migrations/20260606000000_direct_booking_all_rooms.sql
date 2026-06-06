-- Expand direct booking from Room 6-only to all Wood Street rooms.

alter table public.direct_booking_requests
  drop constraint if exists direct_booking_requests_room6_only;

alter table public.direct_booking_rates
  drop constraint if exists direct_booking_rates_room6_only;

alter table public.direct_bookings
  drop constraint if exists direct_bookings_room6_only;

alter table public.direct_booking_requests
  add constraint direct_booking_requests_valid_room
  check (room_id in (
    'classic-en-suite',
    'city-view-studio',
    'penthouse-suite',
    'loft-residency',
    'master-suite',
    'executive-studio'
  ));

alter table public.direct_booking_rates
  add constraint direct_booking_rates_valid_room
  check (room_id in (
    'classic-en-suite',
    'city-view-studio',
    'penthouse-suite',
    'loft-residency',
    'master-suite',
    'executive-studio'
  ));

alter table public.direct_bookings
  add constraint direct_bookings_valid_room
  check (room_id in (
    'classic-en-suite',
    'city-view-studio',
    'penthouse-suite',
    'loft-residency',
    'master-suite',
    'executive-studio'
  ));

alter table public.direct_booking_requests
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists terms_accepted_at timestamptz;

insert into public.direct_booking_rates (
  room_id,
  nightly_rate_pence,
  cleaning_fee_pence,
  min_nights,
  enabled
)
values
  ('classic-en-suite', 10000, 0, 2, false),
  ('city-view-studio', 10000, 0, 2, false),
  ('penthouse-suite', 10000, 0, 2, false),
  ('loft-residency', 10000, 0, 2, false),
  ('master-suite', 10000, 0, 2, false),
  ('executive-studio', 10000, 0, 2, true)
on conflict (room_id) do update
set
  nightly_rate_pence = case
    when public.direct_booking_rates.nightly_rate_pence = 0 then excluded.nightly_rate_pence
    else public.direct_booking_rates.nightly_rate_pence
  end,
  cleaning_fee_pence = case
    when public.direct_booking_rates.cleaning_fee_pence = 0 then excluded.cleaning_fee_pence
    else public.direct_booking_rates.cleaning_fee_pence
  end,
  min_nights = greatest(public.direct_booking_rates.min_nights, excluded.min_nights),
  updated_at = now();

drop policy if exists "Public can create Room 6 booking requests" on public.direct_booking_requests;
drop policy if exists "Public can create direct booking requests" on public.direct_booking_requests;

create policy "Public can create direct booking requests"
on public.direct_booking_requests
for insert
to anon, authenticated
with check (
  room_id in (
    'classic-en-suite',
    'city-view-studio',
    'penthouse-suite',
    'loft-residency',
    'master-suite',
    'executive-studio'
  )
  and status = 'pending_review'
  and source_domain = 'woodstreetcollective.com'
  and check_out > check_in
  and guest_count between 1 and 1
);
