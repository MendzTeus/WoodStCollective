import React, { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { CalendarCheck, ChevronLeft, ChevronRight, CircleCheck, CreditCard, Loader2, LockKeyhole, Moon } from 'lucide-react';
import { toDateKey } from '../lib/ical';
import { trackEvent } from '../lib/analytics';
import { checkDirectBookingAvailability, createDirectBookingPublicCheckout, getDirectBookingQuote, type DirectBookingQuote } from '../lib/directBooking';

const DIRECT_BOOKING_DOMAIN = 'woodstreetcollective.com';
const DIRECT_BOOKING_FALLBACK_MIN_NIGHTS = 2;
const DIRECT_BOOKING_LONG_STAY_NIGHTS = 7;
const WEEK_DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

type DirectBookingRequestProps = {
  roomId: string;
  roomName: string;
};

type CalendarCachePayload = {
  bookedDates?: string[];
  booked_dates?: string[];
};

type RequestStatus = 'idle' | 'checking' | 'available' | 'submitting' | 'success' | 'error';

const parseDateKey = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const dateLabel = (value: string) => format(parseDateKey(value), 'dd MMM yyyy');

const moneyLabel = (pence: number) => new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: Number.isInteger(pence / 100) ? 0 : 2,
}).format(pence / 100);

const datesFromPayload = (payload: CalendarCachePayload) => (
  new Set((payload.bookedDates || payload.booked_dates || []).filter(Boolean))
);

