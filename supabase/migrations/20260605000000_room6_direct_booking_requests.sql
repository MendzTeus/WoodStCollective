-- Direct booking MVP for Room 6 only.
-- Public visitors can create booking requests. Admins manage requests,
-- payment links, confirmed bookings, and rates through app_metadata.role.

create schema if not exists private;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.direct_booking_requests (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  status text not null default 'pending_review',
  check_in date not null,
  check_out date not null,
  guest_count integer not null default 1,
  guest_name text not null,
  guest_email text not null,
  guest_phone text,
  message text,
  source_domain text not null default 'woodstreetcollective.com',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint direct_booking_requests_room6_only
    check (room_id = 'executive-studio'),
  constraint direct_booking_requests_valid_status
    check (status in ('pending_review', 'approved', 'declined', 'expired')),
  constraint direct_booking_requests_valid_dates
    check (check_out > check_in),
  constraint direct_booking_requests_valid_guest_count
    check (guest_count between 1 and 1),
  constraint direct_booking_requests_valid_guest_email
    check (guest_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

create table if not exists public.direct_booking_rates (
  room_id text primary key,
  nightly_rate_pence integer not null default 0,
  cleaning_fee_pence integer not null default 0,
  min_nights integer not null default 1,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint direct_booking_rates_room6_only
    check (room_id = 'executive-studio'),
  constraint direct_booking_rates_non_negative
    check (nightly_rate_pence >= 0 and cleaning_fee_pence >= 0),
  constraint direct_booking_rates_valid_min_nights
    check (min_nights between 1 and 365)
);

create table if not exists public.direct_bookings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.direct_booking_requests(id) on delete restrict,
  room_id text not null,
  status text not null default 'pending_payment',
  check_in date not null,
  check_out date not null,
  guest_count integer not null default 1,
  guest_name text not null,
  guest_email text not null,
  guest_phone text,
  total_amount_pence integer not null,
  currency text not null default 'gbp',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  checkout_url text,
  payment_expires_at timestamptz,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint direct_bookings_room6_only
    check (room_id = 'executive-studio'),
  constraint direct_bookings_valid_status
    check (status in ('pending_payment', 'confirmed_paid', 'cancelled', 'refunded')),
  constraint direct_bookings_valid_dates
    check (check_out > check_in),
  constraint direct_bookings_valid_guest_count
    check (guest_count between 1 and 1),
  constraint direct_bookings_amount_non_negative
    check (total_amount_pence >= 0),
  constraint direct_bookings_currency_gbp
    check (currency = 'gbp')
);

create table if not exists public.direct_booking_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.direct_bookings(id) on delete cascade,
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  amount_total_pence integer not null,
  currency text not null default 'gbp',
  status text not null default 'checkout_created',
  checkout_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint direct_booking_payments_valid_status
    check (status in ('checkout_created', 'paid', 'failed', 'expired', 'refunded')),
  constraint direct_booking_payments_amount_non_negative
    check (amount_total_pence >= 0),
  constraint direct_booking_payments_currency_gbp
    check (currency = 'gbp')
);

