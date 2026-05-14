import React from 'react';
import { ChevronRight, PlusCircle, Edit, Camera, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData, Room } from '../../context/SiteContext';

export default function AdminRooms() {
  const { data } = useSiteData();
  const rooms: Room[] = Object.values(data.rooms);

  return (
    <div className="p-12 pb-32">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="font-display text-4xl font-bold text-primary">Rooms</h2>
          <div className="flex items-center gap-2 text-text-secondary text-sm mt-2">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-primary font-semibold">Manage Rooms</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
            <PlusCircle size={18} /> Add New Room
          </button>
        </div>
      </header>

      <section className="bg-surface-container rounded-2xl p-12 border border-divider-subtle shadow-sm">
        <div className="space-y-4">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center gap-6 p-4 border border-divider-subtle rounded-xl hover:bg-white/5 transition-all">
              <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0">
                <img 
                  className="w-full h-full object-cover" 
                  alt={room.name}
                  src={room.image}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-display text-xl font-bold text-primary">{room.name}</h4>
                <p className="text-sm text-text-muted">{room.type} &bull; {room.details}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/rooms/${room.id}`} className="p-2 text-primary hover:bg-white/10 rounded-lg transition-all" title="Edit Content">
                  <Edit size={20} />
                </Link>
                <button className="p-2 text-primary hover:bg-white/10 rounded-lg transition-all" title="Change Photo">
                  <Camera size={20} />
                </button>
                <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
