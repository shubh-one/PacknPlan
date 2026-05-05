'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Sparkles, Star, Minus, Plus, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StyledSelect from '../StyledSelect/StyledSelect';
import styles from './Hero.module.css';

const popularDestinations = ['Goa', 'Jaipur', 'Manali', 'Kerala', 'Udaipur'];

const heroDestinations = [
  'Goa', 'Jaipur', 'Manali', 'Kerala', 'Varanasi',
  'Udaipur', 'Andaman', 'Rishikesh', 'Delhi', 'Mumbai',
  'Shimla', 'Agra', 'Kochi', 'Darjeeling',
];

const stats = [
  { value: '50K+', label: 'Trips Planned' },
  { value: '120+', label: 'Destinations' },
  { value: '4.9', label: 'User Rating', icon: Star },
  { value: '10K+', label: 'Happy Travelers' },
];

export default function Hero() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showTravelers, setShowTravelers] = useState(false);
  const router = useRouter();
  const dateRef = useRef(null);
  const travRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setShowDatePicker(false);
      if (travRef.current && !travRef.current.contains(e.target)) setShowTravelers(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const totalTravelers = adults + children;
  const dateLabel = startDate && endDate
    ? `${new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — ${new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
    : startDate
      ? new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      : '';

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (totalTravelers > 1) params.set('travelers', totalTravelers);
    router.push(`/dashboard/planner?${params.toString()}`);
  };

  return (
    <section className={styles.hero} id="hero">
      {/* Background Effects */}
      <div className={styles.bgEffects}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
        <div className={styles.gridOverlay} />
      </div>

      {/* Floating Elements */}
      <motion.div className={`${styles.floatingCard} ${styles.float1}`}
        animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <span className={styles.floatingEmoji}>🏖️</span><span>Goa Trip</span>
        <span className={styles.floatingPrice}>₹12,000</span>
      </motion.div>
      <motion.div className={`${styles.floatingCard} ${styles.float2}`}
        animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
        <span className={styles.floatingEmoji}>✈️</span><span>Flight Booked!</span>
      </motion.div>
      <motion.div className={`${styles.floatingCard} ${styles.float3}`}
        animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
        <span className={styles.floatingEmoji}>⭐</span><span>4.9 Rating</span>
      </motion.div>

      <div className={`container ${styles.heroInner}`}>
        {/* Badge */}
        <motion.div className={styles.badge} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Sparkles size={14} /><span>AI-Powered Trip Planning</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 className={styles.heading} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
          Plan. Pack. <span className={styles.headingGradient}>Explore.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p className={styles.subtitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          Your all-in-one travel companion. Smart budgets, real-time weather, AI suggestions,
          and group planning — everything you need for the perfect trip.
        </motion.p>

        {/* Search Bar */}
        <motion.div className={styles.searchBar} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}>
          {/* Destination */}
          <div className={styles.searchField}>
            <StyledSelect
              options={heroDestinations}
              value={destination}
              onChange={setDestination}
              placeholder="Where do you want to go?"
              icon={MapPin}
              searchable
              id="hero-search-input"
            />
          </div>

          <div className={styles.searchDivider} />

          {/* Date Picker */}
          <div className={styles.searchField} ref={dateRef} style={{ position: 'relative' }}>
            <button className={styles.searchFieldBtn} onClick={() => { setShowDatePicker(!showDatePicker); setShowTravelers(false); }} id="hero-date-input">
              <Calendar size={18} className={styles.searchIcon} />
              <span style={{ color: dateLabel ? 'var(--text)' : 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                {dateLabel || 'When?'}
              </span>
            </button>
            <AnimatePresence>
              {showDatePicker && (
                <motion.div className={styles.dropdown} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Select Dates</span>
                    <button onClick={() => setShowDatePicker(false)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><X size={16} /></button>
                  </div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.3rem' }}>Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className={styles.dateInput} min={new Date().toISOString().split('T')[0]} />
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.3rem', marginTop: '0.6rem' }}>End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    className={styles.dateInput} min={startDate || new Date().toISOString().split('T')[0]} />
                  {startDate && endDate && (
                    <div style={{ marginTop: '0.6rem', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, textAlign: 'center' }}>
                      {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} nights
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.searchDivider} />

          {/* Travelers */}
          <div className={styles.searchField} ref={travRef} style={{ position: 'relative' }}>
            <button className={styles.searchFieldBtn} onClick={() => { setShowTravelers(!showTravelers); setShowDatePicker(false); }} id="hero-travelers-input">
              <Users size={18} className={styles.searchIcon} />
              <span style={{ color: totalTravelers > 1 ? 'var(--text)' : 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                {totalTravelers > 1 ? `${totalTravelers} Traveler${totalTravelers > 1 ? 's' : ''}` : 'Travelers'}
              </span>
            </button>
            <AnimatePresence>
              {showTravelers && (
                <motion.div className={styles.dropdown} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Travelers</span>
                    <button onClick={() => setShowTravelers(false)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><X size={16} /></button>
                  </div>
                  {/* Adults */}
                  <div className={styles.counterRow}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Adults</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Ages 13+</div>
                    </div>
                    <div className={styles.counter}>
                      <button className={styles.counterBtn} onClick={() => setAdults(Math.max(1, adults - 1))} disabled={adults <= 1}><Minus size={14} /></button>
                      <span className={styles.counterVal}>{adults}</span>
                      <button className={styles.counterBtn} onClick={() => setAdults(Math.min(10, adults + 1))}><Plus size={14} /></button>
                    </div>
                  </div>
                  {/* Children */}
                  <div className={styles.counterRow}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Children</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Ages 2–12</div>
                    </div>
                    <div className={styles.counter}>
                      <button className={styles.counterBtn} onClick={() => setChildren(Math.max(0, children - 1))} disabled={children <= 0}><Minus size={14} /></button>
                      <span className={styles.counterVal}>{children}</span>
                      <button className={styles.counterBtn} onClick={() => setChildren(Math.min(8, children + 1))}><Plus size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button */}
          <button className={styles.searchBtn} onClick={handleSearch} id="hero-search-btn">
            <Search size={20} /><span>Search</span>
          </button>
        </motion.div>

        {/* Popular Destinations */}
        <motion.div className={styles.popular} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <span className={styles.popularLabel}>Popular:</span>
          {popularDestinations.map((dest) => (
            <button key={dest} className={styles.popularTag} onClick={() => setDestination(dest)}>{dest}</button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div className={styles.stats} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.75 }}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <div className={styles.statValue}>
                {stat.icon && <Star size={16} fill="currentColor" className={styles.statIcon} />}
                {stat.value}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div className={styles.scrollIndicator} animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className={styles.scrollDot} />
      </motion.div>
    </section>
  );
}
