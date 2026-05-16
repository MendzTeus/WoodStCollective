import React, { useState } from 'react';
import { ChevronRight, Star, CheckCircle, XCircle, PlusCircle, Trash2, X, Edit2 } from 'lucide-react';
import { useSiteData, Review } from '../../context/SiteContext';

export default function AdminReviews() {
  const { data, updateReview, addReview, deleteReview } = useSiteData();
  const rooms = Object.values(data.rooms);
  const reviews: Review[] = Object.values(data.reviews);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeScope, setActiveScope] = useState('all');
  const [newReview, setNewReview] = useState<Partial<Review>>({
    reviewerName: '',
    reviewerRole: '',
    rating: 5,
    comment: '',
    approved: true,
    showOnHome: false
  });

  const getRoomName = (roomId?: string) => {
    if (!roomId) return 'Home / global';
    return data.rooms[roomId]?.name || roomId;
  };

  const countForScope = (scope: string) => {
    if (scope === 'all') return reviews.length;
    if (scope === 'home') return reviews.filter(review => review.showOnHome).length;
    return reviews.filter(review => review.roomId === scope).length;
  };

  const filteredReviews = reviews.filter(review => {
    if (activeScope === 'all') return true;
    if (activeScope === 'home') return review.showOnHome;
    return review.roomId === activeScope;
  });

  const toggleApproval = (id: string, approved: boolean) => {
    updateReview(id, { approved });
  };

  const toggleHome = (review: Review) => {
    updateReview(review.id, { showOnHome: !review.showOnHome });
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewReview({
      reviewerName: '',
      reviewerRole: '',
      rating: 5,
      comment: '',
      approved: true,
      showOnHome: activeScope === 'home',
      roomId: activeScope !== 'all' && activeScope !== 'home' ? activeScope : undefined
    });
    setShowModal(true);
  };

  const openEditModal = (review: Review) => {
    setEditingId(review.id);
    setNewReview(review);
    setShowModal(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.reviewerName || !newReview.comment) return;

    const reviewPayload: Partial<Review> = {
      ...newReview,
      roomId: newReview.roomId || undefined,
      showOnHome: newReview.showOnHome ?? false,
      reviewerRole: newReview.reviewerRole || 'Guest',
      rating: newReview.rating || 5,
      approved: newReview.approved ?? true
    };

    if (editingId) {
      updateReview(editingId, reviewPayload);
    } else {
      const review: Review = {
        id: crypto.randomUUID(),
        reviewerName: newReview.reviewerName,
        reviewerRole: reviewPayload.reviewerRole || 'Guest',
        rating: reviewPayload.rating || 5,
        comment: newReview.comment,
        approved: reviewPayload.approved ?? true,
        roomId: reviewPayload.roomId,
        showOnHome: reviewPayload.showOnHome
      };
      addReview(review);
    }

    setShowModal(false);
  };

  return (
    <div className="p-12 pb-32 relative">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="font-display text-4xl font-bold text-primary">Reviews</h2>
          <div className="flex items-center gap-2 text-text-secondary text-sm mt-2">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-primary font-semibold">Manage Reviews</span>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
          <PlusCircle size={18} /> Add Review
        </button>
      </header>

      <section className="mb-8 flex flex-wrap gap-3">
        {[
          { id: 'all', label: 'All Reviews' },
          { id: 'home', label: 'Home Page' }
        ].map(scope => (
          <button
            key={scope.id}
            onClick={() => setActiveScope(scope.id)}
            className={`px-4 py-2 rounded-full border text-xs font-bold transition-colors ${activeScope === scope.id ? 'bg-primary text-on-primary border-primary' : 'border-divider-subtle text-text-secondary hover:text-primary'}`}
          >
            {scope.label} ({countForScope(scope.id)})
          </button>
        ))}
        {rooms.map(room => (
          <button
            key={room.id}
            onClick={() => setActiveScope(room.id)}
            className={`px-4 py-2 rounded-full border text-xs font-bold transition-colors ${activeScope === room.id ? 'bg-primary text-on-primary border-primary' : 'border-divider-subtle text-text-secondary hover:text-primary'}`}
          >
            {room.name} ({countForScope(room.id)})
          </button>
        ))}
      </section>

      <section className="bg-surface-container rounded-2xl p-1 border border-divider-subtle shadow-sm overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-background-dark/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Reviewer</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Placement</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Rating</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Comment</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Status / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider-subtle">
            {filteredReviews.map(review => (
              <tr key={review.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-text-primary">{review.reviewerName}</div>
                  <div className="text-xs text-text-muted">{review.reviewerRole}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-text-primary">{getRoomName(review.roomId)}</div>
                  {review.showOnHome && (
                    <div className="mt-2 inline-flex px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      Home page
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-text-primary">
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? 'text-primary' : 'text-divider-subtle'} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-text-primary">
                  <p className="text-sm line-clamp-2 text-text-secondary w-80">"{review.comment}"</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    {review.approved ? (
                      <>
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-1">
                          <CheckCircle size={14} /> Approved
                        </span>
                        <button onClick={() => toggleApproval(review.id, false)} className="px-3 py-1 bg-surface-container text-text-secondary rounded-full text-xs font-bold border border-divider-subtle hover:text-text-primary transition-colors">
                          Hide
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-bold border border-red-500/20 flex items-center gap-1">
                          <XCircle size={14} /> Hidden
                        </span>
                        <button onClick={() => toggleApproval(review.id, true)} className="px-3 py-1 bg-surface-container text-text-secondary rounded-full text-xs font-bold border border-divider-subtle hover:text-text-primary transition-colors">
                          Approve
                        </button>
                      </>
                    )}
                    <button onClick={() => toggleHome(review)} className="px-3 py-1 bg-surface-container text-text-secondary rounded-full text-xs font-bold border border-divider-subtle hover:text-primary transition-colors">
                      {review.showOnHome ? 'Remove Home' : 'Show Home'}
                    </button>
                    <button
                      onClick={() => openEditModal(review)}
                      className="p-1.5 text-primary/70 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                      title="Edit Review"
                      aria-label={`Edit review from ${review.reviewerName}`}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                      title="Delete Review"
                      aria-label={`Delete review from ${review.reviewerName}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-divider-subtle rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-2xl font-bold text-primary">{editingId ? 'Edit Review' : 'Add Review'}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-primary transition-colors" aria-label="Close review modal">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Reviewer Name</label>
                <input
                  required
                  type="text"
                  value={newReview.reviewerName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewerName: e.target.value }))}
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Date / Role</label>
                <input
                  type="text"
                  value={newReview.reviewerRole}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewerRole: e.target.value }))}
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary text-sm"
                  placeholder="e.g. January 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Room</label>
                <select
                  value={newReview.roomId || ''}
                  onChange={(e) => setNewReview(prev => ({ ...prev, roomId: e.target.value || undefined }))}
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary text-sm"
                >
                  <option value="">Home / global</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary text-sm"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Comment</label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary text-sm resize-none"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={Boolean(newReview.approved)}
                  onChange={(e) => setNewReview(prev => ({ ...prev, approved: e.target.checked }))}
                  className="accent-primary"
                />
                Approved on site
              </label>

              <label className="flex items-center gap-3 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={Boolean(newReview.showOnHome)}
                  onChange={(e) => setNewReview(prev => ({ ...prev, showOnHome: e.target.checked }))}
                  className="accent-primary"
                />
                Show on home page
              </label>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-background-dark text-text-primary font-bold rounded-lg border border-divider-subtle hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  {editingId ? 'Save Changes' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
