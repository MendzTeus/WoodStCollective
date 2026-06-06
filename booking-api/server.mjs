import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_ROOM_ID = 'executive-studio';
const ROOMS = {
  'classic-en-suite': { name: 'The Collective 1', label: 'Room 1' },
  'city-view-studio': { name: 'The Collective 2', label: 'Room 2' },
  'penthouse-suite': { name: 'The Collective 3', label: 'Room 3' },
  'loft-residency': { name: 'The Collective 4', label: 'Room 4' },
  'master-suite': { name: 'The Collective 5', label: 'Room 5' },
  'executive-studio': { name: 'The Collective 6', label: 'Room 6' },
};
const ALLOWED_ROOM_IDS = Object.keys(ROOMS);
const SOURCE_DOMAIN = 'woodstreetcollective.com';
const CHECKOUT_HOLD_MINUTES = 30;
const STRIPE_EVENT_PROCESSING_LEASE_MINUTES = 10;
const MAX_STAY_NIGHTS = 90;
const MAX_BOOKING_FUTURE_DAYS = 548;
const rateLimitBuckets = new Map();

const port = Number(process.env.PORT || 8080);
const publicSiteUrl = (process.env.PUBLIC_SITE_URL || 'https://woodstreetcollective.com').replace(/\/$/, '');
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const directIcalToken = process.env.DIRECT_ICAL_TOKEN || '';
const calendarCacheMaxAgeMinutes = Math.max(
  1,
  Number.isFinite(Number(process.env.CALENDAR_CACHE_MAX_AGE_MINUTES))
    ? Number(process.env.CALENDAR_CACHE_MAX_AGE_MINUTES)
    : 120,
);
const calendarCacheMaxAgeMs = calendarCacheMaxAgeMinutes * 60_000;

const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

const app = express();
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin');
  next();
});

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !stripeWebhookSecret) {
    res.status(503).json({ error: 'Stripe webhook is not configured' });
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.header('stripe-signature') || '',
      stripeWebhookSecret,
    );
  } catch {
    res.status(400).json({ error: 'Invalid Stripe signature' });
    return;
  }

  try {
    await processStripeEvent(event);
    res.json({ received: true });
  } catch (error) {
    console.error('[booking-api] webhook failed', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

app.use(express.json({ limit: '64kb' }));

const healthHandler = (_req, res) => {
  const missing = getMissingConfig();
  res.status(missing.length ? 503 : 200).json({
    status: missing.length ? 'degraded' : 'ok',
  });
};

const readinessHandler = (req, res) => {
  const missing = getMissingConfig();
  res.status(missing.length ? 503 : 200).json({
    status: missing.length ? 'missing_config' : 'ok',
    room_ids: ALLOWED_ROOM_IDS,
    missing,
    checked_by: req.admin.email,
  });
};

function getMissingConfig() {
  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!stripeSecretKey) missing.push('STRIPE_SECRET_KEY');
  if (!stripeWebhookSecret) missing.push('STRIPE_WEBHOOK_SECRET');
  if (!directIcalToken) missing.push('DIRECT_ICAL_TOKEN');
  return missing;
}

app.get('/health', healthHandler);
app.get('/api/direct-booking/health', healthHandler);
app.get('/api/direct-booking/readiness', requireAdmin, readinessHandler);

const availabilityRateLimit = createRateLimiter({
  keyPrefix: 'availability',
  windowMs: 60_000,
  max: 60,
});
const publicBookingRateLimit = createRateLimiter({
  keyPrefix: 'public-booking',
  windowMs: 15 * 60_000,
  max: 8,
  identity: (req) => String(req.body?.guest_email || '').trim().toLowerCase(),
});
const publicCancelRateLimit = createRateLimiter({
  keyPrefix: 'public-cancel',
  windowMs: 15 * 60_000,
  max: 20,
});
const paymentStatusRateLimit = createRateLimiter({
  keyPrefix: 'payment-status',
  windowMs: 60_000,
  max: 30,
});

app.get('/api/direct-booking/availability', availabilityRateLimit, async (req, res) => {
  try {
    const range = parseRange(req.query);
    await assertAvailable(range.roomId, range.checkIn, range.checkOut);
    res.json({ available: true, nights: nightsBetween(range.checkIn, range.checkOut) });
  } catch (error) {
    res.status(error.status || 400).json({
      available: false,
      error: error.publicMessage || 'Dates are not available',
    });
  }
});

app.get('/api/direct-booking/quote', availabilityRateLimit, async (req, res) => {
  try {
    requireSupabase();
    const range = parseRange(req.query);
    await assertAvailable(range.roomId, range.checkIn, range.checkOut);
    const { rate, nights, totalAmount, ratePlan } = await validateRateForRange(range.roomId, range.checkIn, range.checkOut);

    res.json({
      room_id: range.roomId,
      check_in: range.checkIn,
      check_out: range.checkOut,
      nights,
      nightly_rate_pence: rate.nightly_rate_pence,
      cleaning_fee_pence: rate.cleaning_fee_pence,
      min_nights: rate.min_nights,
      total_amount_pence: totalAmount,
      currency: 'gbp',
      rate_plan: ratePlan,
    });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.publicMessage || 'Could not calculate quote' });
  }
});

