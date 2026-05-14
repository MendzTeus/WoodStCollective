import React, { useState } from 'react';
import { ChevronRight, Star, CheckCircle, XCircle, PlusCircle, Trash2, X, Edit2 } from 'lucide-react';
import { useSiteData, Review } from '../../context/SiteContext';

export default function AdminReviews() {
  const { data, updateReview, addReview, deleteReview } = useSiteData();
  const reviews: Review[] = Object.values(data.reviews);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    reviewerName: '',
    reviewerRole: '',
    rating: 5,
    comment: '',
    approved: true
  });

  const toggleApproval = (id: string, approved: boolean) => {
    updateReview(id, { approved });
  };
  
  const openAddModal = () => {
    setEditingId(null);
    setNewReview({
      reviewerName: '',
      reviewerRole: '',
      rating: 5,
      comment: '',
      approved: true
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
    
    if (editingId) {
      updateReview(editingId, newReview);
    } else {
      const review: Review = {
        id: Date.now().toString(),
        reviewerName: newReview.reviewerName,
        reviewerRole: newReview.reviewerRole || 'Guest',
        rating: newReview.rating || 5,
        comment: newReview.comment,
        approved: newReview.approved ?? true
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

      <section className="bg-surface-container rounded-2xl p-1 border border-divider-subtle shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background-dark/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Reviewer</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Rating</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Comment</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Status / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider-subtle">
            {reviews.map(review => (
              <tr key={review.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-text-primary">{review.reviewerName}</div>
                  <div className="text-xs text-text-muted">{review.reviewerRole}</div>
                </td>
                <td className="px-6 py-4 text-text-primary">
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-primary" : "text-divider-subtle"} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-text-primary">
                  <p className="text-sm line-clamp-2 text-text-secondary w-64 md:w-auto">"{review.comment}"</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 items-center">
                    {review.approved ? (
                      <>
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20 mr-2 flex items-center gap-1">
                          <CheckCircle size={14} /> Approved
                        </span>
                        <button onClick={() => toggleApproval(review.id, false)} className="px-3 py-1 bg-surface-container text-text-secondary rounded-full text-xs font-bold border border-divider-subtle hover:text-text-primary transition-colors">
                          Hide
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-bold border border-red-500/20 mr-2 flex items-center gap-1">
                          <XCircle size={14} /> Hidden
                        </span>
                        <button onClick={() => toggleApproval(review.id, true)} className="px-3 py-1 bg-surface-container text-text-secondary rounded-full text-xs font-bold border border-divider-subtle hover:text-text-primary transition-colors">
                          Approve
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => openEditModal(review)}
                      className="p-1.5 ml-2 text-primary/70 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                      title="Edit Review"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteReview(review.id)}
                      className="p-1.5 ml-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                      title="Delete Review"
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
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-primary transition-colors">
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
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Role / Suite</label>
                <input 
                  required
                  type="text" 
                  value={newReview.reviewerRole}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewerRole: e.target.value }))}
                  className="w-full p-3 bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-colors text-text-primary text-sm"
                  placeholder="e.g. Guest (Heritage Suite)"
                />
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
