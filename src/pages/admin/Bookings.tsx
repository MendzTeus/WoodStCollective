import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  Copy,
  CreditCard,
  RefreshCw,
  Save,
  XCircle,
} from 'lucide-react';
import {
  cancelDirectBooking,
  createDirectBookingCheckout,
  declineDirectBookingRequest,
  DirectBookingRateRow,
  DirectBookingSummary,
  loadDirectBookingSummary,
  saveDirectBookingRate,
} from '../../lib/directBooking';
import { directBookingRooms, getDirectBookingRoom } from '../../lib/directBookingRooms';

const money = (pence: number) => (
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)
);

const nightsBetween = (checkIn: string, checkOut: string) => {
  const start = new Date(`${checkIn}T00:00:00Z`).getTime();
  const end = new Date(`${checkOut}T00:00:00Z`).getTime();
  return Math.max(0, Math.round((end - start) / 86_400_000));
};

const statusClass = (status: string) => {
  if (status === 'confirmed_paid' || status === 'paid') return 'text-green-400 bg-green-500/10 border-green-500/20';
  if (status === 'pending_review' || status === 'pending_payment' || status === 'checkout_created') return 'text-primary bg-primary/10 border-primary/20';
  if (status === 'declined' || status === 'cancelled' || status === 'failed' || status === 'expired') return 'text-red-300 bg-red-500/10 border-red-500/20';
  return 'text-text-secondary bg-white/5 border-divider-subtle';
};

const blankRate = (roomId: string): DirectBookingRateRow => ({
  room_id: roomId,
  nightly_rate_pence: 10000,
  cleaning_fee_pence: 0,
  min_nights: 2,
  enabled: false,
  created_at: '',
  updated_at: '',
});

