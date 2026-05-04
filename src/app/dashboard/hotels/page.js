'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, MapPin, Wifi, Car, Waves, Dumbbell,
  Coffee, UtensilsCrossed, Heart, Filter, Search, ChevronDown,
  Hotel as HotelIcon, Utensils, SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import styles from './hotels.module.css';

const hotels = [
  {
    id: 1, name: 'The Ritz-Carlton Bali', type: 'Resort',
    rating: 4.9, reviews: 2340, price: 180, priceUnit: '/night',
    location: 'Nusa Dua, Bali', distance: '2.5 km from beach',
    emoji: '🏨', gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    amenities: ['wifi', 'pool', 'gym', 'parking', 'restaurant'],
    tag: 'Top Pick',
  },
  {
    id: 2, name: 'Alila Seminyak', type: 'Boutique Hotel',
    rating: 4.7, reviews: 1560, price: 120, priceUnit: '/night',
    location: 'Seminyak, Bali', distance: '200m from beach',
    emoji: '🌴', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    amenities: ['wifi', 'pool', 'restaurant'],
    tag: 'Best Value',
  },
  {
    id: 3, name: 'Four Seasons Jimbaran', type: 'Luxury Resort',
    rating: 4.9, reviews: 3200, price: 350, priceUnit: '/night',
    location: 'Jimbaran Bay, Bali', distance: 'Beachfront',
    emoji: '🏝️', gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    amenities: ['wifi', 'pool', 'gym', 'parking', 'restaurant'],
    tag: 'Luxury',
  },
  {
    id: 4, name: 'Kuta Paradise Hostel', type: 'Hostel',
    rating: 4.3, reviews: 890, price: 25, priceUnit: '/night',
    location: 'Kuta, Bali', distance: '500m from beach',
    emoji: '🎒', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    amenities: ['wifi', 'restaurant'],
    tag: 'Budget',
  },
];

const restaurants = [
  {
    id: 5, name: 'La Lucciola', cuisine: 'Italian • Mediterranean',
    rating: 4.8, reviews: 1890, price: '$$$$', priceRange: '$30-60/person',
    location: 'Seminyak Beach', emoji: '🍝',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    tag: 'Fine Dining',
  },
  {
    id: 6, name: 'Warung Babi Guling', cuisine: 'Balinese • Local',
    rating: 4.9, reviews: 4500, price: '$', priceRange: '$3-8/person',
    location: 'Ubud', emoji: '🍛',
    gradient: 'linear-gradient(135deg, #FFA502, #FF6348)',
    tag: 'Must Try',
  },
  {
    id: 7, name: 'Ku De Ta', cuisine: 'Asian Fusion • Cocktails',
    rating: 4.6, reviews: 2100, price: '$$$', priceRange: '$20-45/person',
    location: 'Seminyak', emoji: '🍸',
    gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    tag: 'Sunset Views',
  },
  {
    id: 8, name: 'Naughty Nuri\'s', cuisine: 'BBQ • Ribs',
    rating: 4.7, reviews: 3200, price: '$$', priceRange: '$10-20/person',
    location: 'Ubud', emoji: '🍖',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    tag: 'Popular',
  },
];

const amenityConfig = {
  wifi: { icon: Wifi, label: 'WiFi' },
  pool: { icon: Waves, label: 'Pool' },
  gym: { icon: Dumbbell, label: 'Gym' },
  parking: { icon: Car, label: 'Parking' },
  restaurant: { icon: Coffee, label: 'Restaurant' },
};

