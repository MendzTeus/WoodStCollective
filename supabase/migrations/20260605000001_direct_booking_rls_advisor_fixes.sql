-- Advisor fixes for the Room 6 direct booking MVP.
-- Avoid per-row auth.jwt() re-evaluation and make Stripe event audit rows
-- readable to admins while preserving service-role-only writes.

grant select on public.direct_booking_stripe_events to authenticated;

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
drop policy if exists "Admins can read direct booking stripe events" on public.direct_booking_stripe_events;

create policy "Admins can read booking requests"
on public.direct_booking_requests
for select
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can update booking requests"
on public.direct_booking_requests
for update
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can delete booking requests"
on public.direct_booking_requests
for delete
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can read booking rates"
on public.direct_booking_rates
for select
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can insert booking rates"
on public.direct_booking_rates
for insert
to authenticated
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can update booking rates"
on public.direct_booking_rates
for update
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can delete booking rates"
on public.direct_booking_rates
for delete
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can read direct bookings"
on public.direct_bookings
for select
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can insert direct bookings"
on public.direct_bookings
for insert
to authenticated
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can update direct bookings"
on public.direct_bookings
for update
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can delete direct bookings"
on public.direct_bookings
for delete
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can read direct booking payments"
on public.direct_booking_payments
for select
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can insert direct booking payments"
on public.direct_booking_payments
for insert
to authenticated
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can update direct booking payments"
on public.direct_booking_payments
for update
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can delete direct booking payments"
on public.direct_booking_payments
for delete
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can read direct booking events"
on public.direct_booking_events
for select
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can insert direct booking events"
on public.direct_booking_events
for insert
to authenticated
with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admins can read direct booking stripe events"
on public.direct_booking_stripe_events
for select
to authenticated
using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
