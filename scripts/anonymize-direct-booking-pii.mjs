import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const inactiveRetentionDays = Number(process.env.DIRECT_BOOKING_PII_INACTIVE_RETENTION_DAYS || 180);
const confirmedRetentionDays = Number(process.env.DIRECT_BOOKING_PII_CONFIRMED_RETENTION_DAYS || 2555);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[direct-booking-retention] SUPABASE_URL or VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

if (!Number.isFinite(inactiveRetentionDays) || inactiveRetentionDays < 30) {
  console.error('[direct-booking-retention] DIRECT_BOOKING_PII_INACTIVE_RETENTION_DAYS must be at least 30');
  process.exit(1);
}

if (!Number.isFinite(confirmedRetentionDays) || confirmedRetentionDays < 365) {
  console.error('[direct-booking-retention] DIRECT_BOOKING_PII_CONFIRMED_RETENTION_DAYS must be at least 365');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const inactiveCutoff = daysAgo(inactiveRetentionDays);
const confirmedCutoff = daysAgo(confirmedRetentionDays);

const requestInactiveStatuses = ['declined', 'expired'];
const bookingInactiveStatuses = ['cancelled', 'refunded'];

const requests = await fetchRows('direct_booking_requests', 'id,status,created_at,updated_at', (query) => query
  .is('pii_erased_at', null)
  .in('status', requestInactiveStatuses)
  .lt('updated_at', inactiveCutoff));

const inactiveBookings = await fetchRows('direct_bookings', 'id,request_id,status,created_at,updated_at', (query) => query
  .is('pii_erased_at', null)
  .in('status', bookingInactiveStatuses)
  .lt('updated_at', inactiveCutoff));

const confirmedBookings = await fetchRows('direct_bookings', 'id,request_id,status,created_at,confirmed_at,updated_at', (query) => query
  .is('pii_erased_at', null)
  .eq('status', 'confirmed_paid')
  .lt('confirmed_at', confirmedCutoff));

const bookingRows = [...inactiveBookings, ...confirmedBookings];
const requestIdsFromBookings = [...new Set(bookingRows.map((booking) => booking.request_id).filter(Boolean))];
const requestRowsFromBookings = requestIdsFromBookings.length
  ? await fetchRows('direct_booking_requests', 'id,status,created_at,updated_at', (query) => query
      .is('pii_erased_at', null)
      .in('id', requestIdsFromBookings))
  : [];

const requestRows = dedupeById([...requests, ...requestRowsFromBookings]);

let anonymizedRequests = 0;
let anonymizedBookings = 0;

for (const request of requestRows) {
  await updateRow('direct_booking_requests', request.id, {
    guest_name: 'Guest anonymized',
    guest_email: anonymizedEmail('request', request.id),
    guest_phone: null,
    message: null,
    admin_notes: null,
    marketing_consent: false,
    pii_erased_at: new Date().toISOString(),
  });
  anonymizedRequests += 1;
}

for (const booking of bookingRows) {
  await updateRow('direct_bookings', booking.id, {
    guest_name: 'Guest anonymized',
    guest_email: anonymizedEmail('booking', booking.id),
    guest_phone: null,
    checkout_url: null,
    public_cancel_token_hash: null,
    pii_erased_at: new Date().toISOString(),
    checkout_url_cleared_at: new Date().toISOString(),
  });
  anonymizedBookings += 1;
}

console.log(`[direct-booking-retention] anonymized requests=${anonymizedRequests} bookings=${anonymizedBookings}`);

function daysAgo(days) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function anonymizedEmail(prefix, id) {
  return `${prefix}-${id}@woodstreet.invalid`;
}

function dedupeById(rows) {
  const map = new Map();
  for (const row of rows) map.set(row.id, row);
  return [...map.values()];
}

async function fetchRows(table, select, applyFilters) {
  const { data, error } = await applyFilters(supabase.from(table).select(select));
  if (error) throw new Error(`${table}: ${error.message}`);
  return data || [];
}

async function updateRow(table, id, values) {
  const { error } = await supabase
    .from(table)
    .update(values)
    .eq('id', id);

  if (error) throw new Error(`${table} ${id}: ${error.message}`);
}
