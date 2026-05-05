'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Hotel, Utensils, Camera, Search, Plus, X, ThumbsUp,
  CheckCircle2, Filter, ChevronDown, MessageSquare, TrendingUp,
  Sparkles, Loader2, Trash2, BadgeCheck, Calendar
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import StyledSelect from '@/components/StyledSelect/StyledSelect';
import styles from './reviews.module.css';

const categories = [
  { key: 'all', label: 'All', icon: Sparkles },
  { key: 'destination', label: 'Destinations', icon: MapPin },
  { key: 'hotel', label: 'Hotels', icon: Hotel },
  { key: 'restaurant', label: 'Restaurants', icon: Utensils },
  { key: 'experience', label: 'Experiences', icon: Camera },
];

const ratingLabels = ['', '😞 Terrible', '😕 Poor', '😐 Average', '😊 Good', '🤩 Amazing'];
const ratingColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#6C63FF'];

const indianCities = [
  'Goa', 'Jaipur', 'Manali', 'Kerala', 'Varanasi', 'Udaipur', 'Andaman',
  'Rishikesh', 'Delhi', 'Mumbai', 'Shimla', 'Agra', 'Kochi', 'Darjeeling',
  'Ooty', 'Leh', 'Jodhpur', 'Hampi', 'Mysuru', 'Amritsar',
];