app.get('/api/direct-booking/payment-status', paymentStatusRateLimit, async (req, res) => {
  try {
    requireSupabase();
    const sessionId = String(req.query?.session_id || '').trim();
    if (!isStripeCheckoutSessionId(sessionId)) throw badRequest('Missing session_id');

    const { data: payment, error: paymentError } = await supabase
      .from('direct_booking_payments')
      .select('booking_id,status')
      .eq('stripe_checkout_session_id', sessionId)
      .maybeSingle();

    if (paymentError) throw internalError(paymentError.message);
    if (!payment) {
      res.status(404).json({ status: 'not_found' });
      return;
    }

    const { data: booking, error: bookingError } = await supabase
      .from('direct_bookings')
      .select('status')
      .eq('id', payment.booking_id)
      .maybeSingle();

    if (bookingError) throw internalError(bookingError.message);

    const status = payment.status === 'paid' && booking?.status === 'confirmed_paid'
      ? 'paid'
      : payment.status;
    res.json({ status, payment_status: payment.status, booking_status: booking?.status || 'not_found' });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.publicMessage || 'Could not verify payment' });
  }
});

app.post('/api/direct-booking/requests', publicBookingRateLimit, async (req, res) => {
  try {
    requireSupabase();
    const payload = parseRequestPayload(req.body);
    await assertAvailable(payload.room_id, payload.check_in, payload.check_out);

    const { data, error } = await supabase
      .from('direct_booking_requests')
      .insert(payload)
      .select('id,status,check_in,check_out')
      .single();

    if (error) throw internalError(error.message);
    await recordEvent({ request_id: data.id, event_type: 'request_created', actor: 'guest' });

    res.status(201).json({ request: data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.publicMessage || 'Could not create request' });
  }
});

app.post('/api/direct-booking/public-checkout', publicBookingRateLimit, async (req, res) => {
  try {
    requireSupabase();
    if (!stripe) throw serviceUnavailable('Stripe secret key is not configured');

    const payload = {
      ...parseRequestPayload(req.body),
      status: 'approved',
    };
    await assertAvailable(payload.room_id, payload.check_in, payload.check_out);
    await validateRateForRange(payload.room_id, payload.check_in, payload.check_out);

    const { data: request, error } = await supabase
      .from('direct_booking_requests')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw internalError(error.message);
    await recordEvent({ request_id: request.id, event_type: 'request_created', actor: 'guest' });

    const checkout = await createCheckoutForRequest(request.id, 'guest');
    res.status(201).json({ request, ...checkout });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.publicMessage || 'Could not create payment page' });
  }
});

app.post('/api/direct-booking/public-cancel', publicCancelRateLimit, async (req, res) => {
  try {
    requireSupabase();
    const bookingId = String(req.body?.booking_id || '').trim();
    const cancelToken = String(req.body?.cancel_token || '').trim();
    if (!isUuid(bookingId)) throw badRequest('Missing booking_id');
    if (cancelToken.length < 32) throw forbidden();

    const { data: bookingForCancel, error: bookingForCancelError } = await supabase
      .from('direct_bookings')
      .select('id,public_cancel_token_hash')
      .eq('id', bookingId)
      .single();

    if (bookingForCancelError || !bookingForCancel?.public_cancel_token_hash) throw forbidden();
    if (!verifyCancelToken(cancelToken, bookingForCancel.public_cancel_token_hash)) throw forbidden();

    const booking = await cancelPendingBooking(bookingId, 'guest_cancelled_checkout');
    res.json({ booking });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.publicMessage || 'Could not cancel checkout' });
  }
});

app.get('/api/direct-booking/admin/summary', requireAdmin, async (_req, res) => {
  try {
    const [requests, bookings, payments, rates] = await Promise.all([
      selectAll('direct_booking_requests', 'created_at', false),
      selectAll('direct_bookings', 'created_at', false),
      selectAll('direct_booking_payments', 'created_at', false),
      getRates(),
    ]);
    const rate = rates.find((item) => item.room_id === DEFAULT_ROOM_ID) || null;

    res.json({ requests, bookings, payments, rates, rate, rooms: ROOMS });
  } catch (error) {
    res.status(500).json({ error: 'Could not load bookings' });
  }
});

