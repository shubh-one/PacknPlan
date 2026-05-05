'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Wallet, Users, Plus, Trash2,
  Brain, Sparkles, Loader2, CheckCircle2, X, Search,
  ChevronDown, Plane, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import StyledSelect from '@/components/StyledSelect/StyledSelect';
import styles from './mytrips.module.css';

const tripGradients = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
];

const statusColors = {
  'Planning': '#6C63FF',
  'Booked': '#FFA502',
  'In Progress': '#2ED573',
  'Completed': '#a18cd1',
};

const indianCities = [
  'Goa', 'Jaipur', 'Manali', 'Kerala', 'Varanasi', 'Udaipur', 'Andaman',
  'Rishikesh', 'Delhi', 'Mumbai', 'Shimla', 'Agra', 'Kochi', 'Darjeeling',
  'Ooty', 'Leh', 'Jodhpur', 'Hampi', 'Mysuru', 'Amritsar', 'Srinagar',
  'Kodaikanal', 'Pondicherry', 'Bangalore', 'Chennai', 'Pune',
];

export default function MyTripsPage() {
  const { session, status } = useRequireAuth();
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    if (status === 'authenticated') fetchTrips();
  }, [status]);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips');
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleCreateTrip = async () => {
    if (!form.destination || !form.startDate || !form.endDate || !form.budget) return;
    setCreating(true);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: form.destination,
          startDate: form.startDate,
          endDate: form.endDate,
          budget: Number(form.budget),
          travelers: Number(form.travelers) || 1,
          status: 'Planning',
        }),
      });
      if (res.ok) {
        showToast('Trip created! ✈️');
        setShowCreateModal(false);
        setForm({ destination: '', startDate: '', endDate: '', budget: '', travelers: 1 });
        fetchTrips();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to create trip');
      }
    } catch (err) {
      showToast('Something went wrong');
    }
    setCreating(false);
  };

  const handleDeleteTrip = async (tripId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this trip and all its expenses? This cannot be undone.')) return;
    setDeleting(tripId);
    try {
      const res = await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Trip deleted');
        setTrips(prev => prev.filter(t => t._id !== tripId));
      }
    } catch (err) {
      showToast('Failed to delete trip');
    }
    setDeleting(null);
  };

  const filteredTrips = trips.filter(trip => {
    const matchSearch = !searchQuery || trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || trip.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getDaysUntil = (startDate) => {
    const diff = Math.ceil((new Date(startDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Past';
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  };

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Link href="/dashboard" className={styles.backLink}>
            <ArrowLeft size={18} /> Dashboard
          </Link>
          <h1 className={styles.title}><Plane size={26} /> My Trips</h1>
          <p className={styles.subtitle}>{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/dashboard/planner" className={styles.aiBtn}>
            <Brain size={16} /> AI Planner
          </Link>
          <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Quick Trip
          </button>
        </div>
      </div>

      {/* Filters */}
      {trips.length > 0 && (
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input type="text" placeholder="Search trips..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} className={styles.searchInput} />
          </div>
          <div className={styles.statusTabs}>
            {['all', 'Planning', 'Booked', 'In Progress', 'Completed'].map(s => (
              <button key={s}
                className={`${styles.statusTab} ${filterStatus === s ? styles.statusTabActive : ''}`}
                onClick={() => setFilterStatus(s)}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trips Grid */}
      <div className={styles.tripsGrid}>
        {loadingTrips ? (
          <div className={styles.emptyState}>
            <Loader2 size={32} className={styles.spinner} />
            <p>Loading your trips...</p>
          </div>
        ) : filteredTrips.length === 0 && trips.length > 0 ? (
          <div className={styles.emptyState}>
            <Search size={40} strokeWidth={1} />
            <h3>No matching trips</h3>
            <p>Try a different search or filter</p>
          </div>
        ) : trips.length === 0 ? (
          /* Beautiful Empty State */
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
              <div className={styles.emptyGlobe}>🌏</div>
              <div className={styles.emptyOrbit}>
                <span>✈️</span>
              </div>
            </div>
            <h2 className={styles.emptyTitle}>Your adventure starts here!</h2>
            <p className={styles.emptyText}>
              Create your first trip and let PACKnPLAN help you plan the perfect getaway.
            </p>
            <div className={styles.emptyCtas}>
              <Link href="/dashboard/planner" className={styles.aiBtn}>
                <Brain size={18} /> Plan with AI
              </Link>
              <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
                <Plus size={18} /> Create Manually
              </button>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {filteredTrips.map((trip, i) => (
              <Link href={`/dashboard/mytrips/${trip._id}`} key={trip._id} className={styles.tripLink}>
                <motion.div
                  className={styles.tripCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Card Banner */}
                  <div className={styles.tripBanner}
                    style={{ background: tripGradients[i % tripGradients.length] }}>
                    <span className={styles.tripEmoji}>{trip.emoji || '✈️'}</span>
                    <div className={styles.tripCountdown}>
                      <Clock size={12} /> {getDaysUntil(trip.startDate)}
                    </div>
                    <button className={styles.deleteBtn}
                      onClick={(e) => handleDeleteTrip(trip._id, e)}
                      disabled={deleting === trip._id}>
                      {deleting === trip._id ? <Loader2 size={14} className={styles.spinner} /> : <Trash2 size={14} />}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className={styles.tripBody}>
                    <div className={styles.tripTop}>
                      <h3 className={styles.tripName}>{trip.destination}</h3>
                      <span className={styles.tripStatus}
                        style={{ background: `${statusColors[trip.status] || '#6C63FF'}18`, color: statusColors[trip.status] || '#6C63FF' }}>
                        {trip.status}
                      </span>
                    </div>

                    <div className={styles.tripDates}>
                      <Calendar size={13} /> {trip.dates}
                    </div>

                    <div className={styles.tripMeta}>
                      <span><Wallet size={13} /> ₹{(trip.spent || 0).toLocaleString('en-IN')} / ₹{trip.budget?.toLocaleString('en-IN')}</span>
                      <span><Users size={13} /> {trip.travelers}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className={styles.progressWrap}>
                      <div className={styles.progressBar}>
                        <motion.div className={styles.progressFill}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(trip.progress || 0, 100)}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          style={{ background: tripGradients[i % tripGradients.length] }} />
                      </div>
                      <span className={styles.progressText}>{trip.progress || 0}% spent</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Quick Create Trip Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div className={styles.modalOverlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}>
            <motion.div className={styles.modal}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2><Plus size={20} /> Quick Create Trip</h2>
                <button onClick={() => setShowCreateModal(false)} className={styles.modalClose}><X size={20} /></button>
              </div>

              <div className={styles.modalBody}>
                <p className={styles.modalHint}>
                  Create a trip in seconds. Want an AI-generated itinerary instead?{' '}
                  <Link href="/dashboard/planner" className={styles.aiLink}>Use AI Planner →</Link>
                </p>

                {/* Destination */}
                <div className={styles.field}>
                  <label>Destination</label>
                  <StyledSelect
                    options={indianCities}
                    value={form.destination}
                    onChange={(val) => setForm({ ...form, destination: val })}
                    placeholder="Where are you going?"
                    icon={MapPin}
                    searchable
                  />
                </div>

                {/* Dates */}
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Start Date</label>
                    <input type="date" value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      className={styles.input}
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className={styles.field}>
                    <label>End Date</label>
                    <input type="date" value={form.endDate}
                      onChange={e => setForm({ ...form, endDate: e.target.value })}
                      className={styles.input}
                      min={form.startDate || new Date().toISOString().split('T')[0]} />
                  </div>
                </div>

                {/* Budget + Travelers */}
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Budget (₹)</label>
                    <input type="number" placeholder="e.g. 50000" value={form.budget}
                      onChange={e => setForm({ ...form, budget: e.target.value })}
                      className={styles.input} min="0" />
                  </div>
                  <div className={styles.field}>
                    <label>Travelers</label>
                    <input type="number" value={form.travelers}
                      onChange={e => setForm({ ...form, travelers: e.target.value })}
                      className={styles.input} min="1" max="20" />
                  </div>
                </div>

                {/* Trip Duration Preview */}
                {form.startDate && form.endDate && (
                  <div className={styles.durationPreview}>
                    <Sparkles size={16} />
                    <span>
                      {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} days
                      {form.destination ? ` in ${form.destination}` : ''}
                      {form.budget ? ` • ₹${Number(form.budget).toLocaleString('en-IN')} budget` : ''}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleCreateTrip}
                  disabled={creating || !form.destination || !form.startDate || !form.endDate || !form.budget}>
                  {creating ? <><Loader2 size={16} className={styles.spinner} /> Creating...</> : <><Plus size={16} /> Create Trip</>}
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
