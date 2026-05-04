'use client';

import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ArrowRight, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';
import styles from './Hero.module.css';

const popularDestinations = [
  'Bali, Indonesia',
  'Santorini, Greece',
  'Tokyo, Japan',
  'Paris, France',
  'Maldives',
];

const stats = [
  { value: '50K+', label: 'Trips Planned' },
  { value: '120+', label: 'Destinations' },
  { value: '4.9', label: 'User Rating', icon: Star },
  { value: '10K+', label: 'Happy Travelers' },
];

export default function Hero() {
  const [destination, setDestination] = useState('');

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
      <motion.div
        className={`${styles.floatingCard} ${styles.float1}`}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className={styles.floatingEmoji}>🏖️</span>
        <span>Bali Trip</span>
        <span className={styles.floatingPrice}>$1,200</span>
      </motion.div>

      <motion.div
        className={`${styles.floatingCard} ${styles.float2}`}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <span className={styles.floatingEmoji}>✈️</span>
        <span>Flight Booked!</span>
      </motion.div>

      <motion.div
        className={`${styles.floatingCard} ${styles.float3}`}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <span className={styles.floatingEmoji}>⭐</span>
        <span>4.9 Rating</span>
      </motion.div>

      <div className={`container ${styles.heroInner}`}>
        {/* Badge */}
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles size={14} />
          <span>AI-Powered Trip Planning</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Plan. Pack.{' '}
          <span className={styles.headingGradient}>Explore.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Your all-in-one travel companion. Smart budgets, real-time weather, AI suggestions,
          and group planning — everything you need for the perfect trip.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          className={styles.searchBar}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <div className={styles.searchField}>
            <MapPin size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Where do you want to go?"
              className={styles.searchInput}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              id="hero-search-input"
            />
          </div>
          <div className={styles.searchDivider} />
          <div className={styles.searchField}>
            <Calendar size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="When?"
              className={styles.searchInput}
              id="hero-date-input"
            />
          </div>
          <div className={styles.searchDivider} />
          <div className={styles.searchField}>
            <Users size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Travelers"
              className={styles.searchInput}
              id="hero-travelers-input"
            />
          </div>
          <button className={styles.searchBtn} id="hero-search-btn">
            <Search size={20} />
            <span>Search</span>
          </button>
        </motion.div>

        {/* Popular Destinations */}
        <motion.div
          className={styles.popular}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <span className={styles.popularLabel}>Popular:</span>
          {popularDestinations.map((dest) => (
            <button
              key={dest}
              className={styles.popularTag}
              onClick={() => setDestination(dest)}
            >
              {dest}
            </button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
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
      <motion.div
        className={styles.scrollIndicator}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={styles.scrollDot} />
      </motion.div>
    </section>
  );
}