const fetchStaticBookedDates = async (roomId: string) => {
  const response = await fetch(`/calendar-cache/${roomId}.json`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Calendar cache not found for ${roomId}`);
  return datesFromPayload(await response.json());
};

const rangeHasBlockedNight = (checkIn: string, checkOut: string, bookedDates: Set<string>) => {
  let date = parseDateKey(checkIn);
  const end = parseDateKey(checkOut);

  while (date < end) {
    if (bookedDates.has(toDateKey(date))) return true;
    date = addDays(date, 1);
  }

  return false;
};

export default function DirectBookingRequest({ roomId, roomName }: DirectBookingRequestProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const defaultCheckIn = useMemo(() => toDateKey(addDays(today, 1)), [today]);
  const defaultCheckOut = useMemo(() => toDateKey(addDays(today, 1 + DIRECT_BOOKING_FALLBACK_MIN_NIGHTS)), [today]);
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(today));
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [calendarStatus, setCalendarStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const [quote, setQuote] = useState<DirectBookingQuote | null>(null);
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [quoteError, setQuoteError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadBookedDates = async () => {
      setCalendarStatus('loading');
      try {
        const dates = await fetchStaticBookedDates(roomId);
        if (cancelled) return;
        setBookedDates(dates);
        setCalendarStatus('ready');
      } catch {
        if (cancelled) return;
        setBookedDates(new Set());
        setCalendarStatus('fallback');
      }
    };

    loadBookedDates();

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 1 });
    const days: Date[] = [];
    let date = start;

    while (date <= end) {
      days.push(date);
      date = addDays(date, 1);
    }

    return days;
  }, [calendarMonth]);

  const nights = checkIn && checkOut
    ? Math.max(0, differenceInCalendarDays(parseDateKey(checkOut), parseDateKey(checkIn)))
    : 0;
  const hasBlockedNight = useMemo(
    () => Boolean(checkIn && checkOut) && rangeHasBlockedNight(checkIn, checkOut, bookedDates),
    [bookedDates, checkIn, checkOut],
  );
  const minNights = quote?.min_nights ?? DIRECT_BOOKING_FALLBACK_MIN_NIGHTS;
  const hasValidDates = Boolean(quote) && nights >= minNights && !hasBlockedNight;
  const ratePlan = quote?.rate_plan ?? (nights >= DIRECT_BOOKING_LONG_STAY_NIGHTS ? 'Refundable long stay' : 'Non-refundable direct rate');
  const totalAmountPence = hasValidDates ? quote?.total_amount_pence ?? 0 : 0;
  const canSubmit = hasValidDates
    && guestFirstName.trim().length > 1
    && guestLastName.trim().length > 1
    && guestEmail.trim().length > 3
    && termsAccepted
    && quoteStatus === 'ready';

  useEffect(() => {
    let cancelled = false;

    if (!checkIn || !checkOut || nights <= 0 || hasBlockedNight) {
      setQuote(null);
      setQuoteStatus('idle');
      setQuoteError('');
      return () => {
        cancelled = true;
      };
    }

    setQuoteStatus('loading');
    setQuoteError('');
    getDirectBookingQuote({ roomId, checkIn, checkOut })
      .then((nextQuote) => {
        if (cancelled) return;
        setQuote(nextQuote);
        setQuoteStatus('ready');
      })
      .catch((error) => {
        if (cancelled) return;
        setQuote(null);
        setQuoteStatus('error');
        setQuoteError(error instanceof Error ? error.message : 'Could not calculate quote.');
      });

    return () => {
      cancelled = true;
    };
  }, [checkIn, checkOut, hasBlockedNight, nights, roomId]);

  const selectDate = (date: Date) => {
    const dateKey = toDateKey(date);
    const isOutsideMonth = !isSameMonth(date, calendarMonth);
    const isPast = isBefore(date, today);
    const isBooked = bookedDates.has(dateKey);

    if (isOutsideMonth || isPast || isBooked) return;

    setStatus('idle');
    setFeedback('');

    if (!checkIn || checkOut || dateKey <= checkIn) {
      setCheckIn(dateKey);
      setCheckOut('');
      return;
    }

    if (rangeHasBlockedNight(checkIn, dateKey, bookedDates)) {
      setCheckIn(dateKey);
      setCheckOut('');
      return;
    }

    setCheckOut(dateKey);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback('');

    if (!hasValidDates) {
      setStatus('error');
      setFeedback(
        hasBlockedNight
          ? 'Those dates include a booked night. Choose another range.'
          : quoteError || `Choose at least ${minNights} nights.`,
      );
      return;
    }

    if (guestFirstName.trim().length < 2 || guestLastName.trim().length < 2) {
      setStatus('error');
      setFeedback('Enter first and last name.');
      return;
    }

    try {
      setStatus('checking');
      const availability = await checkDirectBookingAvailability({ roomId, checkIn, checkOut });
      if (!availability.available) throw new Error('Those dates are no longer available.');

      setStatus('available');
      setStatus('submitting');
      const checkout = await createDirectBookingPublicCheckout({
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        guest_name: `${guestFirstName.trim()} ${guestLastName.trim()}`,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        message,
        marketing_consent: marketingConsent,
        terms_accepted: termsAccepted,
      });
      if (!checkout.checkout_url) throw new Error('Could not create payment page.');

      trackEvent('start_direct_booking_checkout', {
        room_id: roomId,
        room_name: roomName,
	        nights,
	        amount_pence: quote?.total_amount_pence ?? 0,
	        rate_plan: ratePlan,
        source_domain: DIRECT_BOOKING_DOMAIN,
      });

      window.location.href = checkout.checkout_url;
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'We could not submit this request yet.');
      return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid overflow-hidden rounded-lg border border-divider-subtle bg-surface-container shadow-2xl lg:grid-cols-2"
    >
      <section className="flex min-h-[620px] flex-col justify-between border-b border-divider-subtle p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
        <div>
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl font-bold italic text-primary">Select Dates</h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                {calendarStatus === 'loading' ? (
                  <Loader2 size={15} className="animate-spin text-primary" />
                ) : calendarStatus === 'ready' ? (
                  <CircleCheck size={15} className="text-primary" />
                ) : (
                  <CalendarCheck size={15} className="text-primary" />
                )}
                {calendarStatus === 'loading'
                  ? 'Loading availability'
                  : calendarStatus === 'ready'
                    ? 'Airbnb nights loaded'
                    : 'Availability checked when you send'}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-divider-subtle text-text-secondary transition hover:border-primary hover:text-primary"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-divider-subtle text-text-secondary transition hover:border-primary hover:text-primary"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="mb-5 text-center font-display text-xl font-bold text-text-primary">
            {format(calendarMonth, 'MMMM yyyy')}
          </div>

          <div className="mb-3 grid grid-cols-7 gap-1">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="text-center label-caps text-[8px] text-text-muted">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {calendarDays.map((date) => {
              const dateKey = toDateKey(date);
              const isOutsideMonth = !isSameMonth(date, calendarMonth);
              const isPast = isBefore(date, today);
              const isBooked = bookedDates.has(dateKey);
              const isDisabled = isOutsideMonth || isPast || isBooked;
              const isCheckIn = checkIn === dateKey;
              const isCheckOut = checkOut === dateKey;
              const isInRange = Boolean(checkIn && checkOut && dateKey > checkIn && dateKey < checkOut);

              return (
                <button
                  type="button"
                  key={dateKey}
                  disabled={isDisabled}
                  onClick={() => selectDate(date)}
                  className={[
                    'flex h-11 min-w-0 items-center justify-center rounded-lg border border-transparent transition',
                    isOutsideMonth ? 'text-text-muted/25' : 'text-text-primary',
                    isPast && !isBooked && !isOutsideMonth ? 'cursor-not-allowed text-text-muted line-through' : '',
                    isBooked ? 'cursor-not-allowed border-divider-subtle bg-surface-container-high text-text-secondary line-through shadow-inner' : '',
                    !isDisabled ? 'hover:border-primary hover:bg-primary/10' : '',
                    isInRange ? 'bg-primary/15 text-primary' : '',
                    isCheckIn || isCheckOut ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/10' : '',
                  ].join(' ')}
                  aria-label={`${format(date, 'dd MMM yyyy')}${isBooked ? ', unavailable' : ''}`}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 space-y-5 border-t border-divider-subtle pt-6">
          <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border border-divider-subtle" />Available</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" />Selected</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-divider-subtle bg-surface-container-high" />Booked</span>
          </div>
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <Moon size={15} />
            Minimum stay: {minNights} nights
          </p>
        </div>
      </section>

      <section className="flex min-h-[620px] flex-col justify-between bg-surface p-6 sm:p-8 lg:p-10">
        <div className="space-y-7">
          <div>
            <p className="label-caps text-[10px] text-primary">{roomName}</p>
            <h3 className="mt-3 font-display text-3xl font-bold italic text-text-primary">Book Direct</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-divider-subtle p-4">
              <p className="label-caps text-[8px] text-text-muted">Check-in</p>
              <p className="mt-2 text-sm font-semibold text-text-primary">{checkIn ? dateLabel(checkIn) : 'Select date'}</p>
            </div>
            <div className="rounded-lg border border-divider-subtle p-4">
              <p className="label-caps text-[8px] text-text-muted">Check-out</p>
              <p className="mt-2 text-sm font-semibold text-text-primary">{checkOut ? dateLabel(checkOut) : 'Select date'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="sr-only">First name</span>
              <input
                type="text"
                required
                autoComplete="given-name"
                value={guestFirstName}
                placeholder="First Name"
                onChange={(event) => setGuestFirstName(event.target.value)}
                className="w-full rounded-lg border border-divider-subtle bg-transparent px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="sr-only">Last name</span>
              <input
                type="text"
                required
                autoComplete="family-name"
                value={guestLastName}
                placeholder="Last Name"
                onChange={(event) => setGuestLastName(event.target.value)}
                className="w-full rounded-lg border border-divider-subtle bg-transparent px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                required
                value={guestEmail}
                placeholder="Email Address"
                onChange={(event) => setGuestEmail(event.target.value)}
                className="w-full rounded-lg border border-divider-subtle bg-transparent px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="sr-only">Phone number</span>
              <input
                type="tel"
                value={guestPhone}
                placeholder="Phone Number"
                onChange={(event) => setGuestPhone(event.target.value)}
                className="w-full rounded-lg border border-divider-subtle bg-transparent px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary"
              />
            </label>
          </div>

          <label className="block">
            <span className="sr-only">Message to host</span>
            <textarea
              rows={4}
              value={message}
              placeholder="Message to Host (Optional)"
              onChange={(event) => setMessage(event.target.value)}
              className="w-full resize-none rounded-lg border border-divider-subtle bg-transparent px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary"
            />
          </label>

          <div className="rounded-lg border border-divider-subtle bg-background-dark/40 p-5">
            <h4 className="font-display text-xl font-bold italic text-text-primary">Booking Summary</h4>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 text-text-secondary">
                <span>{nights || 0} night{nights === 1 ? '' : 's'}</span>
                <span>{checkIn && checkOut ? `${dateLabel(checkIn)} - ${dateLabel(checkOut)}` : 'Select dates'}</span>
              </div>
	              <div className="flex items-center justify-between gap-4 text-text-secondary">
	                <span>{ratePlan}</span>
	                <span>{quote ? `${moneyLabel(quote.nightly_rate_pence)} / night` : quoteStatus === 'loading' ? 'Loading rate' : 'Select dates'}</span>
	              </div>
	              <div className="flex items-center justify-between gap-4 text-text-secondary">
	                <span>Cleaning</span>
	                <span>{quote ? (quote.cleaning_fee_pence > 0 ? moneyLabel(quote.cleaning_fee_pence) : 'Included') : 'Included'}</span>
	              </div>
	              <div className="flex items-center justify-between gap-4 border-t border-divider-subtle pt-3 font-bold text-text-primary">
	                <span>Total</span>
	                <span className="text-right text-primary">{hasValidDates ? moneyLabel(totalAmountPence) : quoteStatus === 'loading' ? 'Calculating' : 'Select dates'}</span>
	              </div>
	              {quoteStatus === 'error' && quoteError && (
	                <p className="pt-1 text-xs text-red-300">{quoteError}</p>
	              )}
              {nights > 0 && nights < DIRECT_BOOKING_LONG_STAY_NIGHTS && (
                <p className="pt-1 text-xs text-text-muted">Stay 7+ nights to unlock the refundable long stay rate.</p>
              )}
            </div>
          </div>

          <div className="space-y-3 text-xs text-text-secondary">
            <label className="flex items-start gap-3 rounded-lg border border-divider-subtle bg-background-dark/30 p-4">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                className="mt-1 accent-primary"
              />
              <span>
                I agree to the direct booking terms and cancellation policy. The selected rate terms apply at booking.
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-lg border border-divider-subtle bg-background-dark/30 p-4">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(event) => setMarketingConsent(event.target.checked)}
                className="mt-1 accent-primary"
              />
              <span>
                I agree to receive occasional Wood Street offers by email or phone. Optional.
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-2 font-semibold text-primary">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary text-[10px]">1</span>
              Secure payment
            </span>
            <span className="h-px w-7 bg-divider-subtle" />
            <span className="flex items-center gap-2 text-text-muted">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-text-muted text-[10px]">2</span>
              Dates blocked
            </span>
            <span className="h-px w-7 bg-divider-subtle" />
            <span className="flex items-center gap-2 text-text-muted">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-text-muted text-[10px]">3</span>
              Confirmation
            </span>
          </div>

          <button
            type="submit"
	            disabled={!canSubmit || status === 'checking' || status === 'submitting'}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-6 py-5 text-sm font-bold text-on-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'checking' || status === 'submitting' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CreditCard size={16} />
            )}
            {status === 'checking' ? 'Checking Availability' : status === 'submitting' ? 'Opening Payment' : 'Continue to Payment'}
          </button>

          <p className="flex items-center justify-center gap-2 text-center text-xs text-text-muted">
            <LockKeyhole size={13} />
            Secure Stripe checkout. Airbnb is blocked after payment confirmation.
          </p>

          {feedback && (
            <p className={`text-center text-sm leading-relaxed ${status === 'success' ? 'text-primary' : 'text-red-300'}`}>
              {feedback}
            </p>
          )}
        </div>
      </section>
    </form>
  );
}