export default function AdminBookings() {
  const [summary, setSummary] = useState<DirectBookingSummary | null>(null);
  const [selectedRateRoomId, setSelectedRateRoomId] = useState('executive-studio');
  const [rate, setRate] = useState(blankRate('executive-studio'));
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingRate, setIsSavingRate] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const rateByRoom = useMemo(() => {
    const map = new Map<string, DirectBookingRateRow>();
    for (const item of summary?.rates || []) map.set(item.room_id, item);
    return map;
  }, [summary?.rates]);

  const bookingsByRequest = useMemo(() => {
    const map = new Map<string, NonNullable<DirectBookingSummary['bookings']>[number]>();
    for (const booking of summary?.bookings || []) map.set(booking.request_id, booking);
    return map;
  }, [summary?.bookings]);

  const paymentsByBooking = useMemo(() => {
    const map = new Map<string, NonNullable<DirectBookingSummary['payments']>[number]>();
    for (const payment of summary?.payments || []) map.set(payment.booking_id, payment);
    return map;
  }, [summary?.payments]);

  const load = async () => {
    setIsLoading(true);
    setFeedback('');
    try {
      const next = await loadDirectBookingSummary();
      setSummary(next);
      setRate(next.rates.find((item) => item.room_id === selectedRateRoomId) || blankRate(selectedRateRoomId));
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Could not load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setRate(rateByRoom.get(selectedRateRoomId) || blankRate(selectedRateRoomId));
  }, [rateByRoom, selectedRateRoomId]);

  const handleSaveRate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingRate(true);
    setFeedback('');

    try {
      const result = await saveDirectBookingRate({
        room_id: selectedRateRoomId,
        nightly_rate_pence: rate.nightly_rate_pence,
        cleaning_fee_pence: rate.cleaning_fee_pence,
        min_nights: rate.min_nights,
        enabled: rate.enabled,
      });
      setRate(result.rate);
      setFeedback('Rate saved.');
      await load();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Could not save rate');
    } finally {
      setIsSavingRate(false);
    }
  };

  const handleCheckout = async (requestId: string) => {
    setWorkingId(requestId);
    setFeedback('');
    try {
      const result = await createDirectBookingCheckout(requestId);
      setFeedback('Checkout link created.');
      await navigator.clipboard?.writeText(result.checkout_url);
      await load();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Could not create checkout');
    } finally {
      setWorkingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setWorkingId(requestId);
    setFeedback('');
    try {
      await declineDirectBookingRequest(requestId);
      setFeedback('Request declined.');
      await load();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Could not decline request');
    } finally {
      setWorkingId(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    setWorkingId(bookingId);
    setFeedback('');
    try {
      await cancelDirectBooking(bookingId);
      setFeedback('Booking cancelled.');
      await load();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Could not cancel booking');
    } finally {
      setWorkingId(null);
    }
  };

  const copyText = async (text?: string | null) => {
    if (!text) return;
    await navigator.clipboard?.writeText(text);
    setFeedback('Copied.');
  };

  return (
    <div className="p-12 pb-32">
      <header className="mb-12 flex items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-4xl font-bold text-primary">Bookings</h2>
          <p className="mt-2 text-sm text-text-secondary">Direct booking setup for Rooms 1-6.</p>
        </div>
        <button
          onClick={load}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-on-primary hover:brightness-110 disabled:opacity-60"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      {feedback && (
        <div className="mb-8 rounded-lg border border-divider-subtle bg-surface-container px-5 py-4 text-sm text-text-secondary">
          {feedback}
        </div>
      )}

      <section className="mb-10 grid grid-cols-1 gap-8 xl:grid-cols-3">
        <form onSubmit={handleSaveRate} className="rounded-2xl border border-divider-subtle bg-surface-container p-8 xl:col-span-1">
          <div className="mb-6 flex items-center gap-3">
            <CalendarCheck className="text-primary" size={22} />
            <h3 className="font-display text-2xl font-bold text-primary">Room Rate</h3>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="label-caps text-[10px] text-text-muted">Room</span>
              <select
                value={selectedRateRoomId}
                onChange={(event) => setSelectedRateRoomId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-divider-subtle bg-background-dark p-3 outline-none focus:border-primary"
              >
                {directBookingRooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.label} - {room.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label-caps text-[10px] text-text-muted">Nightly rate, pence</span>
              <input
                type="number"
                min="0"
                step="1"
                value={rate.nightly_rate_pence}
                onChange={(event) => setRate((current) => ({ ...current, nightly_rate_pence: Number(event.target.value) }))}
                className="mt-2 w-full rounded-lg border border-divider-subtle bg-background-dark p-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-[10px] text-text-muted">Cleaning fee, pence</span>
              <input
                type="number"
                min="0"
                step="1"
                value={rate.cleaning_fee_pence}
                onChange={(event) => setRate((current) => ({ ...current, cleaning_fee_pence: Number(event.target.value) }))}
                className="mt-2 w-full rounded-lg border border-divider-subtle bg-background-dark p-3 outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="label-caps text-[10px] text-text-muted">Minimum nights</span>
              <input
                type="number"
                min="1"
                max="365"
                step="1"
                value={rate.min_nights}
                onChange={(event) => setRate((current) => ({ ...current, min_nights: Number(event.target.value) }))}
                className="mt-2 w-full rounded-lg border border-divider-subtle bg-background-dark p-3 outline-none focus:border-primary"
              />
            </label>
            <label className="flex items-center gap-3 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={rate.enabled}
                onChange={(event) => setRate((current) => ({ ...current, enabled: event.target.checked }))}
                className="accent-primary"
              />
              Enable checkout creation
            </label>
            <button
              type="submit"
              disabled={isSavingRate}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-on-primary hover:brightness-110 disabled:opacity-60"
            >
              <Save size={16} /> Save Rate
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-divider-subtle bg-surface-container p-8 xl:col-span-2">
	          <h3 className="mb-4 font-display text-2xl font-bold text-primary">Direct Airbnb ICS</h3>
	          <p className="text-sm leading-relaxed text-text-secondary">
	            Import each room feed in the matching Airbnb listing after setting a per-room token such as `DIRECT_ICAL_TOKEN_EXECUTIVE_STUDIO`. `DIRECT_ICAL_TOKEN` remains a fallback only.
	          </p>
	          <div className="mt-5 grid gap-3">
	            {directBookingRooms.map((room) => {
	              const tokenName = `DIRECT_ICAL_TOKEN_${room.id.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
	              const url = `https://woodstreetcollective.com/direct-ical/<${tokenName}>/${room.id}.ics`;
              return (
                <div key={room.id} className="rounded-lg border border-divider-subtle bg-background-dark p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-text-primary">{room.label} - {room.name}</span>
                    <button
                      type="button"
                      onClick={() => copyText(url)}
                      className="rounded-md border border-divider-subtle px-3 py-1 text-xs font-bold text-text-secondary hover:border-primary hover:text-primary"
                    >
                      Copy
                    </button>
                  </div>
                  <code className="block break-all text-xs text-primary">{url}</code>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-text-muted">
            The feeds only export `confirmed_paid` bookings and never include guest personal data.
          </p>
        </div>
      </section>

      <section className="mb-10 overflow-hidden rounded-2xl border border-divider-subtle bg-surface-container">
        <div className="border-b border-divider-subtle p-8">
          <h3 className="font-display text-2xl font-bold text-primary">Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left">
            <thead className="bg-background-dark/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Guest</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Room</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Dates</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Message</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Marketing</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider-subtle">
              {(summary?.requests || []).map((request) => {
                const booking = bookingsByRequest.get(request.id);
                const room = getDirectBookingRoom(request.room_id);
                return (
                  <tr key={request.id} className="hover:bg-white/5">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-text-primary">{request.guest_name}</div>
                      <div className="text-xs text-text-secondary">{request.guest_email}</div>
                      {request.guest_phone && <div className="text-xs text-text-muted">{request.guest_phone}</div>}
                    </td>
                    <td className="px-6 py-5 text-sm text-text-secondary">
                      <div className="font-semibold text-text-primary">{room?.label || request.room_id}</div>
                      <div className="text-xs text-text-muted">{room?.name || request.room_id}</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-text-secondary">
                      <div>{request.check_in} to {request.check_out}</div>
                      <div className="text-xs text-text-muted">{nightsBetween(request.check_in, request.check_out)} nights</div>
                    </td>
                    <td className="max-w-sm truncate px-6 py-5 text-sm text-text-secondary">{request.message || '-'}</td>
                    <td className="px-6 py-5 text-sm text-text-secondary">{request.marketing_consent ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleCheckout(request.id)}
                          disabled={workingId === request.id || request.status === 'declined'}
                          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-on-primary disabled:opacity-50"
                        >
                          <CreditCard size={14} /> Checkout
                        </button>
                        <button
                          onClick={() => copyText(booking?.checkout_url)}
                          disabled={!booking?.checkout_url}
                          className="flex items-center gap-2 rounded-lg border border-divider-subtle px-3 py-2 text-xs font-bold text-text-secondary disabled:opacity-40"
                        >
                          <Copy size={14} /> Copy
                        </button>
                        <button
                          onClick={() => handleDecline(request.id)}
                          disabled={workingId === request.id || request.status === 'declined'}
                          className="flex items-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-xs font-bold text-red-300 disabled:opacity-40"
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && (summary?.requests || []).length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-text-muted" colSpan={7}>No direct booking requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-divider-subtle bg-surface-container">
        <div className="border-b border-divider-subtle p-8">
          <h3 className="font-display text-2xl font-bold text-primary">Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left">
            <thead className="bg-background-dark/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Guest</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Room</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Dates</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Payment</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider-subtle">
              {(summary?.bookings || []).map((booking) => {
                const payment = paymentsByBooking.get(booking.id);
                const room = getDirectBookingRoom(booking.room_id);
                return (
                  <tr key={booking.id} className="hover:bg-white/5">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-text-primary">{booking.guest_name}</div>
                      <div className="text-xs text-text-secondary">{booking.guest_email}</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-text-secondary">
                      <div className="font-semibold text-text-primary">{room?.label || booking.room_id}</div>
                      <div className="text-xs text-text-muted">{room?.name || booking.room_id}</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-text-secondary">
                      <div>{booking.check_in} to {booking.check_out}</div>
                      <div className="text-xs text-text-muted">{nightsBetween(booking.check_in, booking.check_out)} nights</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-primary">{money(booking.total_amount_pence)}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClass(payment?.status || 'none')}`}>
                        {payment?.status || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => copyText(booking.checkout_url)}
                          disabled={!booking.checkout_url}
                          className="flex items-center gap-2 rounded-lg border border-divider-subtle px-3 py-2 text-xs font-bold text-text-secondary disabled:opacity-40"
                        >
                          <Copy size={14} /> Copy
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={workingId === booking.id || booking.status === 'cancelled'}
                          className="flex items-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-xs font-bold text-red-300 disabled:opacity-40"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && (summary?.bookings || []).length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-text-muted" colSpan={7}>No direct bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