export default function HotelsPage() {
  const [activeView, setActiveView] = useState('hotels');
  const [liked, setLiked] = useState([]);
  const [priceFilter, setPriceFilter] = useState('all');

  const toggleLike = (id) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const filteredHotels = priceFilter === 'all' ? hotels
    : priceFilter === 'low' ? hotels.filter((h) => h.price <= 50)
    : priceFilter === 'mid' ? hotels.filter((h) => h.price > 50 && h.price <= 200)
    : hotels.filter((h) => h.price > 200);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backBtn}>
          <ArrowLeft size={18} /> <span>Dashboard</span>
        </Link>
        <h1 className={styles.title}>
          <HotelIcon size={24} />
          Hotels & Restaurants
        </h1>
      </div>

      {/* Toggle View */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewBtn} ${activeView === 'hotels' ? styles.viewActive : ''}`}
          onClick={() => setActiveView('hotels')}
        >
          <HotelIcon size={16} /> Hotels
        </button>
        <button
          className={`${styles.viewBtn} ${activeView === 'restaurants' ? styles.viewActive : ''}`}
          onClick={() => setActiveView('restaurants')}
        >
          <Utensils size={16} /> Restaurants
        </button>
      </div>

      {/* Filters */}
      {activeView === 'hotels' && (
        <div className={styles.filters}>
          <SlidersHorizontal size={16} />
          <button className={`${styles.filterBtn} ${priceFilter === 'all' ? styles.filterActive : ''}`} onClick={() => setPriceFilter('all')}>All</button>
          <button className={`${styles.filterBtn} ${priceFilter === 'low' ? styles.filterActive : ''}`} onClick={() => setPriceFilter('low')}>Budget</button>
          <button className={`${styles.filterBtn} ${priceFilter === 'mid' ? styles.filterActive : ''}`} onClick={() => setPriceFilter('mid')}>Mid-Range</button>
          <button className={`${styles.filterBtn} ${priceFilter === 'high' ? styles.filterActive : ''}`} onClick={() => setPriceFilter('high')}>Luxury</button>
        </div>
      )}

      {/* Grid */}
      <div className={styles.grid}>
        {activeView === 'hotels' ? (
          filteredHotels.map((hotel, i) => (
            <motion.div
              key={hotel.id}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div className={styles.cardImage} style={{ background: hotel.gradient }}>
                <span className={styles.cardEmoji}>{hotel.emoji}</span>
                <span className={styles.cardTag}>{hotel.tag}</span>
                <button
                  className={`${styles.likeBtn} ${liked.includes(hotel.id) ? styles.liked : ''}`}
                  onClick={() => toggleLike(hotel.id)}
                >
                  <Heart size={16} fill={liked.includes(hotel.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardType}>{hotel.type}</div>
                <h3 className={styles.cardName}>{hotel.name}</h3>
                <div className={styles.cardLocation}>
                  <MapPin size={13} /> {hotel.location}
                </div>
                <div className={styles.cardRating}>
                  <Star size={14} fill="currentColor" /> {hotel.rating}
                  <span className={styles.reviewCount}>({hotel.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className={styles.cardAmenities}>
                  {hotel.amenities.map((a) => {
                    const config = amenityConfig[a];
                    if (!config) return null;
                    const AIcon = config.icon;
                    return <span key={a} className={styles.amenityChip} title={config.label}><AIcon size={13} /> {config.label}</span>;
                  })}
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardPrice}>
                    <span className={styles.priceValue}>${hotel.price}</span>
                    <span className={styles.priceUnit}>{hotel.priceUnit}</span>
                  </div>
                  <button className={styles.bookBtn}>Book Now</button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          restaurants.map((rest, i) => (
            <motion.div
              key={rest.id}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div className={styles.cardImage} style={{ background: rest.gradient }}>
                <span className={styles.cardEmoji}>{rest.emoji}</span>
                <span className={styles.cardTag}>{rest.tag}</span>
                <button
                  className={`${styles.likeBtn} ${liked.includes(rest.id) ? styles.liked : ''}`}
                  onClick={() => toggleLike(rest.id)}
                >
                  <Heart size={16} fill={liked.includes(rest.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardType}>{rest.cuisine}</div>
                <h3 className={styles.cardName}>{rest.name}</h3>
                <div className={styles.cardLocation}>
                  <MapPin size={13} /> {rest.location}
                </div>
                <div className={styles.cardRating}>
                  <Star size={14} fill="currentColor" /> {rest.rating}
                  <span className={styles.reviewCount}>({rest.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardPrice}>
                    <span className={styles.priceValue}>{rest.priceRange}</span>
                  </div>
                  <button className={styles.bookBtn}>Reserve</button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