app.put('/api/direct-booking/admin/rate', requireAdmin, async (req, res) => {
  try {
    const rate = parseRatePayload(req.body);
    const { data, error } = await supabase
      .from('direct_booking_rates')
      .upsert(rate, { onConflict: 'room_id' })
      .select('*')
      .single();

    if (error) throw internalError(error.message);
    res.json({ rate: data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.publicMessage || 'Could not update rate' });
  }
});

app.post('/api/direct-booking/admin/requests/:id/decline', requireAdmin, async (req, res) => {
  try {
    const request = await updateRequest(req.params.id, {
      status: 'declined',
      admin_notes: req.body?.admin_notes || null,
    });
    await recordEvent({ request_id: request.id, event_type: 'request_declined', actor: req.admin.email });
    res.json({ request });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.publicMessage || 'Could not decline request' });
  }
});

app.post('/api/direct-booking/checkout', requireAdmin, async (req, res) => {
  try {
    const requestId = String(req.body?.request_id || '');
    const result = await createCheckoutForRequest(requestId, req.admin.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.publicMessage || 'Could not create checkout' });
  }
});

app.post('/api/direct-booking/admin/bookings/:id/cancel', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('direct_bookings')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) throw internalError(error.message);
    await recordEvent({ booking_id: data.id, request_id: data.request_id, event_type: 'booking_cancelled', actor: req.admin.email });
    res.json({ booking: data });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.publicMessage || 'Could not cancel booking' });
  }
});

