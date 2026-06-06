import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

type PaymentStatus = 'checking' | 'paid' | 'pending' | 'failed' | 'expired' | 'not_found' | 'error';

const copyByStatus: Record<PaymentStatus, { title: string; body: string }> = {
  checking: {
    title: 'Verifying Payment',
    body: 'We are checking the Stripe confirmation before blocking the direct booking calendar.',
  },
  paid: {
    title: 'Payment Received',
    body: 'Your payment has been received. Michelle will follow up with confirmation details and check-in information.',
  },
  pending: {
    title: 'Payment Processing',
    body: 'Stripe is still processing this payment. Please wait a moment before closing this page.',
  },
  failed: {
    title: 'Payment Not Confirmed',
    body: 'Stripe did not confirm this payment. Your dates have not been added to the direct booking calendar.',
  },
  expired: {
    title: 'Payment Expired',
    body: 'This checkout session expired. Your dates have not been added to the direct booking calendar.',
  },
  not_found: {
    title: 'Payment Not Found',
    body: 'We could not find this Stripe checkout session. Your dates have not been added to the direct booking calendar.',
  },
  error: {
    title: 'Payment Verification Failed',
    body: 'We could not verify the payment yet. If you paid, Michelle can confirm it from the booking dashboard.',
  },
};

export default function BookingSuccess() {
  const [status, setStatus] = useState<PaymentStatus>('checking');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) {
      setStatus('not_found');
      return;
    }

    fetch(`/api/direct-booking/payment-status?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          setStatus(response.status === 404 ? 'not_found' : 'error');
          return;
        }

        if (payload.status === 'paid') setStatus('paid');
        else if (payload.status === 'checkout_created') setStatus('pending');
        else if (payload.status === 'failed') setStatus('failed');
        else if (payload.status === 'expired') setStatus('expired');
        else setStatus('error');
      })
      .catch(() => setStatus('error'));
  }, []);

  const copy = copyByStatus[status];
  const Icon = status === 'paid' ? CheckCircle : status === 'checking' || status === 'pending' ? Clock : XCircle;

  return (
    <main className="min-h-screen bg-background-dark flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <Icon className="mx-auto text-primary mb-8" size={44} />
        <h1 className="font-display text-5xl font-black italic text-primary mb-6">{copy.title}</h1>
        <p className="text-text-secondary leading-relaxed italic mb-10">
          {copy.body}
        </p>
        <Link to="/coliving/executive-studio" className="inline-flex bg-primary text-on-primary px-8 py-4 rounded-lg label-caps text-xs font-bold">
          Back to Room 6
        </Link>
      </div>
    </main>
  );
}
