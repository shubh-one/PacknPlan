'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Train, Bus, Car, ArrowLeft, ArrowRight, MapPin,
  Calendar, Clock, Users, Filter, ChevronDown, Star,
  ArrowLeftRight, Wifi, Coffee, Zap, Luggage, Check
} from 'lucide-react';
import Link from 'next/link';
import styles from './bookings.module.css';

const tabs = [
  { key: 'flight', label: 'Flights', icon: Plane },
  { key: 'train', label: 'Trains', icon: Train },
  { key: 'bus', label: 'Buses', icon: Bus },
  { key: 'cab', label: 'Cabs', icon: Car },
];

const mockResults = {
  flight: [
    {
      id: 1, carrier: 'IndiGo', code: '6E-2045', from: 'DEL', to: 'DPS',
      departTime: '06:30', arriveTime: '15:45', duration: '7h 15m',
      stops: 'Non-stop', price: 320, rating: 4.5,
      amenities: ['wifi', 'food', 'power'],
      class: 'Economy',
    },
    {
      id: 2, carrier: 'Air India', code: 'AI-1230', from: 'DEL', to: 'DPS',
      departTime: '10:15', arriveTime: '20:30', duration: '8h 15m',
      stops: '1 Stop', price: 285, rating: 4.2,
      amenities: ['food', 'power'],
      class: 'Economy',
    },
    {
      id: 3, carrier: 'Singapore Airlines', code: 'SQ-423', from: 'DEL', to: 'DPS',
      departTime: '14:00', arriveTime: '23:15', duration: '7h 15m',
      stops: 'Non-stop', price: 450, rating: 4.8,
      amenities: ['wifi', 'food', 'power', 'luggage'],
      class: 'Economy',
    },
    {
      id: 4, carrier: 'Vistara', code: 'UK-867', from: 'DEL', to: 'DPS',
      departTime: '22:45', arriveTime: '08:00+1', duration: '7h 15m',
      stops: 'Non-stop', price: 395, rating: 4.6,
      amenities: ['wifi', 'food', 'power', 'luggage'],
      class: 'Economy',
    },
  ],
  train: [
    {
      id: 5, carrier: 'Rajdhani Express', code: '12309', from: 'Delhi', to: 'Mumbai',
      departTime: '16:55', arriveTime: '08:35+1', duration: '15h 40m',
      stops: '3 Stops', price: 45, rating: 4.3,
      amenities: ['food'], class: '3A',
    },
    {
      id: 6, carrier: 'Shatabdi Express', code: '12001', from: 'Delhi', to: 'Jaipur',
      departTime: '06:05', arriveTime: '10:30', duration: '4h 25m',
      stops: 'Non-stop', price: 28, rating: 4.5,
      amenities: ['food'], class: 'CC',
    },
  ],
  bus: [
    {
      id: 7, carrier: 'RedBus Volvo', code: 'RB-445', from: 'Delhi', to: 'Jaipur',
      departTime: '23:00', arriveTime: '04:30+1', duration: '5h 30m',
      stops: 'Non-stop', price: 15, rating: 4.1,
      amenities: ['wifi', 'power'], class: 'AC Sleeper',
    },
    {
      id: 8, carrier: 'KSRTC Premium', code: 'KS-210', from: 'Bangalore', to: 'Goa',
      departTime: '21:30', arriveTime: '07:00+1', duration: '9h 30m',
      stops: '2 Stops', price: 22, rating: 4.0,
      amenities: ['power'], class: 'Multi-Axle',
    },
  ],
  cab: [
    {
      id: 9, carrier: 'Ola Sedan', code: '', from: 'Airport', to: 'Hotel',
      departTime: 'On Demand', arriveTime: '~45 min', duration: '45 min',
      stops: 'Direct', price: 18, rating: 4.4,
      amenities: ['wifi'], class: 'Sedan',
    },
    {
      id: 10, carrier: 'Uber SUV', code: '', from: 'Airport', to: 'Hotel',
      departTime: 'On Demand', arriveTime: '~45 min', duration: '45 min',
      stops: 'Direct', price: 25, rating: 4.6,
      amenities: ['wifi', 'power'], class: 'SUV',
    },
  ],
};

