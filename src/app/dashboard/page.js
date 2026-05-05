'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Wallet, Plane, Hotel, CloudSun,
  MessageCircle, Brain, Bell, User, LogOut, Search,
  TrendingUp, Users, Star, ChevronRight, Plus,
  Sun, Moon, BarChart3, PieChart, ArrowUpRight,
  Thermometer, Wind, Droplets, Eye
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/context/ThemeContext';
import styles from './dashboard.module.css';

const recentActivity = [
  { icon: Plane, text: 'Flight to Goa booked', time: '2 hours ago', color: '#4facfe' },
  { icon: Hotel, text: 'Taj Fort Aguada confirmed', time: '5 hours ago', color: '#fa709a' },
  { icon: Wallet, text: 'Budget updated for Jaipur trip', time: '1 day ago', color: '#43e97b' },
  { icon: MessageCircle, text: 'New message in Manali group', time: '2 days ago', color: '#a18cd1' },
];

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: MapPin, label: 'My Trips', href: '/dashboard/mytrips' },
  { icon: Plane, label: 'Bookings', href: '/dashboard/bookings' },
  { icon: Wallet, label: 'Budget', href: '/dashboard/budget' },
  { icon: Brain, label: 'AI Planner', href: '/dashboard/planner' },
  { icon: CloudSun, label: 'Weather', href: '/dashboard/weather' },
  { icon: MessageCircle, label: 'Chat', href: '/dashboard/chat' },
  { icon: Star, label: 'Reviews', href: '/dashboard/reviews' },
];

const tripGradients = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
];

const tripEmojis = ['🏝️', '⛩️', '🗼', '🏔️', '🌊', '🎭'];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [trips, setTrips] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch trips from API
  useEffect(() => {
    if (status === 'authenticated') {
      fetchTrips();
      fetchWeather();
    }
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



  const fetchWeather = async () => {
    try {
      const res = await fetch(`/api/weather?city=${trips.length > 0 ? encodeURIComponent(trips[0].destination) : 'Delhi'}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (err) {
      console.error('Failed to fetch weather:', err);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Quick stats (derived from trips data)
  const quickStats = [
    { label: 'Trips Planned', value: String(trips.length || 0), icon: MapPin, trend: 'Active trips', color: '#6C63FF' },
    { label: 'Total Budget', value: `₹${trips.reduce((s, t) => s + (t.budget || 0), 0).toLocaleString('en-IN')}`, icon: TrendingUp, trend: 'All trips', color: '#2ED573' },
    { label: 'Places Visited', value: String(new Set(trips.map(t => t.destination)).size || 0), icon: Star, trend: `${trips.length} trips`, color: '#FFA502' },
    { label: 'Travel Buddies', value: String(trips.reduce((s, t) => s + (t.travelers || 0), 0) || 0), icon: Users, trend: 'Across trips', color: '#fa709a' },
  ];

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  const user = session?.user || { name: 'Traveler', email: '', avatar: '🧑‍✈️' };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <MapPin size={18} />
            </div>
            <span className={styles.logoText}>
              PACK<span className={styles.logoAccent}>n</span>PLAN
            </span>
          </Link>

          <nav className={styles.sidebarNav}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout} id="logout-btn">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.greeting}>
              Welcome back, <span className={styles.greetName}>{user.name}</span> 👋
            </h1>
            <p className={styles.greetSub}>Here&apos;s your travel planning overview</p>
          </div>

          <div className={styles.topActions}>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search trips, bookings..."
                className={styles.searchInput}
                id="dashboard-search"
              />
            </div>
            <button className={styles.notifBtn}>
              <Bell size={18} />
              <span className={styles.notifDot} />
            </button>
            <div className={styles.userChip}>
              <span className={styles.userAvatar}>{user.avatar || '🧑‍✈️'}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className={styles.statTop}>
                  <div
                    className={styles.statIcon}
                    style={{ background: `${stat.color}18`, color: stat.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <ArrowUpRight size={16} className={styles.statArrow} />
                </div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statTrend} style={{ color: stat.color }}>
                  {stat.trend}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Upcoming Trips */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Upcoming Trips</h2>
              <Link href="/dashboard/planner" className={styles.addBtn} id="add-trip-btn">
                <Plus size={16} />
                New Trip
              </Link>
            </div>

            <div className={styles.tripsList}>
              {loadingTrips ? (
                <p style={{ color: 'var(--text-tertiary)', padding: '1rem' }}>Loading trips...</p>
              ) : trips.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', padding: '1rem' }}>No trips yet. Create your first trip!</p>
              ) : (
                trips.map((trip, i) => (
                  <Link key={trip._id} href={`/dashboard/mytrips/${trip._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <motion.div
                      className={styles.tripCard}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <div className={styles.tripImage} style={{ background: tripGradients[i % tripGradients.length] }}>
                        <span className={styles.tripEmoji}>{trip.emoji || tripEmojis[i % tripEmojis.length]}</span>
                      </div>
                      <div className={styles.tripInfo}>
                        <div className={styles.tripTop}>
                          <h3 className={styles.tripName}>{trip.destination}</h3>
                          <span
                            className={styles.tripStatus}
                            data-status={trip.status?.toLowerCase()}
                          >
                            {trip.status || 'Planned'}
                          </span>
                        </div>
                        <div className={styles.tripDates}>
                          <Calendar size={14} />
                          {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                          {trip.endDate ? ` — ${new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                        </div>
                        <div className={styles.tripMeta}>
                          <span>
                            <Wallet size={14} /> ₹{(trip.budget || 0).toLocaleString('en-IN')}
                          </span>
                          <span>
                            <Users size={14} /> {trip.travelers || 1} travelers
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className={styles.tripArrow} />
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightCol}>
            {/* Weather Widget */}
            <div className={styles.weatherCard}>
              <div className={styles.weatherHeader}>
                <h3 className={styles.weatherTitle}>
                  <CloudSun size={18} />
                  Weather — {weather?.location || 'Loading...'}
                </h3>
              </div>
              <div className={styles.weatherMain}>
                <span className={styles.weatherEmoji}>{weather?.emoji || '⛅'}</span>
                <div>
                  <div className={styles.weatherTemp}>{weather?.temp || '--'}</div>
                  <div className={styles.weatherCond}>{weather?.condition || 'Loading...'}</div>
                </div>
              </div>
              <div className={styles.weatherDetails}>
                <div className={styles.weatherDetail}>
                  <Droplets size={14} />
                  <span>{weather?.humidity || '--'}</span>
                </div>
                <div className={styles.weatherDetail}>
                  <Wind size={14} />
                  <span>{weather?.wind || '--'}</span>
                </div>
                <div className={styles.weatherDetail}>
                  <Eye size={14} />
                  <span>{weather?.visibility || '--'}</span>
                </div>
              </div>
              <div className={styles.forecast}>
                {(weather?.forecast || []).map((f) => (
                  <div key={f.day} className={styles.forecastDay}>
                    <span className={styles.forecastLabel}>{f.day}</span>
                    <span className={styles.forecastEmoji}>{f.emoji}</span>
                    <span className={styles.forecastTemp}>{f.temp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.activityCard}>
              <h3 className={styles.activityTitle}>Recent Activity</h3>
              <div className={styles.activityList}>
                {recentActivity.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <div key={i} className={styles.activityItem}>
                      <div
                        className={styles.activityIcon}
                        style={{ background: `${act.color}18`, color: act.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className={styles.activityInfo}>
                        <span className={styles.activityText}>{act.text}</span>
                        <span className={styles.activityTime}>{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}
