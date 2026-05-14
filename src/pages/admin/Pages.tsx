import React, { useState } from 'react';
import { ChevronRight, CheckCircle, Info, ImagePlus } from 'lucide-react';
import { useSiteData } from '../../context/SiteContext';

export default function AdminPages() {
  const [activeTab, setActiveTab] = useState('Home');
  const { data, updatePage } = useSiteData();

  const tabs = ['Home', 'Spaces', 'Coworking', 'About', 'Amenities'];
  
  const activePageData = data.pages[activeTab];

  const handleUpdate = (field: string, value: string) => {
    updatePage(activeTab, { [field]: value });
  };

  return (
    <div className="p-12 pb-32">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="font-display text-4xl font-bold text-primary">Page Editor</h2>
          <div className="flex items-center gap-2 text-text-secondary text-sm mt-2">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-primary font-semibold">{activeTab} Page Editing</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
            Publish Changes
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <h3 className="font-display text-xl font-bold text-primary mb-4">Site Structure</h3>
          <div className="bg-surface-container rounded-xl p-4 border border-divider-subtle shadow-sm space-y-2">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left flex items-center justify-between p-4 rounded-lg transition-all ${activeTab === tab ? 'bg-white/5 border border-primary text-primary font-bold' : 'hover:bg-white/5 text-text-secondary font-medium'}`}
              >
                <span className="text-sm uppercase tracking-wider">{tab}</span>
                {activeTab === tab && <CheckCircle size={18} />}
              </button>
            ))}
          </div>
          
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mt-8">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Info size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Auto-Save Active</span>
            </div>
            <p className="text-sm text-text-muted">Changes are saved automatically.</p>
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-9 space-y-12">
          <section className="bg-surface-container rounded-2xl p-12 border border-divider-subtle shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-primary"></div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-display text-2xl font-bold text-primary">{activeTab} Details</h3>
              <span className="bg-[#2D5B4A]/20 text-[#8eced3] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#2D5B4A]/50">Live Preview Ready</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Page Title</label>
                  <textarea 
                    className="w-full p-4 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary resize-y" 
                    rows={3}
                    value={activePageData?.title || ''}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Page Description</label>
                  <textarea 
                    className="w-full p-4 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary resize-y" 
                    rows={4}
                    value={activePageData?.description || ''}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="relative group">
                <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Cover Image URL</label>
                <input 
                  className="w-full p-3 mb-4 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary text-xs" 
                  type="text" 
                  value={activePageData?.coverImage || ''}
                  onChange={(e) => handleUpdate('coverImage', e.target.value)}
                  placeholder="Paste image URL here"
                />
                <div className="relative aspect-video rounded-xl overflow-hidden border border-divider-subtle bg-background-dark">
                  {activePageData?.coverImage ? (
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Preview"
                      src={activePageData.coverImage}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                      <ImagePlus size={32} className="mb-2 opacity-50" />
                      <span className="text-xs uppercase tracking-wider">No Image Provided</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
