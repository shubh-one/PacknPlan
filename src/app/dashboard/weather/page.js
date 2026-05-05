'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CloudSun, Droplets, Wind, Eye, Thermometer,
  Sunrise, Sunset, Gauge, MapPin, RefreshCw, Calendar, Shield,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import StyledSelect from '@/components/StyledSelect/StyledSelect';
import styles from './weather.module.css';

const popularCities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
  'Pune', 'Ahmedabad', 'Jaipur', 'Goa', 'Kochi', 'Lucknow',
  'Varanasi', 'Udaipur', 'Manali', 'Shimla', 'Rishikesh', 'Agra',
  'Amritsar', 'Chandigarh', 'Dehradun', 'Bhopal', 'Mysore', 'Srinagar',
  'Darjeeling', 'Gangtok', 'Guwahati', 'Jodhpur', 'Jaisalmer', 'Ooty',
  'Munnar', 'Alleppey', 'Coorg', 'Hampi', 'Pondicherry',
];

export default function WeatherPage() {
  const { session, status } = useRequireAuth();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [tripCities, setTripCities] = useState([]);

  // Fetch trip cities from user's saved trips
  useEffect(() => {
    if (status === 'authenticated') {
      fetchTripCities();
    }
  }, [status]);

  const fetchTripCities = async () => {
    try {
      const res = await fetch('/api/trips');
      if (res.ok) {
        const trips = await res.json();
        const cities = [...new Set(trips.map((t) => t.destination).filter(Boolean))];
        setTripCities(cities);
        // Load weather for first trip city or Delhi
        const initial = cities.length > 0 ? cities[0] : 'Delhi';
        setSelectedCity(initial);
        fetchWeather(initial);
      } else {
        fetchWeather('Delhi');
      }
    } catch (err) {
      fetchWeather('Delhi');
    }
  };

  const fetchWeather = async (city) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (err) {
      console.error('Failed to fetch weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    fetchWeather(city);
  };

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  const alertStyles = { warn: styles.alertWarn, info: styles.alertInfo, good: styles.alertGood };
  const alertColors = { warn: '#FFA502', info: '#6C63FF', good: '#2ED573' };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backBtn}>
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </Link>
        <h1 className={styles.title}>
          <CloudSun size={24} />
          Weather & Alerts
        </h1>
        <p className={styles.subtitle}>Live weather conditions for your trip destinations</p>
      </div>

      {/* Trip City Chips */}
      {tripCities.length > 0 && (
        <div className={styles.tripChips}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={12} /> Your trips:
          </span>
          {tripCities.map((city) => (
            <button
              key={city}
              className={`${styles.tripChip} ${selectedCity === city ? styles.tripChipActive : ''}`}
              onClick={() => handleCityChange(city)}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* City Selector */}
      <div className={styles.citySelector}>
        <StyledSelect
          options={popularCities}
          value={selectedCity}
          onChange={handleCityChange}
          placeholder="Select a city"
          icon={MapPin}
          searchable
          id="weather-city-select"
        />
        <button className={styles.checkBtn} onClick={() => fetchWeather(selectedCity)} disabled={loading}>
          <RefreshCw size={14} className={loading ? styles.spinner : ''} />
          {loading ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {/* Loading */}
      {loading && !weather && (
        <div className={styles.loadingWrap}>
          <Loader2 size={32} className={styles.spinner} />
          <span className={styles.loadingText}>Fetching weather data...</span>
        </div>
      )}

      {/* Weather Content */}
      {weather && (
        <>
          {/* Main Weather Card */}
          <motion.div
            className={styles.weatherMain}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={weather.location}
          >
            <div className={styles.weatherMainBg} />

            <div className={styles.weatherTop}>
              <div>
                <div className={styles.weatherCity}>{weather.location}</div>
                <div className={styles.weatherCityLabel}>{weather.region || 'India'}</div>
              </div>
              <span className={`${styles.weatherSource} ${weather.source === 'error' ? styles.weatherSourceMock : ''}`}>
                <span style={{ fontSize: '0.5rem' }}>{weather.source === 'live' ? '🟢' : '🔴'}</span>
                {weather.source === 'live' ? 'Live Data' : 'Error'}
              </span>
              {weather.observedAt && (
                <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
                  Updated: {weather.observedAt}
                </span>
              )}
            </div>

            <div className={styles.weatherCurrent}>
              <span className={styles.weatherEmoji}>{weather.emoji}</span>
              <div>
                <div className={styles.weatherTemp}>{weather.temp}</div>
                <div className={styles.weatherCondition}>{weather.condition}</div>
                {weather.feelsLike && (
                  <div className={styles.weatherFeelsLike}>Feels like {weather.feelsLike}</div>
                )}
              </div>
            </div>

            {/* Detail Cards */}
            <div className={styles.detailsGrid}>
              <div className={styles.detailCard}>
                <div className={styles.detailIcon} style={{ background: '#4facfe18', color: '#4facfe' }}><Droplets size={18} /></div>
                <div className={styles.detailLabel}>Humidity</div>
                <div className={styles.detailValue}>{weather.humidity}</div>
              </div>
              <div className={styles.detailCard}>
                <div className={styles.detailIcon} style={{ background: '#43e97b18', color: '#43e97b' }}><Wind size={18} /></div>
                <div className={styles.detailLabel}>Wind</div>
                <div className={styles.detailValue}>{weather.wind}</div>
              </div>
              <div className={styles.detailCard}>
                <div className={styles.detailIcon} style={{ background: '#a18cd118', color: '#a18cd1' }}><Eye size={18} /></div>
                <div className={styles.detailLabel}>Visibility</div>
                <div className={styles.detailValue}>{weather.visibility}</div>
              </div>
              <div className={styles.detailCard}>
                <div className={styles.detailIcon} style={{ background: '#fa709a18', color: '#fa709a' }}><Gauge size={18} /></div>
                <div className={styles.detailLabel}>Pressure</div>
                <div className={styles.detailValue}>{weather.pressure || '--'}</div>
              </div>
              {weather.sunrise && (
                <div className={styles.detailCard}>
                  <div className={styles.detailIcon} style={{ background: '#FFA50218', color: '#FFA502' }}><Sunrise size={18} /></div>
                  <div className={styles.detailLabel}>Sunrise</div>
                  <div className={styles.detailValue}>{weather.sunrise}</div>
                </div>
              )}
              {weather.sunset && (
                <div className={styles.detailCard}>
                  <div className={styles.detailIcon} style={{ background: '#FF634818', color: '#FF6348' }}><Sunset size={18} /></div>
                  <div className={styles.detailLabel}>Sunset</div>
                  <div className={styles.detailValue}>{weather.sunset}</div>
                </div>
              )}
              {weather.uvIndex != null && (
                <div className={styles.detailCard}>
                  <div className={styles.detailIcon} style={{ background: '#fee14018', color: '#FFA502' }}><Thermometer size={18} /></div>
                  <div className={styles.detailLabel}>UV Index</div>
                  <div className={styles.detailValue}>{weather.uvIndex}</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Weather Alerts */}
          {weather.alerts && weather.alerts.length > 0 && (
            <div>
              {weather.alerts.map((alert, i) => (
                <motion.div
                  key={i}
                  className={`${styles.alertCard} ${alertStyles[alert.type] || styles.alertInfo}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Shield size={18} className={styles.alertIcon} style={{ color: alertColors[alert.type] }} />
                  <div>
                    <div className={styles.alertTitle}>{alert.title}</div>
                    <div className={styles.alertDesc}>{alert.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* 5-Day Forecast */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className={styles.forecastSection}>
              <h2 className={styles.sectionTitle}>
                <Calendar size={18} />
                5-Day Forecast
              </h2>
              <div className={styles.forecastGrid}>
                {weather.forecast.map((day, i) => (
                  <motion.div
                    key={day.day}
                    className={styles.forecastCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <div className={styles.forecastDay}>{day.day}</div>
                    <span className={styles.forecastEmoji}>{day.emoji}</span>
                    <div className={styles.forecastTemp}>{day.tempHigh || day.temp}</div>
                    {day.tempLow && <div className={styles.forecastTempLow}>{day.tempLow}</div>}
                    {day.condition && <div className={styles.forecastCondition}>{day.condition}</div>}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Tips */}
          {weather.tips && weather.tips.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>
                <Shield size={18} />
                Travel Tips for {weather.location}
              </h2>
              <div className={styles.tipsGrid}>
                {weather.tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    className={styles.tipCard}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                  >
                    <span className={styles.tipEmoji}>{tip.emoji}</span>
                    <div className={styles.tipText}>
                      <strong>{tip.title}</strong>
                      {tip.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Error Notice */}
          {weather.source === 'error' && (
            <motion.div
              style={{
                marginTop: '2rem', padding: '1rem 1.25rem', background: 'var(--surface)',
                border: '1px solid var(--error-light)', borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', lineHeight: 1.6,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <strong style={{ color: 'var(--error)' }}>⚠️ Could not fetch live weather</strong><br />
              Please check your internet connection and try again. Weather data is powered by wttr.in (no API key required).
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
