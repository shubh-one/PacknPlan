'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Star, MapPin, Wifi, Car, Waves, Dumbbell,
  Coffee, Heart, Search, ChevronDown, CheckCircle2,
  Hotel as HotelIcon, Utensils, SlidersHorizontal, Check, X
} from 'lucide-react';
import Link from 'next/link';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import StyledSelect from '@/components/StyledSelect/StyledSelect';
import styles from './hotels.module.css';

const destinations = [
  'All Destinations', 'Goa', 'Jaipur', 'Manali', 'Kerala', 'Delhi',
  'Mumbai', 'Udaipur', 'Varanasi', 'Bangalore', 'Agra', 'Rishikesh',
];

const hotels = [
  { id: 1, name: 'Taj Fort Aguada', type: 'Luxury Resort', rating: 4.8, reviews: 4200, price: 12000, priceUnit: '/night', location: 'Candolim, Goa', city: 'Goa', distance: 'Beachfront', emoji: '🏨', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', amenities: ['wifi', 'pool', 'gym', 'parking', 'restaurant'], tag: 'Top Pick' },
  { id: 2, name: 'Zostel Goa', type: 'Hostel', rating: 4.4, reviews: 3100, price: 800, priceUnit: '/night', location: 'Anjuna, Goa', city: 'Goa', distance: '300m from beach', emoji: '🎒', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', amenities: ['wifi', 'restaurant'], tag: 'Budget' },
  { id: 3, name: 'Resort Rio', type: 'Resort', rating: 4.5, reviews: 2800, price: 4500, priceUnit: '/night', location: 'Arpora, Goa', city: 'Goa', distance: '2 km from beach', emoji: '🌴', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', amenities: ['wifi', 'pool', 'gym', 'restaurant'], tag: 'Best Value' },
  { id: 4, name: 'Rambagh Palace', type: 'Heritage Luxury', rating: 4.9, reviews: 5600, price: 25000, priceUnit: '/night', location: 'Bhawani Singh Rd, Jaipur', city: 'Jaipur', distance: 'City Center', emoji: '🏰', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', amenities: ['wifi', 'pool', 'gym', 'parking', 'restaurant'], tag: 'Heritage' },
  { id: 5, name: 'Hotel Pearl Palace', type: 'Boutique Hotel', rating: 4.6, reviews: 4800, price: 1500, priceUnit: '/night', location: 'Hathroi Fort, Jaipur', city: 'Jaipur', distance: 'Near Hawa Mahal', emoji: '💎', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', amenities: ['wifi', 'restaurant'], tag: 'Popular' },
  { id: 6, name: 'The Himalayan', type: 'Mountain Resort', rating: 4.7, reviews: 2100, price: 6000, priceUnit: '/night', location: 'Old Manali', city: 'Manali', distance: 'Mountain View', emoji: '🏔️', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)', amenities: ['wifi', 'parking', 'restaurant'], tag: 'Scenic' },
  { id: 7, name: 'Zostel Manali', type: 'Hostel', rating: 4.3, reviews: 2600, price: 600, priceUnit: '/night', location: 'Old Manali Rd', city: 'Manali', distance: 'River View', emoji: '🎒', gradient: 'linear-gradient(135deg, #FF6348, #FFA502)', amenities: ['wifi'], tag: 'Budget' },
  { id: 8, name: 'Kumarakom Lake Resort', type: 'Luxury Resort', rating: 4.9, reviews: 3400, price: 18000, priceUnit: '/night', location: 'Kumarakom, Kerala', city: 'Kerala', distance: 'Lakefront', emoji: '🌊', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', amenities: ['wifi', 'pool', 'gym', 'parking', 'restaurant'], tag: 'Luxury' },
  { id: 9, name: 'Marari Beach Resort', type: 'Beach Resort', rating: 4.6, reviews: 2200, price: 8000, priceUnit: '/night', location: 'Mararikulam, Kerala', city: 'Kerala', distance: 'Beachfront', emoji: '🌴', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', amenities: ['wifi', 'pool', 'restaurant'], tag: 'Serene' },
  { id: 10, name: 'The Leela Palace', type: 'Luxury Hotel', rating: 4.9, reviews: 6100, price: 22000, priceUnit: '/night', location: 'Chanakyapuri, Delhi', city: 'Delhi', distance: 'Diplomatic Enclave', emoji: '👑', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', amenities: ['wifi', 'pool', 'gym', 'parking', 'restaurant'], tag: 'Premium' },
  { id: 11, name: 'Zostel Delhi', type: 'Hostel', rating: 4.2, reviews: 1800, price: 700, priceUnit: '/night', location: 'Paharganj, Delhi', city: 'Delhi', distance: 'Near New Delhi Station', emoji: '🎒', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', amenities: ['wifi'], tag: 'Budget' },
  { id: 12, name: 'Taj Mahal Palace', type: 'Iconic Luxury', rating: 4.9, reviews: 8900, price: 20000, priceUnit: '/night', location: 'Colaba, Mumbai', city: 'Mumbai', distance: 'Gateway of India', emoji: '🏛️', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', amenities: ['wifi', 'pool', 'gym', 'parking', 'restaurant'], tag: 'Iconic' },
];

const restaurants = [
  { id: 101, name: '1135 AD', cuisine: 'Royal Rajasthani • Fine Dining', rating: 4.8, reviews: 3200, price: '$$$$', priceRange: '₹2,000-4,000/person', location: 'Amer Fort, Jaipur', city: 'Jaipur', emoji: '🍛', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', tag: 'Royal Dining' },
  { id: 102, name: 'Laxmi Mishthan Bhandar', cuisine: 'Rajasthani • Street Food', rating: 4.7, reviews: 8900, price: '$', priceRange: '₹100-300/person', location: 'Johari Bazaar, Jaipur', city: 'Jaipur', emoji: '🥤', gradient: 'linear-gradient(135deg, #FFA502, #FF6348)', tag: 'Must Try' },
  { id: 103, name: 'Fisherman\'s Wharf', cuisine: 'Goan Seafood • Coastal', rating: 4.6, reviews: 4500, price: '$$$', priceRange: '₹600-1,200/person', location: 'Cavelossim, Goa', city: 'Goa', emoji: '🦞', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', tag: 'Seafood' },
  { id: 104, name: 'Curlies Beach Shack', cuisine: 'Beach Dining • Multi-Cuisine', rating: 4.4, reviews: 5200, price: '$$', priceRange: '₹300-600/person', location: 'Anjuna Beach, Goa', city: 'Goa', emoji: '🍻', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', tag: 'Beachside' },
  { id: 105, name: 'Indian Accent', cuisine: 'Modern Indian • Fine Dining', rating: 4.9, reviews: 6800, price: '$$$$', priceRange: '₹3,500-6,000/person', location: 'The Lodhi, Delhi', city: 'Delhi', emoji: '🍽️', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', tag: 'Award Winning' },
  { id: 106, name: 'Paranthe Wali Gali', cuisine: 'North Indian • Street Food', rating: 4.5, reviews: 12000, price: '$', priceRange: '₹50-200/person', location: 'Chandni Chowk, Delhi', city: 'Delhi', emoji: '🧈', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', tag: 'Iconic' },
  { id: 107, name: 'Trishna', cuisine: 'Seafood • Coastal', rating: 4.7, reviews: 5400, price: '$$$', priceRange: '₹1,000-2,000/person', location: 'Fort, Mumbai', city: 'Mumbai', emoji: '🦀', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', tag: 'Legendary' },
  { id: 108, name: 'Bademiya', cuisine: 'Mughlai • Kebabs', rating: 4.6, reviews: 9200, price: '$$', priceRange: '₹200-500/person', location: 'Colaba, Mumbai', city: 'Mumbai', emoji: '🍖', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)', tag: 'Late Night' },
];

const amenityConfig = {
  wifi: { icon: Wifi, label: 'WiFi' },
  pool: { icon: Waves, label: 'Pool' },
  gym: { icon: Dumbbell, label: 'Gym' },
  parking: { icon: Car, label: 'Parking' },
  restaurant: { icon: Coffee, label: 'Restaurant' },
};

export default function HotelsPage() {
  const { session, status } = useRequireAuth();
  const [activeView, setActiveView] = useState('hotels');
  const [liked, setLiked] = useState([]);
  const [priceFilter, setPriceFilter] = useState('all');
  const [destFilter, setDestFilter] = useState('All Destinations');
  const [searchText, setSearchText] = useState('');
  const [bookedIds, setBookedIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('packnplan_hotel_bookings');
    if (saved) setBookedIds(JSON.parse(saved));
  }, []);

  const toggleLike = (id) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleBook = (item) => {
    setConfirmModal(item);
  };

  const confirmBook = () => {
    if (!confirmModal) return;
    const updated = [...bookedIds, confirmModal.id];
    setBookedIds(updated);
    localStorage.setItem('packnplan_hotel_bookings', JSON.stringify(updated));
    showToast(`${confirmModal.name} booked successfully! 🎉`);
    setConfirmModal(null);
  };

  // Apply filters
  let filteredHotels = hotels;
  if (destFilter !== 'All Destinations') {
    filteredHotels = filteredHotels.filter((h) => h.city === destFilter);
  }
  if (priceFilter === 'low') filteredHotels = filteredHotels.filter((h) => h.price <= 1500);
  else if (priceFilter === 'mid') filteredHotels = filteredHotels.filter((h) => h.price > 1500 && h.price <= 10000);
  else if (priceFilter === 'high') filteredHotels = filteredHotels.filter((h) => h.price > 10000);
  if (searchText) {
    filteredHotels = filteredHotels.filter((h) => h.name.toLowerCase().includes(searchText.toLowerCase()));
  }

  let filteredRestaurants = restaurants;
  if (destFilter !== 'All Destinations') {
    filteredRestaurants = filteredRestaurants.filter((r) => r.city === destFilter);
  }
  if (searchText) {
    filteredRestaurants = filteredRestaurants.filter((r) => r.name.toLowerCase().includes(searchText.toLowerCase()));
  }

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

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

      {/* Destination + Search */}
      <div className={styles.filterBar}>
        <StyledSelect
          options={destinations}
          value={destFilter}
          onChange={setDestFilter}
          placeholder="All Destinations"
          icon={MapPin}
          id="hotel-dest-filter"
        />
        <div className={styles.searchBox}>
          <Search size={14} />
          <input
            type="text"
            placeholder={`Search ${activeView}...`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchBoxInput}
          />
        </div>
      </div>

      {/* Price Filters (Hotels only) */}
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
          filteredHotels.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
              <p style={{ fontSize: '2rem' }}>🏨</p>
              <p style={{ fontWeight: 600 }}>No hotels found</p>
              <p style={{ fontSize: 'var(--text-sm)' }}>Try a different destination or filter</p>
            </div>
          ) : (
            filteredHotels.map((hotel, i) => {
              const isBooked = bookedIds.includes(hotel.id);
              return (
                <motion.div key={hotel.id} className={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                  <div className={styles.cardImage} style={{ background: hotel.gradient }}>
                    <span className={styles.cardEmoji}>{hotel.emoji}</span>
                    <span className={styles.cardTag}>{isBooked ? '✅ Booked' : hotel.tag}</span>
                    <button className={`${styles.likeBtn} ${liked.includes(hotel.id) ? styles.liked : ''}`} onClick={() => toggleLike(hotel.id)}>
                      <Heart size={16} fill={liked.includes(hotel.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardType}>{hotel.type}</div>
                    <h3 className={styles.cardName}>{hotel.name}</h3>
                    <div className={styles.cardLocation}><MapPin size={13} /> {hotel.location}</div>
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
                        <span className={styles.priceValue}>₹{hotel.price.toLocaleString('en-IN')}</span>
                        <span className={styles.priceUnit}>{hotel.priceUnit}</span>
                      </div>
                      <button
                        className={`${styles.bookBtn} ${isBooked ? styles.bookedBtn : ''}`}
                        onClick={() => !isBooked && handleBook(hotel)}
                        disabled={isBooked}
                      >
                        {isBooked ? <><Check size={14} /> Booked</> : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )
        ) : (
          filteredRestaurants.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
              <p style={{ fontSize: '2rem' }}>🍽️</p>
              <p style={{ fontWeight: 600 }}>No restaurants found</p>
              <p style={{ fontSize: 'var(--text-sm)' }}>Try a different destination or search</p>
            </div>
          ) : (
            filteredRestaurants.map((rest, i) => {
              const isBooked = bookedIds.includes(rest.id);
              return (
                <motion.div key={rest.id} className={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                  <div className={styles.cardImage} style={{ background: rest.gradient }}>
                    <span className={styles.cardEmoji}>{rest.emoji}</span>
                    <span className={styles.cardTag}>{isBooked ? '✅ Reserved' : rest.tag}</span>
                    <button className={`${styles.likeBtn} ${liked.includes(rest.id) ? styles.liked : ''}`} onClick={() => toggleLike(rest.id)}>
                      <Heart size={16} fill={liked.includes(rest.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardType}>{rest.cuisine}</div>
                    <h3 className={styles.cardName}>{rest.name}</h3>
                    <div className={styles.cardLocation}><MapPin size={13} /> {rest.location}</div>
                    <div className={styles.cardRating}>
                      <Star size={14} fill="currentColor" /> {rest.rating}
                      <span className={styles.reviewCount}>({rest.reviews.toLocaleString()} reviews)</span>
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.cardPrice}>
                        <span className={styles.priceValue}>{rest.priceRange}</span>
                      </div>
                      <button
                        className={`${styles.bookBtn} ${isBooked ? styles.bookedBtn : ''}`}
                        onClick={() => !isBooked && handleBook(rest)}
                        disabled={isBooked}
                      >
                        {isBooked ? <><Check size={14} /> Reserved</> : 'Reserve'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )
        )}
      </div>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmModal(null)}
          >
            <motion.div
              style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: '2rem', maxWidth: '400px', width: '90%', border: '1px solid var(--border)' }}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '0.5rem' }}>Confirm Booking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                Book <strong>{confirmModal.name}</strong> at {confirmModal.location}?
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setConfirmModal(null)} style={{ padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text)', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                <button onClick={confirmBook} style={{ padding: '0.5rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.5rem', background: 'var(--success)', color: 'white', fontWeight: 600, fontSize: 'var(--text-sm)', borderRadius: '9999px', boxShadow: '0 8px 32px rgba(46, 213, 115, 0.4)', zIndex: 700 }}
            initial={{ opacity: 0, y: 30, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 30, x: '-50%' }}
          >
            <CheckCircle2 size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
