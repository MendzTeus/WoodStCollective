-- F-05: public visitors must not insert booking requests directly through
-- Supabase Data API. Public booking creation goes through booking-api, which
-- validates availability, terms, rate status, and abuse controls.

drop policy if exists "Public can create Room 6 booking requests" on public.direct_booking_requests;
drop policy if exists "Public can create direct booking requests" on public.direct_booking_requests;

revoke all on public.direct_booking_requests from anon;
revoke all on public.direct_booking_requests from authenticated;

grant select, update, delete on public.direct_booking_requests to authenticated;
