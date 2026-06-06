import { supabase } from './supabase';

export type DirectBookingRequestRow = {
  id: string;
  room_id: string;
  status: 'pending_review' | 'approved' | 'declined' | 'expired';
  check_in: string;
  check_out: string;
  guest_count: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  message: string | null;
  marketing_consent: boolean;
  terms_accepted_at: string | null;
  source_domain: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DirectBookingRow = {
  id: string;
  request_id: string;
  room_id: string;
  status: 'pending_payment' | 'confirmed_paid' | 'cancelled' | 'refunded';
  check_in: string;
  check_out: string;
  guest_count: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  total_amount_pence: number;
  currency: 'gbp';
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  checkout_url: string | null;
  payment_expires_at: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DirectBookingPaymentRow = {
  id: string;
  booking_id: string;
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  amount_total_pence: number;
  currency: 'gbp';
  status: 'checkout_created' | 'paid' | 'failed' | 'expired' | 'refunded';
  checkout_url: string | null;
  created_at: string;
  updated_at: string;
};

export type DirectBookingRateRow = {
  room_id: string;
  nightly_rate_pence: number;
  cleaning_fee_pence: number;
  min_nights: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type DirectBookingQuote = {
  room_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  nightly_rate_pence: number;
  cleaning_fee_pence: number;
  min_nights: number;
  total_amount_pence: number;
  currency: 'gbp';
  rate_plan: string;
};

export type DirectBookingSummary = {
  requests: DirectBookingRequestRow[];
  bookings: DirectBookingRow[];
  payments: DirectBookingPaymentRow[];
  rates: DirectBookingRateRow[];
  rate: DirectBookingRateRow | null;
};

type RequestPayload = {
  room_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  message?: string;
  marketing_consent?: boolean;
  terms_accepted?: boolean;
};

const requestJson = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(path, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload as T;
};

const adminJson = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  if (!supabase) throw new Error('Supabase auth is not configured');
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Admin sign-in required');

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return requestJson<T>(path, {
    ...init,
    headers,
  });
};

export const checkDirectBookingAvailability = (params: {
  roomId: string;
  checkIn: string;
  checkOut: string;
}) => {
  const query = new URLSearchParams({
    room_id: params.roomId,
    check_in: params.checkIn,
    check_out: params.checkOut,
  });
  return requestJson<{ available: boolean; nights: number }>(`/api/direct-booking/availability?${query}`);
};

export const getDirectBookingQuote = (params: {
  roomId: string;
  checkIn: string;
  checkOut: string;
}) => {
  const query = new URLSearchParams({
    room_id: params.roomId,
    check_in: params.checkIn,
    check_out: params.checkOut,
  });
  return requestJson<DirectBookingQuote>(`/api/direct-booking/quote?${query}`);
};

export const createDirectBookingRequest = (payload: RequestPayload) => (
  requestJson<{ request: DirectBookingRequestRow }>('/api/direct-booking/requests', {
    method: 'POST',
    body: JSON.stringify({
      room_id: payload.room_id,
      check_in: payload.check_in,
      check_out: payload.check_out,
      guest_name: payload.guest_name,
      guest_email: payload.guest_email,
      guest_phone: payload.guest_phone || null,
      message: payload.message || null,
      marketing_consent: Boolean(payload.marketing_consent),
      terms_accepted: Boolean(payload.terms_accepted),
    }),
  })
);

export const createDirectBookingPublicCheckout = (payload: RequestPayload) => (
  requestJson<{ request: DirectBookingRequestRow; booking: DirectBookingRow; checkout_url: string }>('/api/direct-booking/public-checkout', {
    method: 'POST',
    body: JSON.stringify({
      room_id: payload.room_id,
      check_in: payload.check_in,
      check_out: payload.check_out,
      guest_name: payload.guest_name,
      guest_email: payload.guest_email,
      guest_phone: payload.guest_phone || null,
      message: payload.message || null,
      marketing_consent: Boolean(payload.marketing_consent),
      terms_accepted: Boolean(payload.terms_accepted),
    }),
  })
);

export const loadDirectBookingSummary = () => (
  adminJson<DirectBookingSummary>('/api/direct-booking/admin/summary')
);

export const saveDirectBookingRate = (rate: Pick<DirectBookingRateRow, 'room_id' | 'nightly_rate_pence' | 'cleaning_fee_pence' | 'min_nights' | 'enabled'>) => (
  adminJson<{ rate: DirectBookingRateRow }>('/api/direct-booking/admin/rate', {
    method: 'PUT',
    body: JSON.stringify(rate),
  })
);

export const createDirectBookingCheckout = (requestId: string) => (
  adminJson<{ booking: DirectBookingRow; checkout_url: string }>('/api/direct-booking/checkout', {
    method: 'POST',
    body: JSON.stringify({ request_id: requestId }),
  })
);

export const declineDirectBookingRequest = (requestId: string, adminNotes?: string) => (
  adminJson<{ request: DirectBookingRequestRow }>(`/api/direct-booking/admin/requests/${requestId}/decline`, {
    method: 'POST',
    body: JSON.stringify({ admin_notes: adminNotes || null }),
  })
);

export const cancelDirectBooking = (bookingId: string) => (
  adminJson<{ booking: DirectBookingRow }>(`/api/direct-booking/admin/bookings/${bookingId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
);