create table if not exists public.direct_booking_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.direct_booking_requests(id) on delete set null,
  booking_id uuid references public.direct_bookings(id) on delete set null,
  event_type text not null,
  actor text not null default 'system',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.direct_booking_stripe_events (
  stripe_event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

insert into public.direct_booking_rates (
  room_id,
  nightly_rate_pence,
  cleaning_fee_pence,
  min_nights,
  enabled
)
values ('executive-studio', 0, 0, 1, false)
on conflict (room_id) do nothing;

create index if not exists direct_booking_requests_room_dates_idx
on public.direct_booking_requests (room_id, check_in, check_out);

create index if not exists direct_booking_requests_status_created_idx
on public.direct_booking_requests (status, created_at desc);

create index if not exists direct_bookings_room_dates_idx
on public.direct_bookings (room_id, check_in, check_out);

create index if not exists direct_bookings_status_created_idx
on public.direct_bookings (status, created_at desc);

create index if not exists direct_booking_payments_booking_idx
on public.direct_booking_payments (booking_id);

create index if not exists direct_booking_events_request_idx
on public.direct_booking_events (request_id, created_at desc);

create index if not exists direct_booking_events_booking_idx
on public.direct_booking_events (booking_id, created_at desc);

drop trigger if exists set_direct_booking_requests_updated_at on public.direct_booking_requests;
create trigger set_direct_booking_requests_updated_at
before update on public.direct_booking_requests
for each row execute function private.set_updated_at();

drop trigger if exists set_direct_booking_rates_updated_at on public.direct_booking_rates;
create trigger set_direct_booking_rates_updated_at
before update on public.direct_booking_rates
for each row execute function private.set_updated_at();

drop trigger if exists set_direct_bookings_updated_at on public.direct_bookings;
create trigger set_direct_bookings_updated_at
before update on public.direct_bookings
for each row execute function private.set_updated_at();

drop trigger if exists set_direct_booking_payments_updated_at on public.direct_booking_payments;
create trigger set_direct_booking_payments_updated_at
before update on public.direct_booking_payments
for each row execute function private.set_updated_at();

alter table public.direct_booking_requests enable row level security;
alter table public.direct_booking_rates enable row level security;
alter table public.direct_bookings enable row level security;
alter table public.direct_booking_payments enable row level security;
alter table public.direct_booking_events enable row level security;
alter table public.direct_booking_stripe_events enable row level security;

grant insert on public.direct_booking_requests to anon, authenticated;
grant select, update, delete on public.direct_booking_requests to authenticated;
grant select, insert, update, delete on public.direct_booking_rates to authenticated;
grant select, insert, update, delete on public.direct_bookings to authenticated;
grant select, insert, update, delete on public.direct_booking_payments to authenticated;
grant select, insert on public.direct_booking_events to authenticated;

drop policy if exists "Public can create Room 6 booking requests" on public.direct_booking_requests;
drop policy if exists "Admins can read booking requests" on public.direct_booking_requests;
drop policy if exists "Admins can update booking requests" on public.direct_booking_requests;
drop policy if exists "Admins can delete booking requests" on public.direct_booking_requests;

drop policy if exists "Admins can read booking rates" on public.direct_booking_rates;
drop policy if exists "Admins can insert booking rates" on public.direct_booking_rates;
drop policy if exists "Admins can update booking rates" on public.direct_booking_rates;
drop policy if exists "Admins can delete booking rates" on public.direct_booking_rates;

drop policy if exists "Admins can read direct bookings" on public.direct_bookings;
drop policy if exists "Admins can insert direct bookings" on public.direct_bookings;
drop policy if exists "Admins can update direct bookings" on public.direct_bookings;
drop policy if exists "Admins can delete direct bookings" on public.direct_bookings;

drop policy if exists "Admins can read direct booking payments" on public.direct_booking_payments;
drop policy if exists "Admins can insert direct booking payments" on public.direct_booking_payments;
drop policy if exists "Admins can update direct booking payments" on public.direct_booking_payments;
drop policy if exists "Admins can delete direct booking payments" on public.direct_booking_payments;

drop policy if exists "Admins can read direct booking events" on public.direct_booking_events;
drop policy if exists "Admins can insert direct booking events" on public.direct_booking_events;

create policy "Public can create Room 6 booking requests"
on public.direct_booking_requests
for insert
to anon, authenticated
with check (
  room_id = 'executive-studio'
  and status = 'pending_review'
  and source_domain = 'woodstreetcollective.com'
  and check_out > check_in
  and guest_count between 1 and 1
);

create policy "Admins can read booking requests"
on public.direct_booking_requests
for select
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can update booking requests"
on public.direct_booking_requests
for update
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can delete booking requests"
on public.direct_booking_requests
for delete
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can read booking rates"
on public.direct_booking_rates
for select
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can insert booking rates"
on public.direct_booking_rates
for insert
to authenticated
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can update booking rates"
on public.direct_booking_rates
for update
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can delete booking rates"
on public.direct_booking_rates
for delete
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can read direct bookings"
on public.direct_bookings
for select
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can insert direct bookings"
on public.direct_bookings
for insert
to authenticated
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can update direct bookings"
on public.direct_bookings
for update
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can delete direct bookings"
on public.direct_bookings
for delete
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can read direct booking payments"
on public.direct_booking_payments
for select
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can insert direct booking payments"
on public.direct_booking_payments
for insert
to authenticated
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can update direct booking payments"
on public.direct_booking_payments
for update
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can delete direct booking payments"
on public.direct_booking_payments
for delete
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can read direct booking events"
on public.direct_booking_events
for select
to authenticated
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can insert direct booking events"
on public.direct_booking_events
for insert
to authenticated
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
