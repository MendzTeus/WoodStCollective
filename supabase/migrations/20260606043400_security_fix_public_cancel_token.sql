-- F-07: public cancellation requires a per-booking bearer token.
-- The raw token is only sent in the Stripe cancel URL; the database stores
-- a SHA-256 hash.

alter table public.direct_bookings
  add column if not exists public_cancel_token_hash text;

create index if not exists direct_bookings_public_cancel_token_hash_idx
on public.direct_bookings (public_cancel_token_hash)
where public_cancel_token_hash is not null;