const amenityIcons = { wifi: Wifi, food: Coffee, power: Zap, luggage: Luggage };

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('flight');
  const [booked, setBooked] = useState(null);
  const [sortBy, setSortBy] = useState('price');

  const results = [...(mockResults[activeTab] || [])].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backBtn}>
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </Link>
        <h1 className={styles.title}>
          <Plane size={24} />
          Book Transport
        </h1>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab(tab.key); setBooked(null); }}
              id={`tab-${tab.key}`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchField}>
          <MapPin size={16} className={styles.fieldIcon} />
          <input type="text" placeholder="From" defaultValue="New Delhi" className={styles.fieldInput} />
        </div>
        <button className={styles.swapBtn} aria-label="Swap">
          <ArrowLeftRight size={16} />
        </button>
        <div className={styles.searchField}>
          <MapPin size={16} className={styles.fieldIcon} />
          <input type="text" placeholder="To" defaultValue="Bali, Indonesia" className={styles.fieldInput} />
        </div>
        <div className={styles.searchField}>
          <Calendar size={16} className={styles.fieldIcon} />
          <input type="text" placeholder="Date" defaultValue="May 15, 2026" className={styles.fieldInput} />
        </div>
        <div className={styles.searchField}>
          <Users size={16} className={styles.fieldIcon} />
          <input type="text" placeholder="Passengers" defaultValue="1 Adult" className={styles.fieldInput} />
        </div>
        <button className={styles.searchBtn} id="search-transport-btn">
          Search
        </button>
      </div>

      {/* Sort & Filter */}
      <div className={styles.toolbar}>
        <span className={styles.resultCount}>{results.length} results found</span>
        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>Sort by:</span>
          <button
            className={`${styles.sortBtn} ${sortBy === 'price' ? styles.sortActive : ''}`}
            onClick={() => setSortBy('price')}
          >
            Cheapest
          </button>
          <button
            className={`${styles.sortBtn} ${sortBy === 'rating' ? styles.sortActive : ''}`}
            onClick={() => setSortBy('rating')}
          >
            Top Rated
          </button>
        </div>
      </div>

      {/* Results */}
      <div className={styles.results}>
        <AnimatePresence mode="wait">
          {results.map((result, i) => (
            <motion.div
              key={result.id}
              className={`${styles.resultCard} ${booked === result.id ? styles.resultBooked : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              layout
            >
              <div className={styles.resultLeft}>
                <div className={styles.carrierInfo}>
                  <span className={styles.carrierName}>{result.carrier}</span>
                  {result.code && <span className={styles.carrierCode}>{result.code}</span>}
                  <span className={styles.classLabel}>{result.class}</span>
                </div>

                <div className={styles.timeRow}>
                  <div className={styles.timeBlock}>
                    <span className={styles.time}>{result.departTime}</span>
                    <span className={styles.city}>{result.from}</span>
                  </div>
                  <div className={styles.durationBlock}>
                    <span className={styles.duration}>{result.duration}</span>
                    <div className={styles.durationLine}>
                      <div className={styles.dot} />
                      <div className={styles.line} />
                      <div className={styles.dot} />
                    </div>
                    <span className={styles.stops}>{result.stops}</span>
                  </div>
                  <div className={styles.timeBlock}>
                    <span className={styles.time}>{result.arriveTime}</span>
                    <span className={styles.city}>{result.to}</span>
                  </div>
                </div>

                <div className={styles.amenities}>
                  {result.amenities.map((a) => {
                    const AIcon = amenityIcons[a];
                    return AIcon ? (
                      <span key={a} className={styles.amenity} title={a}>
                        <AIcon size={13} />
                      </span>
                    ) : null;
                  })}
                  <span className={styles.ratingBadge}>
                    <Star size={12} fill="currentColor" /> {result.rating}
                  </span>
                </div>
              </div>

              <div className={styles.resultRight}>
                <div className={styles.priceBlock}>
                  <span className={styles.price}>${result.price}</span>
                  <span className={styles.pricePer}>/person</span>
                </div>
                <button
                  className={`${styles.bookBtn} ${booked === result.id ? styles.bookedBtn : ''}`}
                  onClick={() => setBooked(result.id)}
                  disabled={booked === result.id}
                >
                  {booked === result.id ? (
                    <><Check size={16} /> Booked</>
                  ) : (
                    'Book Now'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
