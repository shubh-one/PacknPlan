'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Train, ArrowLeft, MapPin, Calendar, Users, Star, Check,
  ArrowLeftRight, Wifi, Coffee, Zap, Luggage, Search, CheckCircle2,
  ChevronDown, Minus, Plus, X
} from 'lucide-react';
import Link from 'next/link';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import DatePicker from '../planner/DatePicker';
import styles from './bookings.module.css';

const tabs = [
  { key: 'flight', label: 'Flights', icon: Plane },
  { key: 'train', label: 'Trains', icon: Train },
];

const cities = [
  { name: 'New Delhi', code: 'DEL', state: 'Delhi' },
  { name: 'Mumbai', code: 'BOM', state: 'Maharashtra' },
  { name: 'Bangalore', code: 'BLR', state: 'Karnataka' },
  { name: 'Chennai', code: 'MAA', state: 'Tamil Nadu' },
  { name: 'Kolkata', code: 'CCU', state: 'West Bengal' },
  { name: 'Hyderabad', code: 'HYD', state: 'Telangana' },
  { name: 'Pune', code: 'PNQ', state: 'Maharashtra' },
  { name: 'Ahmedabad', code: 'AMD', state: 'Gujarat' },
  { name: 'Jaipur', code: 'JAI', state: 'Rajasthan' },
  { name: 'Goa', code: 'GOI', state: 'Goa' },
  { name: 'Kochi', code: 'COK', state: 'Kerala' },
  { name: 'Lucknow', code: 'LKO', state: 'Uttar Pradesh' },
  { name: 'Varanasi', code: 'VNS', state: 'Uttar Pradesh' },
  { name: 'Udaipur', code: 'UDR', state: 'Rajasthan' },
  { name: 'Chandigarh', code: 'IXC', state: 'Punjab' },
  { name: 'Amritsar', code: 'ATQ', state: 'Punjab' },
  { name: 'Agra', code: 'AGR', state: 'Uttar Pradesh' },
  { name: 'Bhopal', code: 'BHO', state: 'Madhya Pradesh' },
  { name: 'Srinagar', code: 'SXR', state: 'J&K' },
  { name: 'Guwahati', code: 'GAU', state: 'Assam' },
  { name: 'Thiruvananthapuram', code: 'TRV', state: 'Kerala' },
  { name: 'Visakhapatnam', code: 'VTZ', state: 'Andhra Pradesh' },
  { name: 'Dehradun', code: 'DED', state: 'Uttarakhand' },
  { name: 'Patna', code: 'PAT', state: 'Bihar' },
  { name: 'Ranchi', code: 'IXR', state: 'Jharkhand' },
];

