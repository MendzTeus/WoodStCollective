import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';

export default function BookingCancel() {
  const [releaseStatus, setReleaseStatus] = useState('Releasing the selected dates...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('booking_id');
    const cancelToken = params.get('cancel_token');
    if (!bookingId || !cancelToken) {
      setReleaseStatus('Your dates were not added to the direct booking calendar.');
      return;
    }

    fetch('/api/direct-booking/public-cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId, cancel_token: cancelToken }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Cancel failed');
        setReleaseStatus('The selected dates have been released.');
      })
      .catch(() => {
        setReleaseStatus('Your payment was cancelled. If the dates still appear held, they will be released automatically.');
      });
  }, []);

  return (
    <main className="min-h-screen bg-background-dark flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <XCircle className="mx-auto text-primary mb-8" size={44} />
        <h1 className="font-display text-5xl font-black italic text-primary mb-6">Payment Cancelled</h1>
        <p className="text-text-secondary leading-relaxed italic mb-10">
          Checkout was cancelled. Your request has not been confirmed or added to the direct booking calendar.
        </p>
        <p className="text-text-muted text-sm leading-relaxed italic mb-10">
          {releaseStatus}
        </p>
        <Link to="/coliving/executive-studio" className="inline-flex bg-primary text-on-primary px-8 py-4 rounded-lg label-caps text-xs font-bold">
          Return to Room 6
        </Link>
      </div>
    </main>
  );
}
