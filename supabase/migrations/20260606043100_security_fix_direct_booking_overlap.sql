-- F-02: enforce active direct booking date overlap protection in Postgres.
-- This is the atomic guard that prevents concurrent checkouts from creating
-- overlapping holds or paid bookings for the same room.

create extension if not exists btree_gist with schema extensions;

alter table public.direct_bookings
  drop constraint if exists direct_bookings_no_active_overlap;

alter table public.direct_bookings
  add constraint direct_bookings_no_active_overlap
  exclude using gist (
    room_id with =,
    daterange(check_in, check_out, '[)') with &&
  )
  where (status in ('pending_payment', 'confirmed_paid'));