const allResults = {
  flight: [
    { id: 1, carrier: 'IndiGo', code: '6E-2045', from: 'New Delhi', to: 'Goa', departTime: '06:30', arriveTime: '09:00', duration: '2h 30m', stops: 'Non-stop', price: 3500, rating: 4.3, amenities: ['food'], class: 'Economy' },
    { id: 2, carrier: 'Air India', code: 'AI-1230', from: 'New Delhi', to: 'Mumbai', departTime: '10:15', arriveTime: '12:30', duration: '2h 15m', stops: 'Non-stop', price: 4200, rating: 4.5, amenities: ['food', 'power'], class: 'Economy' },
    { id: 3, carrier: 'Vistara', code: 'UK-867', from: 'Bangalore', to: 'Goa', departTime: '14:00', arriveTime: '15:15', duration: '1h 15m', stops: 'Non-stop', price: 2800, rating: 4.7, amenities: ['wifi', 'food', 'power'], class: 'Economy' },
    { id: 4, carrier: 'SpiceJet', code: 'SG-423', from: 'New Delhi', to: 'Jaipur', departTime: '08:45', arriveTime: '09:45', duration: '1h 00m', stops: 'Non-stop', price: 2500, rating: 4.1, amenities: ['food'], class: 'Economy' },
    { id: 5, carrier: 'Akasa Air', code: 'QP-1312', from: 'Mumbai', to: 'Bangalore', departTime: '17:30', arriveTime: '19:15', duration: '1h 45m', stops: 'Non-stop', price: 3100, rating: 4.2, amenities: ['food', 'power'], class: 'Economy' },
    { id: 6, carrier: 'Air India', code: 'AI-865', from: 'New Delhi', to: 'Kochi', departTime: '22:00', arriveTime: '01:15+1', duration: '3h 15m', stops: 'Non-stop', price: 5500, rating: 4.6, amenities: ['wifi', 'food', 'power', 'luggage'], class: 'Economy' },
    { id: 7, carrier: 'IndiGo', code: '6E-5011', from: 'Mumbai', to: 'Goa', departTime: '07:00', arriveTime: '08:10', duration: '1h 10m', stops: 'Non-stop', price: 2900, rating: 4.4, amenities: ['food'], class: 'Economy' },
    { id: 8, carrier: 'Vistara', code: 'UK-945', from: 'New Delhi', to: 'Hyderabad', departTime: '11:30', arriveTime: '13:45', duration: '2h 15m', stops: 'Non-stop', price: 3800, rating: 4.6, amenities: ['wifi', 'food', 'power'], class: 'Economy' },
    { id: 9, carrier: 'IndiGo', code: '6E-2201', from: 'Bangalore', to: 'Kolkata', departTime: '06:00', arriveTime: '08:45', duration: '2h 45m', stops: 'Non-stop', price: 4100, rating: 4.3, amenities: ['food'], class: 'Economy' },
    { id: 10, carrier: 'SpiceJet', code: 'SG-189', from: 'Chennai', to: 'Goa', departTime: '15:00', arriveTime: '16:45', duration: '1h 45m', stops: 'Non-stop', price: 3200, rating: 4.0, amenities: ['food'], class: 'Economy' },
    { id: 11, carrier: 'Air India', code: 'AI-402', from: 'New Delhi', to: 'Chennai', departTime: '13:30', arriveTime: '16:00', duration: '2h 30m', stops: 'Non-stop', price: 4500, rating: 4.4, amenities: ['food', 'power', 'luggage'], class: 'Economy' },
    { id: 12, carrier: 'IndiGo', code: '6E-6032', from: 'Hyderabad', to: 'Mumbai', departTime: '09:15', arriveTime: '11:00', duration: '1h 45m', stops: 'Non-stop', price: 3400, rating: 4.3, amenities: ['food'], class: 'Economy' },
  ],
  train: [
    { id: 20, carrier: 'Rajdhani Express', code: '12309', from: 'New Delhi', to: 'Mumbai', departTime: '16:55', arriveTime: '08:35+1', duration: '15h 40m', stops: '3 Stops', price: 2200, rating: 4.3, amenities: ['food'], class: '3A' },
    { id: 21, carrier: 'Shatabdi Express', code: '12001', from: 'New Delhi', to: 'Jaipur', departTime: '06:05', arriveTime: '10:30', duration: '4h 25m', stops: 'Non-stop', price: 800, rating: 4.5, amenities: ['food'], class: 'CC' },
    { id: 22, carrier: 'Vande Bharat', code: '22439', from: 'New Delhi', to: 'Varanasi', departTime: '06:00', arriveTime: '14:00', duration: '8h 00m', stops: '2 Stops', price: 1500, rating: 4.7, amenities: ['food', 'power'], class: 'CC' },
    { id: 23, carrier: 'Duronto Express', code: '12213', from: 'Mumbai', to: 'Bangalore', departTime: '20:10', arriveTime: '16:50+1', duration: '20h 40m', stops: 'Non-stop', price: 1800, rating: 4.2, amenities: ['food'], class: '2A' },
    { id: 24, carrier: 'Shatabdi Express', code: '12007', from: 'New Delhi', to: 'Chandigarh', departTime: '07:40', arriveTime: '10:50', duration: '3h 10m', stops: 'Non-stop', price: 700, rating: 4.4, amenities: ['food'], class: 'CC' },
    { id: 25, carrier: 'Rajdhani Express', code: '12431', from: 'New Delhi', to: 'Lucknow', departTime: '22:30', arriveTime: '05:30+1', duration: '7h 00m', stops: '1 Stop', price: 1600, rating: 4.5, amenities: ['food'], class: '2A' },
    { id: 26, carrier: 'Vande Bharat', code: '22436', from: 'New Delhi', to: 'Amritsar', departTime: '06:00', arriveTime: '12:00', duration: '6h 00m', stops: '1 Stop', price: 1200, rating: 4.6, amenities: ['food', 'power'], class: 'CC' },
    { id: 27, carrier: 'Rajdhani Express', code: '12301', from: 'New Delhi', to: 'Kolkata', departTime: '17:00', arriveTime: '10:00+1', duration: '17h 00m', stops: '4 Stops', price: 2500, rating: 4.4, amenities: ['food'], class: '3A' },
    { id: 28, carrier: 'Tejas Express', code: '82501', from: 'Mumbai', to: 'Goa', departTime: '05:00', arriveTime: '13:30', duration: '8h 30m', stops: '2 Stops', price: 1100, rating: 4.5, amenities: ['food', 'wifi', 'power'], class: 'CC' },
  ],
};