app.get('/direct-ical/:token/:roomId.ics', async (req, res) => {
  try {
    requireSupabase();
    const roomId = parseRoomId(req.params.roomId);
    const expectedToken = getDirectIcalToken(roomId);
    if (!expectedToken || req.params.token !== expectedToken) {
      res.status(404).send('Not found');
      return;
    }

    const { data, error } = await supabase
      .from('direct_bookings')
      .select('id,check_in,check_out,status,payment_expires_at,updated_at')
      .eq('room_id', roomId)
      .in('status', ['pending_payment', 'confirmed_paid'])
      .order('check_in', { ascending: true });

    if (error) throw internalError(error.message);

    const now = new Date();
    const exportableBookings = (data || []).filter((booking) => (
      booking.status === 'confirmed_paid'
      || (booking.status === 'pending_payment' && booking.payment_expires_at && new Date(booking.payment_expires_at) > now)
    ));
    const ics = buildDirectBookingIcs(exportableBookings, roomId);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 'private, max-age=60');
    res.send(ics);
  } catch (error) {
    res.status(500).send('Calendar unavailable');
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[booking-api] listening on ${port}`);
});

function createRateLimiter({ keyPrefix, windowMs, max, identity = () => '' }) {
  return (req, res, next) => {
    const now = Date.now();
    const extraIdentity = identity(req);
    const key = [keyPrefix, getClientIp(req), extraIdentity].filter(Boolean).join(':');
    const bucket = rateLimitBuckets.get(key);
    const current = bucket && bucket.resetAt > now
      ? bucket
      : { count: 0, resetAt: now + windowMs };

    current.count += 1;
    rateLimitBuckets.set(key, current);

    if (rateLimitBuckets.size > 10_000) pruneRateLimitBuckets(now);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - current.count)));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(current.resetAt / 1000)));

    if (current.count > max) {
      res.status(429).json({ error: 'Too many booking attempts. Please try again later.' });
      return;
    }

    next();
  };
}

function pruneRateLimitBuckets(now = Date.now()) {
  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(key);
  }
}

function getClientIp(req) {
  const cfConnectingIp = String(req.header('cf-connecting-ip') || '').trim();
  if (cfConnectingIp) return cfConnectingIp;

  const forwardedFor = String(req.header('x-forwarded-for') || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)[0];
  if (forwardedFor) return forwardedFor;

  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function requireSupabase() {
  if (!supabase) throw serviceUnavailable('Supabase service role is not configured');
}

async function requireAdmin(req, res, next) {
  try {
    requireSupabase();
    const auth = req.header('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
    if (!token) throw unauthorized();

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) throw unauthorized();
    if (data.user.app_metadata?.role !== 'admin') throw forbidden();

    req.admin = { id: data.user.id, email: data.user.email || 'admin' };
    next();
  } catch (error) {
    res.status(error.status || 401).json({ error: error.publicMessage || 'Unauthorized' });
  }
}

function parseRequestPayload(body) {
  const roomId = parseRoomId(body?.room_id);
  const checkIn = cleanDate(body?.check_in);
  const checkOut = cleanDate(body?.check_out);
  validateDateRange(checkIn, checkOut);

  const guestName = String(body?.guest_name || '').trim();
  const guestEmail = String(body?.guest_email || '').trim().toLowerCase();
  const guestPhone = String(body?.guest_phone || '').trim();
  const message = String(body?.message || '').trim();
  const nameParts = guestName.split(/\s+/).filter(Boolean);

  if (guestName.length > 120 || nameParts.length < 2 || nameParts.some((part) => part.length < 2)) {
    throw badRequest('Enter first and last name');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) throw badRequest('Enter a valid email');
  if (body?.terms_accepted !== true) throw badRequest('Accept the booking terms to continue');

  return {
    room_id: roomId,
    status: 'pending_review',
    check_in: checkIn,
    check_out: checkOut,
    guest_count: 1,
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: guestPhone || null,
    message: message || null,
    marketing_consent: Boolean(body?.marketing_consent),
    terms_accepted_at: new Date().toISOString(),
    source_domain: SOURCE_DOMAIN,
  };
}

function parseRange(value) {
  const roomId = parseRoomId(value?.room_id);
  const checkIn = cleanDate(value?.check_in);
  const checkOut = cleanDate(value?.check_out);
  validateDateRange(checkIn, checkOut);
  return { roomId, checkIn, checkOut };
}

function parseRatePayload(body) {
  const roomId = parseRoomId(body?.room_id);
  const nightly = Number(body?.nightly_rate_pence);
  const cleaning = Number(body?.cleaning_fee_pence);
  const minNights = Number(body?.min_nights);

  if (!Number.isInteger(nightly) || nightly < 0) throw badRequest('Nightly rate must be a non-negative integer');
  if (!Number.isInteger(cleaning) || cleaning < 0) throw badRequest('Cleaning fee must be a non-negative integer');
  if (!Number.isInteger(minNights) || minNights < 1 || minNights > 365) throw badRequest('Minimum nights must be between 1 and 365');

  return {
    room_id: roomId,
    nightly_rate_pence: nightly,
    cleaning_fee_pence: cleaning,
    min_nights: minNights,
    enabled: Boolean(body?.enabled),
  };
}

async function createCheckoutForRequest(requestId, actor) {
  requireSupabase();
  if (!stripe) throw serviceUnavailable('Stripe secret key is not configured');
  if (!requestId) throw badRequest('Missing request_id');

  const { data: request, error } = await supabase
    .from('direct_booking_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (error || !request) throw badRequest('Request not found');
  if (!['pending_review', 'approved'].includes(request.status)) {
    throw badRequest('Only pending or approved requests can be sent to checkout');
  }

  const roomId = parseRoomId(request.room_id);
  const room = ROOMS[roomId];
  await assertAvailable(roomId, request.check_in, request.check_out, requestId);

  const { rate, nights, totalAmount, ratePlan } = await validateRateForRange(roomId, request.check_in, request.check_out);

  const booking = await getOrCreateBooking(request, totalAmount);
  if (booking.checkout_url && booking.status === 'pending_payment') {
    return { booking, checkout_url: booking.checkout_url };
  }

  const cancelToken = createCancelToken();
  const cancelTokenHash = hashCancelToken(cancelToken);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    client_reference_id: booking.id,
    customer_email: request.guest_email,
    success_url: `${publicSiteUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${publicSiteUrl}/booking/cancel?booking_id=${booking.id}&cancel_token=${encodeURIComponent(cancelToken)}`,
    expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_HOLD_MINUTES * 60,
    metadata: {
      booking_id: booking.id,
      request_id: request.id,
      room_id: roomId,
      rate_plan: ratePlan,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: totalAmount,
          product_data: {
            name: `${room.name} direct booking`,
            description: `${ratePlan}. ${request.check_in} to ${request.check_out} (${nights} night${nights === 1 ? '' : 's'})`,
          },
        },
      },
    ],
  });

  const expiresAt = session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null;
  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;

  const { data: updatedBooking, error: bookingError } = await supabase
    .from('direct_bookings')
    .update({
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      checkout_url: session.url,
      payment_expires_at: expiresAt,
      public_cancel_token_hash: cancelTokenHash,
    })
    .eq('id', booking.id)
    .select('*')
    .single();

  if (bookingError) throw internalError(bookingError.message);

  const { error: paymentError } = await supabase
    .from('direct_booking_payments')
    .insert({
      booking_id: booking.id,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      amount_total_pence: totalAmount,
      currency: 'gbp',
      status: 'checkout_created',
      checkout_url: session.url,
    });

  if (paymentError) throw internalError(paymentError.message);

  await updateRequest(request.id, { status: 'approved' });
  await recordEvent({
    request_id: request.id,
    booking_id: booking.id,
    event_type: 'checkout_created',
    actor,
    payload: { stripe_checkout_session_id: session.id, amount_total_pence: totalAmount },
  });

  return { booking: updatedBooking, checkout_url: session.url };
}

async function getOrCreateBooking(request, totalAmount) {
  const existing = await supabase
    .from('direct_bookings')
    .select('*')
    .eq('request_id', request.id)
    .maybeSingle();

  if (existing.error) throw internalError(existing.error.message);
  if (existing.data) return existing.data;

  const { data, error } = await supabase
    .from('direct_bookings')
    .insert({
      request_id: request.id,
      room_id: request.room_id,
      status: 'pending_payment',
      check_in: request.check_in,
      check_out: request.check_out,
      guest_count: request.guest_count,
      guest_name: request.guest_name,
      guest_email: request.guest_email,
      guest_phone: request.guest_phone,
      total_amount_pence: totalAmount,
      currency: 'gbp',
    })
    .select('*')
    .single();

  if (error) throw internalError(error.message);
  await recordEvent({ request_id: request.id, booking_id: data.id, event_type: 'booking_created', actor: 'system' });
  return data;
}

async function assertAvailable(roomId, checkIn, checkOut, excludingRequestId = null) {
  requireSupabase();
  await cancelExpiredPendingBookings(roomId);

  const bookedDates = await loadBookedDates(roomId);
  for (const dateKey of enumerateNights(checkIn, checkOut)) {
    if (bookedDates.has(dateKey)) throw badRequest('Those dates include a booked night');
  }

  let query = supabase
    .from('direct_bookings')
    .select('id,request_id,check_in,check_out,status,payment_expires_at')
    .eq('room_id', roomId)
    .in('status', ['pending_payment', 'confirmed_paid'])
    .lt('check_in', checkOut)
    .gt('check_out', checkIn);

  if (excludingRequestId) query = query.neq('request_id', excludingRequestId);

  const { data, error } = await query;
  if (error) throw internalError(error.message);
  const now = new Date();
  const conflicts = (data || []).filter((booking) => (
    booking.status === 'confirmed_paid'
    || !booking.payment_expires_at
    || new Date(booking.payment_expires_at) > now
  ));
  if (conflicts.length) throw badRequest('Those dates conflict with a direct booking already in progress');
}

async function loadBookedDates(roomId) {
  const bookedDates = new Set();

  const live = await supabase
    .from('calendar_cache')
    .select('booked_dates,synced_at')
    .eq('room_id', roomId)
    .maybeSingle();

  if (live.error) {
    console.warn('[booking-api] live calendar cache query failed', live.error.message);
    throw serviceUnavailable('Calendar availability is temporarily unavailable');
  }

  if (!live.data || !Array.isArray(live.data.booked_dates)) {
    console.warn('[booking-api] live calendar cache missing for room', roomId);
    throw serviceUnavailable('Calendar availability is temporarily unavailable');
  }

  const syncedAt = live.data.synced_at ? new Date(live.data.synced_at) : null;
  if (!syncedAt || Number.isNaN(syncedAt.getTime())) {
    console.warn('[booking-api] live calendar cache has invalid synced_at for room', roomId);
    throw serviceUnavailable('Calendar availability is temporarily unavailable');
  }

  const cacheAgeMs = Date.now() - syncedAt.getTime();
  if (cacheAgeMs < 0 || cacheAgeMs > calendarCacheMaxAgeMs) {
    console.warn('[booking-api] live calendar cache is stale for room', roomId, {
      synced_at: live.data.synced_at,
      max_age_minutes: calendarCacheMaxAgeMinutes,
    });
    throw serviceUnavailable('Calendar availability is temporarily unavailable');
  }

  for (const dateKey of live.data.booked_dates) bookedDates.add(dateKey);
  return bookedDates;
}

async function getRate(roomId) {
  requireSupabase();
  const { data, error } = await supabase
    .from('direct_booking_rates')
    .select('*')
    .eq('room_id', roomId)
    .maybeSingle();

  if (error) throw internalError(error.message);
  return data;
}

async function validateRateForRange(roomId, checkIn, checkOut) {
  const rate = await getRate(roomId);
  if (!rate?.enabled) throw badRequest('Direct booking rate is not enabled yet');

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < rate.min_nights) throw badRequest(`Minimum stay is ${rate.min_nights} night${rate.min_nights === 1 ? '' : 's'}`);

  const totalAmount = nights * rate.nightly_rate_pence + rate.cleaning_fee_pence;
  if (totalAmount <= 0) throw badRequest('Total booking amount must be greater than zero');

  return {
    rate,
    nights,
    totalAmount,
    ratePlan: nights >= 7 ? 'Refundable long stay' : 'Non-refundable direct rate',
  };
}

async function getRates() {
  requireSupabase();
  const { data, error } = await supabase
    .from('direct_booking_rates')
    .select('*')
    .order('room_id', { ascending: true });

  if (error) throw internalError(error.message);
  return data || [];
}

async function updateRequest(id, patch) {
  const { data, error } = await supabase
    .from('direct_booking_requests')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw internalError(error.message);
  return data;
}

async function selectAll(table, orderColumn, ascending) {
  requireSupabase();
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderColumn, { ascending });

  if (error) throw internalError(error.message);
  return data || [];
}

async function recordEvent({ request_id = null, booking_id = null, event_type, actor = 'system', payload = {} }) {
  if (!supabase) return;
  await supabase
    .from('direct_booking_events')
    .insert({ request_id, booking_id, event_type, actor, payload });
}

async function processStripeEvent(event) {
  requireSupabase();
  const eventLease = await beginStripeEventProcessing(event);
  if (!eventLease.shouldProcess) return;

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await confirmCheckoutSession(event.data.object);
    }

    if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      await markCheckoutFailed(event.data.object, event.type === 'checkout.session.expired' ? 'expired' : 'failed');
    }

    await finishStripeEventProcessing(event.id, 'succeeded');
  } catch (error) {
    await failStripeEventProcessing(event.id, error);
    throw error;
  }
}

async function beginStripeEventProcessing(event) {
  const nowIso = new Date().toISOString();
  const inserted = await supabase
    .from('direct_booking_stripe_events')
    .insert({
      stripe_event_id: event.id,
      event_type: event.type,
      status: 'processing',
      attempts: 1,
      started_at: nowIso,
      processed_at: null,
      finished_at: null,
      failed_at: null,
      last_error: null,
    })
    .select('stripe_event_id,status,started_at,attempts')
    .single();

  if (!inserted.error) return { shouldProcess: true, event: inserted.data };
  if (inserted.error.code !== '23505') throw inserted.error;

  const { data: existing, error: existingError } = await supabase
    .from('direct_booking_stripe_events')
    .select('stripe_event_id,status,started_at,attempts')
    .eq('stripe_event_id', event.id)
    .single();

  if (existingError) throw existingError;
  if (existing.status === 'succeeded' || existing.status === 'ignored') return { shouldProcess: false, event: existing };

  const startedAt = existing.started_at ? new Date(existing.started_at) : null;
  const leaseAgeMs = startedAt && !Number.isNaN(startedAt.getTime())
    ? Date.now() - startedAt.getTime()
    : Number.POSITIVE_INFINITY;
  const leaseIsFresh = existing.status === 'processing'
    && leaseAgeMs >= 0
    && leaseAgeMs < STRIPE_EVENT_PROCESSING_LEASE_MINUTES * 60_000;

  if (leaseIsFresh) return { shouldProcess: false, event: existing };

  const { data: updated, error: updateError } = await supabase
    .from('direct_booking_stripe_events')
    .update({
      event_type: event.type,
      status: 'processing',
      attempts: Number(existing.attempts || 0) + 1,
      started_at: nowIso,
      failed_at: null,
      last_error: null,
    })
    .eq('stripe_event_id', event.id)
    .neq('status', 'succeeded')
    .select('stripe_event_id,status,started_at,attempts')
    .maybeSingle();

  if (updateError) throw updateError;
  return { shouldProcess: Boolean(updated), event: updated || existing };
}

async function finishStripeEventProcessing(stripeEventId, status) {
  const nowIso = new Date().toISOString();
  const { error } = await supabase
    .from('direct_booking_stripe_events')
    .update({
      status,
      processed_at: nowIso,
      finished_at: nowIso,
      failed_at: null,
      last_error: null,
    })
    .eq('stripe_event_id', stripeEventId);

  if (error) throw error;
}

async function failStripeEventProcessing(stripeEventId, error) {
  const nowIso = new Date().toISOString();
  const message = error?.message ? String(error.message).slice(0, 1000) : 'Unknown webhook processing error';
  await supabase
    .from('direct_booking_stripe_events')
    .update({
      status: 'failed',
      failed_at: nowIso,
      last_error: message,
    })
    .eq('stripe_event_id', stripeEventId);
}

async function confirmCheckoutSession(session) {
  const bookingId = session.metadata?.booking_id || session.client_reference_id;
  if (!bookingId || !isUuid(bookingId)) return;

  if (session.payment_status !== 'paid') return;
  const sessionAmount = Number(session.amount_total);
  const sessionCurrency = String(session.currency || '').toLowerCase();
  if (!Number.isInteger(sessionAmount) || sessionAmount <= 0 || sessionCurrency !== 'gbp') {
    await recordEvent({
      event_type: 'payment_confirmation_rejected',
      actor: 'stripe',
      payload: {
        booking_id: bookingId,
        stripe_checkout_session_id: session.id,
        reason: 'invalid_amount_or_currency',
      },
    });
    return;
  }

  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;
  const nowIso = new Date().toISOString();

  const { data: paymentCandidate, error: paymentCheckError } = await supabase
    .from('direct_booking_payments')
    .select('id')
    .eq('booking_id', bookingId)
    .eq('stripe_checkout_session_id', session.id)
    .eq('amount_total_pence', sessionAmount)
    .eq('currency', sessionCurrency)
    .eq('status', 'checkout_created')
    .maybeSingle();

  if (paymentCheckError) throw paymentCheckError;
  if (!paymentCandidate) {
    await recordEvent({
      event_type: 'payment_confirmation_rejected',
      actor: 'stripe',
      payload: {
        booking_id: bookingId,
        stripe_checkout_session_id: session.id,
        reason: 'payment_state_mismatch',
      },
    });
    return;
  }

  const { data: booking, error } = await supabase
    .from('direct_bookings')
    .update({
      status: 'confirmed_paid',
      confirmed_at: nowIso,
      stripe_payment_intent_id: paymentIntentId,
      checkout_url: null,
      public_cancel_token_hash: null,
      checkout_url_cleared_at: nowIso,
    })
    .eq('id', bookingId)
    .eq('status', 'pending_payment')
    .eq('stripe_checkout_session_id', session.id)
    .eq('total_amount_pence', sessionAmount)
    .eq('currency', sessionCurrency)
    .gte('payment_expires_at', nowIso)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  if (!booking) {
    await recordEvent({
      event_type: 'payment_confirmation_rejected',
      actor: 'stripe',
      payload: {
        booking_id: bookingId,
        stripe_checkout_session_id: session.id,
        reason: 'booking_state_mismatch',
      },
    });
    return;
  }

  const { data: payment, error: paymentError } = await supabase
    .from('direct_booking_payments')
    .update({
      status: 'paid',
      stripe_payment_intent_id: paymentIntentId,
      checkout_url: null,
    })
    .eq('booking_id', booking.id)
    .eq('stripe_checkout_session_id', session.id)
    .eq('amount_total_pence', sessionAmount)
    .eq('currency', sessionCurrency)
    .eq('status', 'checkout_created')
    .select('id')
    .maybeSingle();

  if (paymentError) throw paymentError;
  if (!payment) throw internalError('Payment row was not updated');

  await recordEvent({
    request_id: booking.request_id,
    booking_id: booking.id,
    event_type: 'payment_confirmed',
    actor: 'stripe',
    payload: { stripe_checkout_session_id: session.id, stripe_payment_intent_id: paymentIntentId },
  });
}

async function markCheckoutFailed(session, status) {
  const bookingId = session.metadata?.booking_id || session.client_reference_id;

  await supabase
    .from('direct_booking_payments')
    .update({ status })
    .eq('stripe_checkout_session_id', session.id);

  if (bookingId) await cancelPendingBooking(bookingId, `checkout_${status}`);
}

async function cancelExpiredPendingBookings(roomId = null) {
  const nowIso = new Date().toISOString();
  let query = supabase
    .from('direct_bookings')
    .select('id')
    .eq('status', 'pending_payment')
    .lt('payment_expires_at', nowIso);

  if (roomId) query = query.eq('room_id', roomId);

  const { data, error } = await query;

  if (error) throw internalError(error.message);
  await Promise.all((data || []).map((booking) => cancelPendingBooking(booking.id, 'checkout_hold_expired')));
}

async function cancelPendingBooking(bookingId, eventType) {
  const { data: booking, error: selectError } = await supabase
    .from('direct_bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (selectError || !booking) throw badRequest('Booking not found');
  if (booking.status !== 'pending_payment') return booking;

  if (stripe && booking.stripe_checkout_session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(booking.stripe_checkout_session_id);
      if (session.status === 'open') await stripe.checkout.sessions.expire(booking.stripe_checkout_session_id);
    } catch (error) {
      console.warn('[booking-api] could not expire Stripe checkout session', error.message);
    }
  }

	  const { data: updatedBooking, error: updateError } = await supabase
	    .from('direct_bookings')
	    .update({
	      status: 'cancelled',
	      cancelled_at: new Date().toISOString(),
	      checkout_url: null,
	      public_cancel_token_hash: null,
	      checkout_url_cleared_at: new Date().toISOString(),
	    })
    .eq('id', bookingId)
    .eq('status', 'pending_payment')
    .select('*')
    .single();

  if (updateError) throw internalError(updateError.message);

	  await supabase
	    .from('direct_booking_payments')
	    .update({
	      status: eventType.includes('expired') ? 'expired' : 'failed',
	      checkout_url: null,
	    })
    .eq('booking_id', bookingId)
    .eq('status', 'checkout_created');

  if (updatedBooking.request_id) await updateRequest(updatedBooking.request_id, { status: 'expired' });
  await recordEvent({
    request_id: updatedBooking.request_id,
    booking_id: updatedBooking.id,
    event_type: eventType,
    actor: 'system',
  });

  return updatedBooking;
}

function buildDirectBookingIcs(bookings, roomId) {
  const room = ROOMS[roomId];
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wood Street Collective//Direct Booking 1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Wood Street Direct Bookings',
    foldIcsLine(`X-WR-CALDESC:Confirmed direct bookings for ${room.name}`),
  ];

  for (const booking of bookings) {
    lines.push(
      'BEGIN:VEVENT',
      foldIcsLine(`UID:direct-${booking.id}@woodstreetcollective.com`),
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${booking.check_in.replaceAll('-', '')}`,
      `DTEND;VALUE=DATE:${booking.check_out.replaceAll('-', '')}`,
      'SUMMARY:Wood Street Direct Booking',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}

function parseRoomId(value) {
  const roomId = String(value || DEFAULT_ROOM_ID).trim();
  if (!Object.prototype.hasOwnProperty.call(ROOMS, roomId)) {
    throw badRequest('Direct booking is not enabled for this room');
  }
  return roomId;
}

function getDirectIcalToken(roomId) {
  const roomSpecificKey = `DIRECT_ICAL_TOKEN_${roomId.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
  return process.env[roomSpecificKey] || directIcalToken;
}

function foldIcsLine(line) {
  if (line.length <= 75) return line;
  const chunks = [];
  let remaining = line;
  while (remaining.length > 75) {
    chunks.push(remaining.slice(0, 75));
    remaining = remaining.slice(75);
  }
  chunks.push(remaining);
  return chunks.join('\r\n ');
}

function cleanDate(value) {
  const text = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw badRequest('Use YYYY-MM-DD dates');
  const date = new Date(`${text}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== text) {
    throw badRequest('Use a valid calendar date');
  }
  return text;
}

function validateDateRange(checkIn, checkOut) {
  if (checkOut <= checkIn) throw badRequest('Check-out must be after check-in');
  const today = new Date().toISOString().slice(0, 10);
  if (checkIn < today) throw badRequest('Check-in must be today or later');
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1 || nights > MAX_STAY_NIGHTS) throw badRequest(`Stay length must be between 1 and ${MAX_STAY_NIGHTS} nights`);
  const latestCheckIn = toDateKeyFromUtc(addUtcDays(new Date(`${today}T00:00:00Z`), MAX_BOOKING_FUTURE_DAYS));
  if (checkIn > latestCheckIn) throw badRequest('Check-in is too far in the future');
}

