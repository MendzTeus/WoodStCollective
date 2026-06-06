-- F-11: direct booking financial/audit-linked records should not be hard
-- deleted through the admin client. Use status transitions, cancellation, and
-- future anonymization jobs instead.

drop policy if exists "Admins can delete booking requests" on public.direct_booking_requests;
drop policy if exists "Admins can delete direct bookings" on public.direct_bookings;
drop policy if exists "Admins can delete direct booking payments" on public.direct_booking_payments;

revoke delete on public.direct_booking_requests from authenticated;
revoke delete on public.direct_bookings from authenticated;
revoke delete on public.direct_booking_payments from authenticated;

alter table public.direct_booking_requests
  add column if not exists pii_erased_at timestamptz;

alter table public.direct_bookings
  add column if not exists pii_erased_at timestamptz,
  add column if not exists checkout_url_cleared_at timestamptz;
