-- F-04: Stripe webhook idempotency must be recoverable.
-- An event is only complete after the business updates succeed.

alter table public.direct_booking_stripe_events
  add column if not exists status text,
  add column if not exists attempts integer not null default 0,
  add column if not exists started_at timestamptz,
  add column if not exists finished_at timestamptz,
  add column if not exists failed_at timestamptz,
  add column if not exists last_error text;

alter table public.direct_booking_stripe_events
  alter column processed_at drop not null,
  alter column processed_at drop default;

update public.direct_booking_stripe_events
set
  status = coalesce(status, 'succeeded'),
  attempts = greatest(attempts, 1),
  started_at = coalesce(started_at, processed_at, now()),
  finished_at = coalesce(finished_at, processed_at)
where status is null;

alter table public.direct_booking_stripe_events
  alter column status set not null,
  alter column status set default 'processing';

alter table public.direct_booking_stripe_events
  drop constraint if exists direct_booking_stripe_events_valid_status;

alter table public.direct_booking_stripe_events
  add constraint direct_booking_stripe_events_valid_status
  check (status in ('processing', 'succeeded', 'failed', 'ignored'));

alter table public.direct_booking_stripe_events
  drop constraint if exists direct_booking_stripe_events_attempts_non_negative;

alter table public.direct_booking_stripe_events
  add constraint direct_booking_stripe_events_attempts_non_negative
  check (attempts >= 0);

create index if not exists direct_booking_stripe_events_status_started_idx
on public.direct_booking_stripe_events (status, started_at desc);