function nightsBetween(checkIn, checkOut) {
  const start = Date.UTC(Number(checkIn.slice(0, 4)), Number(checkIn.slice(5, 7)) - 1, Number(checkIn.slice(8, 10)));
  const end = Date.UTC(Number(checkOut.slice(0, 4)), Number(checkOut.slice(5, 7)) - 1, Number(checkOut.slice(8, 10)));
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

function enumerateNights(checkIn, checkOut) {
  const dates = [];
  const cursor = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  while (cursor < end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

function addUtcDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toDateKeyFromUtc(date) {
  return date.toISOString().slice(0, 10);
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isStripeCheckoutSessionId(value) {
  return /^cs_(test|live)_[A-Za-z0-9_]{10,255}$/.test(String(value || ''));
}

function createCancelToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function hashCancelToken(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

function verifyCancelToken(token, expectedHash) {
  const actual = Buffer.from(hashCancelToken(token), 'hex');
  const expected = Buffer.from(String(expectedHash || ''), 'hex');
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

function badRequest(message) {
  return appError(400, message);
}

function unauthorized() {
  return appError(401, 'Admin sign-in required');
}

function forbidden() {
  return appError(403, 'Admin access required');
}

function serviceUnavailable(message) {
  return appError(503, message);
}

function internalError(message) {
  const error = appError(500, 'Internal booking service error');
  error.detail = message;
  return error;
}

function appError(status, publicMessage) {
  const error = new Error(publicMessage);
  error.status = status;
  error.publicMessage = publicMessage;
  return error;
}