const amenityIcons = { wifi: Wifi, food: Coffee, power: Zap, luggage: Luggage };

// Custom city dropdown
function CityDropdown({ value, onChange, label, excludeCity }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = cities.find((c) => c.name === value);
  const filtered = cities.filter((c) =>
    c.name !== excludeCity &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={styles.cityDrop} ref={ref}>
      <button type="button" className={styles.cityDropTrigger} onClick={() => setOpen(!open)}>
        <MapPin size={14} className={styles.cityDropIcon} />
        <div className={styles.cityDropText}>
          <span className={styles.cityDropLabel}>{label}</span>
          <span className={styles.cityDropValue}>{selected?.name || 'Select city'}</span>
        </div>
        {selected && <span className={styles.cityDropCode}>{selected.code}</span>}
      </button>
      {open && (
        <div className={styles.cityDropMenu}>
          <div className={styles.cityDropSearch}>
            <Search size={14} />
            <input type="text" placeholder="Search city..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
          </div>
          <div className={styles.cityDropList}>
            {filtered.length === 0 ? (
              <div className={styles.cityDropEmpty}>No cities found</div>
            ) : (
              filtered.map((city) => (
                <button
                  key={city.code}
                  className={`${styles.cityDropItem} ${value === city.name ? styles.cityDropItemActive : ''}`}
                  onClick={() => { onChange(city.name); setOpen(false); setSearch(''); }}
                >
                  <div>
                    <span className={styles.cityDropItemName}>{city.name}</span>
                    <span className={styles.cityDropItemState}>{city.state}</span>
                  </div>
                  <span className={styles.cityDropItemCode}>{city.code}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Passenger counter dropdown
function PassengerPicker({ adults, setAdults, children, setChildren }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const total = adults + children;

  return (
    <div className={styles.passDrop} ref={ref}>
      <button type="button" className={styles.passDropTrigger} onClick={() => setOpen(!open)}>
        <Users size={14} className={styles.passDropIcon} />
        <div className={styles.passDropText}>
          <span className={styles.passDropLabel}>Passengers</span>
          <span className={styles.passDropValue}>{total} {total === 1 ? 'Traveler' : 'Travelers'}</span>
        </div>
        <ChevronDown size={14} className={styles.passDropChevron} />
      </button>
      {open && (
        <div className={styles.passDropMenu}>
          <div className={styles.passRow}>
            <div>
              <div className={styles.passRowLabel}>Adults</div>
              <div className={styles.passRowSub}>Age 12+</div>
            </div>
            <div className={styles.passCounter}>
              <button className={styles.passCountBtn} onClick={() => setAdults(Math.max(1, adults - 1))} disabled={adults <= 1}><Minus size={14} /></button>
              <span className={styles.passCountVal}>{adults}</span>
              <button className={styles.passCountBtn} onClick={() => setAdults(Math.min(9, adults + 1))} disabled={adults >= 9}><Plus size={14} /></button>
            </div>
          </div>
          <div className={styles.passRow}>
            <div>
              <div className={styles.passRowLabel}>Children</div>
              <div className={styles.passRowSub}>Age 2–11</div>
            </div>
            <div className={styles.passCounter}>
              <button className={styles.passCountBtn} onClick={() => setChildren(Math.max(0, children - 1))} disabled={children <= 0}><Minus size={14} /></button>
              <span className={styles.passCountVal}>{children}</span>
              <button className={styles.passCountBtn} onClick={() => setChildren(Math.min(6, children + 1))} disabled={children >= 6}><Plus size={14} /></button>
            </div>
          </div>
          <button className={styles.passDoneBtn} onClick={() => setOpen(false)}>Done</button>
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const { session, status } = useRequireAuth();
  const [activeTab, setActiveTab] = useState('flight');
  const [sortBy, setSortBy] = useState('price');
  const [fromCity, setFromCity] = useState('New Delhi');
  const [toCity, setToCity] = useState('Goa');
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [searchTriggered, setSearchTriggered] = useState(true);
  const [bookedIds, setBookedIds] = useState([]);
  const [toast, setToast] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const saved = localStorage.getItem('packnplan_bookings');
    if (saved) setBookedIds(JSON.parse(saved));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSwap = () => { const temp = fromCity; setFromCity(toCity); setToCity(temp); };

  const handleBook = (result) => {
    const updated = [...bookedIds, result.id];
    setBookedIds(updated);
    localStorage.setItem('packnplan_bookings', JSON.stringify(updated));
    showToast(`${result.carrier} ${result.code || result.class} booked for ${adults + children} travelers! ✈️`);
  };

  const filteredResults = searchTriggered
    ? [...(allResults[activeTab] || [])].filter((r) => {
        const matchFrom = r.from.toLowerCase().includes(fromCity.toLowerCase());
        const matchTo = r.to.toLowerCase().includes(toCity.toLowerCase());
        return matchFrom || matchTo;
      })
    : [];

  const results = filteredResults.sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
    return 0;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backBtn}><ArrowLeft size={18} /><span>Dashboard</span></Link>
        <h1 className={styles.title}>
          {activeTab === 'flight' ? <Plane size={24} /> : <Train size={24} />}
          {activeTab === 'flight' ? 'Book Flights' : 'Book Trains'}
        </h1>
        <p className={styles.subtitle}>Search and book from top Indian carriers</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab(tab.key); setSearchTriggered(true); }} id={`tab-${tab.key}`}>
              <Icon size={18} /><span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <CityDropdown value={fromCity} onChange={setFromCity} label="From" excludeCity={toCity} />
        <button className={styles.swapBtn} aria-label="Swap" onClick={handleSwap}><ArrowLeftRight size={16} /></button>
        <CityDropdown value={toCity} onChange={setToCity} label="To" excludeCity={fromCity} />
        <div className={styles.dateField}>
          <DatePicker
            value={travelDate}
            onChange={setTravelDate}
            minDate={today}
            placeholder="Travel date"
            id="booking-date"
          />
        </div>
        <PassengerPicker adults={adults} setAdults={setAdults} children={children} setChildren={setChildren} />
        <button className={styles.searchBtn} id="search-transport-btn" onClick={() => setSearchTriggered(true)}>
          <Search size={16} /> Search
        </button>
      </div>

      {/* Sort & Filter */}
      <div className={styles.toolbar}>
        <span className={styles.resultCount}>{results.length} {activeTab === 'flight' ? 'flights' : 'trains'} found</span>
        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}>Sort:</span>
          <button className={`${styles.sortBtn} ${sortBy === 'price' ? styles.sortActive : ''}`} onClick={() => setSortBy('price')}>Cheapest</button>
          <button className={`${styles.sortBtn} ${sortBy === 'rating' ? styles.sortActive : ''}`} onClick={() => setSortBy('rating')}>Top Rated</button>
          <button className={`${styles.sortBtn} ${sortBy === 'duration' ? styles.sortActive : ''}`} onClick={() => setSortBy('duration')}>Fastest</button>
        </div>
      </div>

      {/* Results */}
      <div className={styles.results}>
        {results.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>{activeTab === 'flight' ? '✈️' : '🚂'}</span>
            <p className={styles.emptyTitle}>No {activeTab === 'flight' ? 'flights' : 'trains'} found</p>
            <p className={styles.emptyDesc}>{fromCity} → {toCity} — try different cities</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {results.map((result, i) => {
              const isBooked = bookedIds.includes(result.id);
              const totalPrice = result.price * (adults + children);
              return (
                <motion.div key={result.id} className={`${styles.resultCard} ${isBooked ? styles.resultBooked : ''}`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} layout>
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
                        <div className={styles.durationLine}><div className={styles.dot} /><div className={styles.line} /><div className={styles.dot} /></div>
                        <span className={styles.stops}>{result.stops}</span>
                      </div>
                      <div className={styles.timeBlock}>
                        <span className={styles.time}>{result.arriveTime}</span>
                        <span className={styles.city}>{result.to}</span>
                      </div>
                    </div>
                    <div className={styles.amenities}>
                      {result.amenities.map((a) => { const AIcon = amenityIcons[a]; return AIcon ? (<span key={a} className={styles.amenity} title={a}><AIcon size={13} /></span>) : null; })}
                      <span className={styles.ratingBadge}><Star size={12} fill="currentColor" /> {result.rating}</span>
                    </div>
                  </div>
                  <div className={styles.resultRight}>
                    <div className={styles.priceBlock}>
                      <span className={styles.price}>₹{totalPrice.toLocaleString('en-IN')}</span>
                      <span className={styles.pricePer}>for {adults + children} {adults + children === 1 ? 'traveler' : 'travelers'}</span>
                    </div>
                    <button className={`${styles.bookBtn} ${isBooked ? styles.bookedBtn : ''}`}
                      onClick={() => !isBooked && handleBook(result)} disabled={isBooked}>
                      {isBooked ? (<><Check size={16} /> Booked</>) : 'Book Now'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className={styles.toast}
            initial={{ opacity: 0, y: 30, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 30, x: '-50%' }}>
            <CheckCircle2 size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
