import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSiteData } from '../../context/SiteContext';
import type { Room } from '../../context/SiteContext';
import { saveSiteContent } from '../../lib/siteContent';
import ImageUploadField from '../../components/admin/ImageUploadField';

type StringRoomField = {
  [K in keyof Room]-?: NonNullable<Room[K]> extends string ? K : never;
}[keyof Room];

export default function AdminRoomEditor() {
  const { id } = useParams();
  const { data, updateRoom } = useSiteData();

  const originalRoom = id ? data.rooms[id] : null;
  const [localRoom, setLocalRoom] = useState(originalRoom);
  const [activeSave, setActiveSave] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!originalRoom || !localRoom) {
    return (
      <div className="p-12">
        <h2 className="text-xl text-primary font-bold">Room not found</h2>
        <Link to="/admin/rooms" className="text-primary hover:underline mt-4 inline-block">Back to Rooms</Link>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!id) return;
    setActiveSave(true);
    setSaveError(null);
    try {
      const updatedData = {
        ...data,
        rooms: { ...data.rooms, [id]: { ...data.rooms[id], ...localRoom } },
      };
      updateRoom(id, localRoom);
      await saveSiteContent(updatedData);
    } catch {
      setSaveError('Failed to save. Please try again.');
    } finally {
      setActiveSave(false);
    }
  };

  const setField = (field: StringRoomField, value: string) => {
    setLocalRoom(prev => prev ? ({ ...prev, [field]: value } as Room) : prev);
  };

  const setGalleryImage = (index: number, value: string) => {
    setLocalRoom(prev => {
      if (!prev) return prev;
      const gallery = [...prev.gallery];
      gallery[index] = value;
      return { ...prev, gallery };
    });
  };

  const removeGalleryImage = (index: number) => {
    setLocalRoom(prev => {
      if (!prev) return prev;
      return { ...prev, gallery: prev.gallery.filter((_, i) => i !== index) };
    });
  };
  
  const setFeature = (index: number, field: string, value: string) => {
    setLocalRoom(prev => {
      if (!prev) return prev;
      const features = [...prev.features];
      features[index] = { ...features[index], [field]: value };
      return { ...prev, features };
    });
  };

  return (
    <div className="p-12 pb-32">
      <header className="flex justify-between items-center mb-12">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link to="/admin/rooms" className="text-text-secondary hover:text-primary transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h2 className="font-display text-4xl font-bold text-primary">Edit Room</h2>
          </div>
          <div className="flex items-center gap-2 text-text-secondary text-sm ml-10">
            <span>Admin</span>
            <ChevronRight size={14} />
            <Link to="/admin/rooms" className="hover:text-primary transition-colors">Rooms</Link>
            <ChevronRight size={14} />
            <span className="text-primary font-semibold">{localRoom.name}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleUpdate}
            className={`px-6 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 ${activeSave ? 'opacity-70 scale-95' : ''}`}>
            <Save size={18} /> {activeSave ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      {saveError && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section className="bg-surface-container rounded-2xl p-8 border border-divider-subtle shadow-sm">
            <h3 className="font-display text-2xl font-bold text-primary mb-6">General Information</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Room Name</label>
                  <input 
                    className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary" 
                    type="text" 
                    value={localRoom.name}
                    onChange={(e) => setField('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Room Type</label>
                  <input 
                    className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary" 
                    type="text" 
                    value={localRoom.type}
                    onChange={(e) => setField('type', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Short Description</label>
                <input 
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary" 
                  type="text" 
                  value={localRoom.description}
                  onChange={(e) => setField('description', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Long Description</label>
                <textarea 
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary resize-y" 
                  rows={5}
                  value={localRoom.longDescription}
                  onChange={(e) => setField('longDescription', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Details (e.g. "King Bed")</label>
                <input 
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary" 
                  type="text" 
                  value={localRoom.details}
                  onChange={(e) => setField('details', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Airbnb Link</label>
                <input 
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary" 
                  type="url" 
                  placeholder="https://airbnb.com/..."
                  value={localRoom.airbnbUrl || ''}
                  onChange={(e) => setField('airbnbUrl', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Enquiry Email</label>
                  <input
                    className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary"
                    type="email"
                    placeholder="hello@woodstreet..."
                    value={localRoom.enquiryEmail || ''}
                    onChange={(e) => setField('enquiryEmail', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">WhatsApp Link or Number</label>
                  <input
                    className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary"
                    type="text"
                    placeholder="https://wa.me/..."
                    value={localRoom.whatsappUrl || ''}
                    onChange={(e) => setField('whatsappUrl', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container rounded-2xl p-8 border border-divider-subtle shadow-sm">
            <h3 className="font-display text-2xl font-bold text-primary mb-6">Features</h3>
            
            <div className="space-y-4">
              {localRoom.features.map((feature, i) => (
                <div key={i} className="flex gap-4 items-start p-4 border border-divider-subtle rounded-xl bg-background-dark">
                  <div className="w-1/3">
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Title</label>
                    <input 
                      className="w-full p-2 bg-surface-container border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-sm text-text-primary" 
                      type="text" 
                      value={feature.title}
                      onChange={(e) => setFeature(i, 'title', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Description</label>
                    <input 
                      className="w-full p-2 bg-surface-container border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-sm text-text-primary" 
                      type="text" 
                      value={feature.desc}
                      onChange={(e) => setFeature(i, 'desc', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button 
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider mt-4"
                onClick={() => setLocalRoom(prev => prev ? {...prev, features: [...prev.features, { title: '', desc: ''}]} : prev)}
              >
                + Add Feature
              </button>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section className="bg-surface-container rounded-2xl p-8 border border-divider-subtle shadow-sm">
            <h3 className="font-display text-xl font-bold text-primary mb-4">Main Image</h3>
            <ImageUploadField
              label="Room Image"
              value={localRoom.image}
              folder={`rooms/${localRoom.id}/main`}
              previewAspect="aspect-[4/3]"
              onChange={(url) => setField('image', url)}
            />
          </section>

          <section className="bg-surface-container rounded-2xl p-8 border border-divider-subtle shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="font-display text-xl font-bold text-primary">Gallery Images</h3>
              <button
                type="button"
                onClick={() => setLocalRoom(prev => prev ? { ...prev, gallery: [...prev.gallery, ''] } : prev)}
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
              >
                + Add Image
              </button>
            </div>
            <div className="space-y-6">
              {localRoom.gallery.map((img, i) => (
                <div key={i} className="relative">
                  <ImageUploadField
                    label={`Gallery Image ${i + 1}`}
                    value={img}
                    folder={`rooms/${localRoom.id}/gallery`}
                    previewAspect="aspect-square"
                    onChange={(url) => setGalleryImage(i, url)}
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-0 right-0 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Remove image"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
