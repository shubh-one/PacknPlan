'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Wallet, Users, Clock,
  Sparkles, Trash2, Brain, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import styles from './tripDetail.module.css';

const heroGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

function getGradient(id) {
  if (!id) return heroGradients[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return heroGradients[Math.abs(hash) % heroGradients.length];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDayCount(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const diff = new Date(endDate) - new Date(startDate);
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { session, status: authStatus } = useRequireAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (authStatus === 'authenticated' && id) {
      fetchTrip();
    }
  }, [authStatus, id]);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${id}`);
      if (!res.ok) {
        throw new Error(res.status === 404 ? 'Trip not found' : 'Failed to load trip');
      }
      const data = await res.json();
      setTrip(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/dashboard/mytrips');
      } else {
        alert('Failed to delete trip.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setDeleting(false);
    }
  };

  if (authStatus === 'loading' || loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <Loader2 size={32} className={styles.loadingSpinner} />
          <span className={styles.loadingText}>Loading trip details...</span>
        </div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') return null;

  if (error) {
    return (
      <div className={styles.page}>
        <Link href="/dashboard/mytrips" className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to My Trips
        </Link>
        <div className={styles.emptyState}>
          <span className={styles.emptyEmoji}>😕</span>
          <h3 className={styles.emptyTitle}>{error}</h3>
          <p className={styles.emptyDesc}>The trip you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.</p>
          <Link href="/dashboard/mytrips" className={styles.emptyBtn}>
            <ArrowLeft size={14} /> Go to My Trips
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  const dayCount = getDayCount(trip.startDate, trip.endDate);
  const gradient = getGradient(trip._id);

  return (
    <div className={styles.page}>
      {/* Back Navigation */}
      <Link href="/dashboard/mytrips" className={styles.backBtn}>
        <ArrowLeft size={16} /> My Trips
      </Link>

      {/* Hero Card */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.heroBg} style={{ background: gradient }} />
        <div className={styles.heroContent}>
          <span className={styles.heroEmoji}>{trip.emoji || '✈️'}</span>
          <h1 className={styles.heroTitle}>{trip.destination}</h1>
          <span className={styles.heroStatus}>{trip.status || 'Planning'}</span>
        </div>
      </motion.div>

      {/* Meta Cards */}
      <motion.div
        className={styles.metaGrid}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.metaCard}>
          <div className={styles.metaIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Calendar size={18} />
          </div>
          <div className={styles.metaLabel}>Dates</div>
          <div className={styles.metaValue}>{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</div>
        </div>
        <div className={styles.metaCard}>
          <div className={styles.metaIcon} style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <Clock size={18} />
          </div>
          <div className={styles.metaLabel}>Duration</div>
          <div className={styles.metaValue}>{dayCount} {dayCount === 1 ? 'Day' : 'Days'}</div>
        </div>
        <div className={styles.metaCard}>
          <div className={styles.metaIcon} style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Wallet size={18} />
          </div>
          <div className={styles.metaLabel}>Budget</div>
          <div className={styles.metaValue}>₹{Number(trip.budget).toLocaleString('en-IN')}</div>
        </div>
        <div className={styles.metaCard}>
          <div className={styles.metaIcon} style={{ background: 'var(--accent-light, rgba(255,107,129,0.12))', color: 'var(--accent, #ff6b81)' }}>
            <Users size={18} />
          </div>
          <div className={styles.metaLabel}>Travelers</div>
          <div className={styles.metaValue}>{trip.travelers || 1}</div>
        </div>
      </motion.div>

      {/* Actions Bar */}
      <div className={styles.actionsBar}>
        <Link href="/dashboard/planner" className={styles.actionBtn}>
          <Brain size={15} /> Plan Another Trip
        </Link>
        {!confirmDelete ? (
          <button className={styles.actionBtnDanger} onClick={() => setConfirmDelete(true)}>
            <Trash2 size={15} /> Delete Trip
          </button>
        ) : (
          <div className={styles.deleteConfirm}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--error)', fontWeight: 600 }}>Delete this trip?</span>
            <button className={styles.deleteYes} onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button className={styles.deleteNo} onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        )}
      </div>

      {/* Itinerary Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Sparkles size={20} style={{ color: 'var(--warning)' }} />
            {' '}AI-Generated Itinerary
          </h2>
          {trip.itinerary && trip.itinerary.length > 0 && (
            <span className={styles.sectionBadge}>{trip.itinerary.length} Days</span>
          )}
        </div>

        {(!trip.itinerary || trip.itinerary.length === 0) ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>📋</span>
            <h3 className={styles.emptyTitle}>No Itinerary Yet</h3>
            <p className={styles.emptyDesc}>This trip doesn&apos;t have an AI-generated itinerary. Head to the planner to create one!</p>
            <Link href="/dashboard/planner" className={styles.emptyBtn}>
              <Brain size={14} /> Go to AI Planner
            </Link>
          </div>
        ) : (
          <div className={styles.timeline}>
            {trip.itinerary.map((day, dayIdx) => (
              <motion.div
                key={day.day || dayIdx}
                className={styles.dayCard}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + dayIdx * 0.1, duration: 0.4 }}
              >
                <div className={styles.dayHeader}>
                  <div className={styles.dayBadge}>Day {day.day || dayIdx + 1}</div>
                  <h3 className={styles.dayTitle}>{day.title}</h3>
                </div>

                {/* Daily Tips */}
                {day.tips && day.tips.length > 0 && (
                  <div className={styles.dayTips}>
                    {day.tips.map((tip, tipIdx) => (
                      <span key={tipIdx} className={styles.dayTip}>{tip}</span>
                    ))}
                  </div>
                )}

                <div className={styles.dayItems}>
                  {day.items && day.items.map((item, itemIdx) => (
                    <div key={itemIdx} className={styles.timelineItem}>
                      <div className={styles.timelineDot}>
                        <span>{item.emoji || '📍'}</span>
                      </div>
                      <div className={styles.timelineContent}>
                        <span className={styles.timelineTime}>
                          <Clock size={11} /> {item.time}
                        </span>
                        <span className={styles.timelineActivity}>{item.activity}</span>
                        <div className={styles.timelineMeta}>
                          {item.type && (
                            <span className={styles.timelineType}>{item.type}</span>
                          )}
                          {item.estimatedCost && (
                            <span className={styles.timelineCost}>{item.estimatedCost}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