export default function ReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, avgRating: 0, distribution: [] });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchCity, setSearchCity] = useState('');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [myReviewsOnly, setMyReviewsOnly] = useState(false);
  const [form, setForm] = useState({
    category: 'destination',
    title: '',
    city: '',
    rating: 0,
    text: '',
    visitDate: '',
    subRatings: { cleanliness: 0, location: 0, value: 0, service: 0 },
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [hoverSub, setHoverSub] = useState({});

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchCity) params.set('city', searchCity);
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (myReviewsOnly && session?.user?.id) params.set('userId', session.user.id);
      params.set('sort', sortBy);

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setStats(data.stats || { totalReviews: 0, avgRating: 0, distribution: [] });
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
    }
    setLoading(false);
  }, [searchCity, activeCategory, sortBy, myReviewsOnly, session?.user?.id]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSubmitReview = async () => {
    if (!form.title || !form.city || !form.rating || !form.text) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast('Review published! 🎉');
        setShowWriteModal(false);
        setForm({ category: 'destination', title: '', city: '', rating: 0, text: '', visitDate: '', subRatings: { cleanliness: 0, location: 0, value: 0, service: 0 } });
        fetchReviews();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to submit');
      }
    } catch (err) {
      showToast('Something went wrong');
    }
    setSubmitting(false);
  };

  const handleHelpful = async (reviewId) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action: 'helpful' }),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => prev.map(r =>
          r._id === reviewId
            ? { ...r, helpful: data.helpful, helpfulBy: data.voted ? [...(r.helpfulBy || []), session?.user?.id] : (r.helpfulBy || []).filter(id => id !== session?.user?.id) }
            : r
        ));
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Review deleted');
        fetchReviews();
      }
    } catch (err) { console.error(err); }
  };

  const StarRating = ({ value, onChange, onHover, hoverValue, size = 20 }) => (
    <div className={styles.starRow}>
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} className={styles.starBtn}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onHover?.(0)}>
          <Star size={size}
            fill={(hoverValue || value) >= star ? ratingColors[hoverValue || value] || '#6C63FF' : 'none'}
            stroke={(hoverValue || value) >= star ? ratingColors[hoverValue || value] || '#6C63FF' : 'var(--text-tertiary)'}
            strokeWidth={1.5} />
        </button>
      ))}
      {(hoverValue || value) > 0 && (
        <span className={styles.ratingLabel} style={{ color: ratingColors[hoverValue || value] }}>
          {ratingLabels[hoverValue || value]}
        </span>
      )}
    </div>
  );

  const DisplayStars = ({ rating, size = 14 }) => (
    <div className={styles.starRow}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} size={size}
          fill={rating >= star ? '#FFC107' : 'none'}
          stroke={rating >= star ? '#FFC107' : 'var(--text-tertiary)'}
          strokeWidth={1.5} />
      ))}
    </div>
  );

  const getCategoryIcon = (cat) => {
    const found = categories.find(c => c.key === cat);
    return found ? found.icon : MapPin;
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}><MessageSquare size={28} /> Travel Reviews</h1>
          <p className={styles.subtitle}>Share your experiences and help fellow travelers</p>
        </div>
        <button className={styles.writeBtn} onClick={() => setShowWriteModal(true)}>
          <Plus size={18} /> Write a Review
        </button>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statBig}>{stats.avgRating || '—'}</div>
          <DisplayStars rating={Math.round(stats.avgRating)} />
          <div className={styles.statSub}>{stats.totalReviews} reviews</div>
        </div>
        <div className={styles.distributionCard}>
          {(stats.distribution || []).map(d => (
            <div key={d.star} className={styles.distRow}>
              <span className={styles.distStar}>{d.star}★</span>
              <div className={styles.distBarBg}>
                <motion.div className={styles.distBarFill} initial={{ width: 0 }}
                  animate={{ width: `${d.percent}%` }} transition={{ duration: 0.5 }}
                  style={{ background: ratingColors[d.star] }} />
              </div>
              <span className={styles.distCount}>{d.count}</span>
            </div>
          ))}
        </div>
        <div className={styles.statCard}>
          <TrendingUp size={24} className={styles.statIcon} />
          <div className={styles.statBig}>{reviews.filter(r => r.verified).length}</div>
          <div className={styles.statSub}>Verified Reviews</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.categoryTabs}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button key={cat.key}
                className={`${styles.catTab} ${activeCategory === cat.key ? styles.catTabActive : ''}`}
                onClick={() => setActiveCategory(cat.key)}>
                <Icon size={15} /> {cat.label}
              </button>
            );
          })}
        </div>
        <div className={styles.filterRow}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input type="text" placeholder="Search by city..." value={searchCity}
              onChange={e => setSearchCity(e.target.value)} className={styles.searchInput} />
          </div>
          <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
          <button className={`${styles.filterBtn} ${myReviewsOnly ? styles.filterBtnActive : ''}`}
            onClick={() => setMyReviewsOnly(!myReviewsOnly)}>
            {myReviewsOnly ? 'All Reviews' : 'My Reviews'}
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className={styles.reviewsList}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={32} className={styles.spinner} />
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageSquare size={48} strokeWidth={1} />
            <h3>No reviews yet</h3>
            <p>Be the first to share your travel experience!</p>
            <button className={styles.writeBtn} onClick={() => setShowWriteModal(true)}>
              <Plus size={18} /> Write the first review
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {reviews.map((review, i) => {
              const CatIcon = getCategoryIcon(review.category);
              const isOwn = session?.user?.id === review.userId;
              const hasVoted = (review.helpfulBy || []).includes(session?.user?.id);
              return (
                <motion.div key={review._id} className={styles.reviewCard}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}>
                  {/* Card Header */}
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewUser}>
                      {review.userImage ? (
                        <img src={review.userImage} alt="" className={styles.userAvatar} />
                      ) : (
                        <div className={styles.userAvatarPlaceholder}>{(review.userName || 'T')[0]}</div>
                      )}
                      <div>
                        <div className={styles.userName}>
                          {review.userName}
                          {review.verified && (
                            <span className={styles.verifiedBadge}><BadgeCheck size={14} /> Verified Trip</span>
                          )}
                        </div>
                        <div className={styles.reviewMeta}>
                          {review.visitDate && <span><Calendar size={12} /> {review.visitDate}</span>}
                          <span>{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    {isOwn && (
                      <button className={styles.deleteBtn} onClick={() => handleDelete(review._id)}>
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Title + Category */}
                  <div className={styles.reviewTitleRow}>
                    <span className={styles.catBadge}>
                      <CatIcon size={13} /> {categories.find(c => c.key === review.category)?.label}
                    </span>
                    <h3 className={styles.reviewTitle}>{review.title}</h3>
                    <span className={styles.cityBadge}><MapPin size={12} /> {review.city}</span>
                  </div>

                  {/* Stars */}
                  <div className={styles.reviewRating}>
                    <DisplayStars rating={review.rating} size={16} />
                    <span className={styles.ratingText} style={{ color: ratingColors[review.rating] }}>
                      {ratingLabels[review.rating]}
                    </span>
                  </div>

                  {/* Sub-ratings for hotels */}
                  {review.category === 'hotel' && review.subRatings && (
                    <div className={styles.subRatings}>
                      {Object.entries(review.subRatings).filter(([, v]) => v > 0).map(([key, val]) => (
                        <div key={key} className={styles.subRatingItem}>
                          <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          <div className={styles.subRatingStars}>
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={10} fill={val >= s ? '#FFC107' : 'none'}
                                stroke={val >= s ? '#FFC107' : 'var(--text-tertiary)'} strokeWidth={1.5} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Review text */}
                  <p className={styles.reviewText}>{review.text}</p>

                  {/* Footer */}
                  <div className={styles.reviewFooter}>
                    <button className={`${styles.helpfulBtn} ${hasVoted ? styles.helpfulBtnActive : ''}`}
                      onClick={() => handleHelpful(review._id)}>
                      <ThumbsUp size={14} /> Helpful ({review.helpful || 0})
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showWriteModal && (
          <motion.div className={styles.modalOverlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowWriteModal(false)}>
            <motion.div className={styles.modal}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Write a Review</h2>
                <button onClick={() => setShowWriteModal(false)} className={styles.modalClose}><X size={20} /></button>
              </div>

              <div className={styles.modalBody}>
                {/* Category */}
                <div className={styles.field}>
                  <label>Category</label>
                  <div className={styles.categoryPicker}>
                    {categories.filter(c => c.key !== 'all').map(cat => {
                      const Icon = cat.icon;
                      return (
                        <button key={cat.key}
                          className={`${styles.catPickBtn} ${form.category === cat.key ? styles.catPickActive : ''}`}
                          onClick={() => setForm({ ...form, category: cat.key })}>
                          <Icon size={16} /> {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div className={styles.field}>
                  <label>{form.category === 'destination' ? 'Destination Name' : form.category === 'hotel' ? 'Hotel Name' : form.category === 'restaurant' ? 'Restaurant Name' : 'Experience Name'}</label>
                  <input type="text" placeholder="e.g. Taj Lake Palace" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} className={styles.input} />
                </div>

                {/* City */}
                <div className={styles.field}>
                  <label>City</label>
                  <StyledSelect
                    options={indianCities}
                    value={form.city}
                    onChange={(val) => setForm({ ...form, city: val })}
                    placeholder="Select city"
                    icon={MapPin}
                    searchable
                  />
                </div>

                {/* Overall Rating */}
                <div className={styles.field}>
                  <label>Overall Rating</label>
                  <StarRating value={form.rating} onChange={r => setForm({ ...form, rating: r })}
                    onHover={setHoverRating} hoverValue={hoverRating} size={28} />
                </div>

                {/* Sub-ratings for hotels */}
                {form.category === 'hotel' && (
                  <div className={styles.field}>
                    <label>Detailed Ratings (optional)</label>
                    <div className={styles.subRatingGrid}>
                      {['cleanliness', 'location', 'value', 'service'].map(key => (
                        <div key={key} className={styles.subRatingField}>
                          <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          <StarRating value={form.subRatings[key]}
                            onChange={v => setForm({ ...form, subRatings: { ...form.subRatings, [key]: v } })}
                            onHover={v => setHoverSub({ ...hoverSub, [key]: v })}
                            hoverValue={hoverSub[key] || 0} size={18} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visit Date */}
                <div className={styles.field}>
                  <label>When did you visit? (optional)</label>
                  <input type="month" value={form.visitDate}
                    onChange={e => setForm({ ...form, visitDate: e.target.value })} className={styles.input} />
                </div>

                {/* Review Text */}
                <div className={styles.field}>
                  <label>Your Review</label>
                  <textarea placeholder="Share your experience..." value={form.text}
                    onChange={e => setForm({ ...form, text: e.target.value })}
                    className={styles.textarea} maxLength={2000} />
                  <div className={styles.charCount}>{form.text.length}/2000</div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={() => setShowWriteModal(false)}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleSubmitReview}
                  disabled={submitting || !form.title || !form.city || !form.rating || !form.text}>
                  {submitting ? <><Loader2 size={16} className={styles.spinner} /> Publishing...</> : 'Publish Review'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className={styles.toast}
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}>
            <CheckCircle2 size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
