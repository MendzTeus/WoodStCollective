import { useState } from 'react';
import { CalendarCheck, ExternalLink } from 'lucide-react';
import DirectBookingRequest from '../../components/DirectBookingRequest';
import { directBookingRooms } from '../../lib/directBookingRooms';

export default function AdminRoom6DirectBooking() {
  const [selectedRoomId, setSelectedRoomId] = useState('executive-studio');
  const selectedRoom = directBookingRooms.find((room) => room.id === selectedRoomId) || directBookingRooms[0];

  return (
    <div className="p-8 lg:p-12 pb-32 max-w-[1440px] mx-auto">
      <header className="flex flex-col gap-6 mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3 text-primary mb-4">
            <CalendarCheck size={22} />
            <span className="label-caps text-[10px]">Admin Test</span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-black italic text-primary">
            Direct Booking Test
          </h1>
          <p className="text-text-secondary text-sm mt-4 max-w-2xl leading-relaxed">
            Protected test screen for Rooms 1-6. Requests submitted here use the live booking API,
            but the booking module is not shown on the public room pages yet.
          </p>
        </div>

        <a
          href="/admin/bookings"
          className="inline-flex items-center justify-center gap-3 rounded-lg border border-divider-subtle px-5 py-3 text-sm font-bold text-text-secondary transition hover:border-primary hover:text-primary"
        >
          Manage Bookings
          <ExternalLink size={15} />
        </a>
      </header>

      <div className="mb-8 flex flex-wrap gap-3">
        {directBookingRooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => setSelectedRoomId(room.id)}
            className={[
              'rounded-lg border px-4 py-3 text-left transition',
              selectedRoomId === room.id
                ? 'border-primary bg-primary text-on-primary'
                : 'border-divider-subtle text-text-secondary hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            <span className="block text-xs font-bold uppercase tracking-wider">{room.label}</span>
            <span className="block text-sm">{room.name}</span>
          </button>
        ))}
      </div>

      <DirectBookingRequest roomId={selectedRoom.id} roomName={selectedRoom.name} />
    </div>
  );
}
