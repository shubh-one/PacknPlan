'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Brain, Sparkles, MapPin, Calendar, Wallet,
  Users, Sun, Mountain, Waves, Utensils, Camera, Music,
  RefreshCw, Download, Share2, Clock, Check, ChevronRight,
  Loader2, IndianRupee, Lightbulb, Copy, CheckCircle2, Search, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import styles from './planner.module.css';
import DatePicker from './DatePicker';

const interests = [
  { key: 'beach', label: 'Beaches', emoji: '🏖️', icon: Waves },
  { key: 'mountains', label: 'Mountains', emoji: '🏔️', icon: Mountain },
  { key: 'culture', label: 'Culture', emoji: '🏛️', icon: Camera },
  { key: 'food', label: 'Food Tours', emoji: '🍜', icon: Utensils },
  { key: 'adventure', label: 'Adventure', emoji: '🧗', icon: Mountain },
  { key: 'nightlife', label: 'Nightlife', emoji: '🎶', icon: Music },
  { key: 'nature', label: 'Nature', emoji: '🌿', icon: Sun },
  { key: 'photography', label: 'Photography', emoji: '📸', icon: Camera },
];

const indianCities = [
  // North India
  { name: 'Delhi', state: 'Delhi', emoji: '🏛️' },
  { name: 'Agra', state: 'Uttar Pradesh', emoji: '🕌' },
  { name: 'Jaipur', state: 'Rajasthan', emoji: '🏰' },
  { name: 'Udaipur', state: 'Rajasthan', emoji: '🏰' },
  { name: 'Jodhpur', state: 'Rajasthan', emoji: '🏜️' },
  { name: 'Jaisalmer', state: 'Rajasthan', emoji: '🏜️' },
  { name: 'Pushkar', state: 'Rajasthan', emoji: '🙏' },
  { name: 'Varanasi', state: 'Uttar Pradesh', emoji: '🙏' },
  { name: 'Lucknow', state: 'Uttar Pradesh', emoji: '🍽️' },
  { name: 'Amritsar', state: 'Punjab', emoji: '🙏' },
  { name: 'Chandigarh', state: 'Punjab/Haryana', emoji: '🌳' },
  // Hill Stations & Mountains
  { name: 'Manali', state: 'Himachal Pradesh', emoji: '🏔️' },
  { name: 'Shimla', state: 'Himachal Pradesh', emoji: '🏔️' },
  { name: 'Dharamshala', state: 'Himachal Pradesh', emoji: '🏔️' },
  { name: 'Kasol', state: 'Himachal Pradesh', emoji: '🌲' },
  { name: 'Spiti Valley', state: 'Himachal Pradesh', emoji: '🏔️' },
  { name: 'Leh Ladakh', state: 'Ladakh', emoji: '🏔️' },
  { name: 'Srinagar', state: 'Jammu & Kashmir', emoji: '🌷' },
  { name: 'Gulmarg', state: 'Jammu & Kashmir', emoji: '⛷️' },
  { name: 'Mussoorie', state: 'Uttarakhand', emoji: '🏔️' },
  { name: 'Nainital', state: 'Uttarakhand', emoji: '🏞️' },
  { name: 'Rishikesh', state: 'Uttarakhand', emoji: '🧘' },
  { name: 'Haridwar', state: 'Uttarakhand', emoji: '🙏' },
  { name: 'Dehradun', state: 'Uttarakhand', emoji: '🌿' },
  { name: 'Auli', state: 'Uttarakhand', emoji: '⛷️' },
  // West India
  { name: 'Mumbai', state: 'Maharashtra', emoji: '🌊' },
  { name: 'Pune', state: 'Maharashtra', emoji: '🏛️' },
  { name: 'Goa', state: 'Goa', emoji: '🏖️' },
  { name: 'Lonavala', state: 'Maharashtra', emoji: '🌧️' },
  { name: 'Mahabaleshwar', state: 'Maharashtra', emoji: '🍓' },
  { name: 'Ajanta & Ellora', state: 'Maharashtra', emoji: '🏛️' },
  { name: 'Ahmedabad', state: 'Gujarat', emoji: '🏛️' },
  { name: 'Kutch', state: 'Gujarat', emoji: '🏜️' },
  { name: 'Dwarka', state: 'Gujarat', emoji: '🙏' },
  { name: 'Mount Abu', state: 'Rajasthan', emoji: '🏔️' },
  // South India
  { name: 'Bangalore', state: 'Karnataka', emoji: '🌳' },
  { name: 'Mysore', state: 'Karnataka', emoji: '🏰' },
  { name: 'Hampi', state: 'Karnataka', emoji: '🏛️' },
  { name: 'Coorg', state: 'Karnataka', emoji: '☕' },
  { name: 'Gokarna', state: 'Karnataka', emoji: '🏖️' },
  { name: 'Chennai', state: 'Tamil Nadu', emoji: '🏛️' },
  { name: 'Pondicherry', state: 'Tamil Nadu', emoji: '🏖️' },
  { name: 'Madurai', state: 'Tamil Nadu', emoji: '🙏' },
  { name: 'Ooty', state: 'Tamil Nadu', emoji: '🌿' },
  { name: 'Kodaikanal', state: 'Tamil Nadu', emoji: '🌄' },
  { name: 'Rameswaram', state: 'Tamil Nadu', emoji: '🙏' },
  { name: 'Kochi', state: 'Kerala', emoji: '🌊' },
  { name: 'Munnar', state: 'Kerala', emoji: '🍵' },
  { name: 'Alleppey', state: 'Kerala', emoji: '🛶' },
  { name: 'Wayanad', state: 'Kerala', emoji: '🌿' },
  { name: 'Kovalam', state: 'Kerala', emoji: '🏖️' },
  { name: 'Thekkady', state: 'Kerala', emoji: '🐘' },
  { name: 'Hyderabad', state: 'Telangana', emoji: '🍗' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', emoji: '🏖️' },
  { name: 'Tirupati', state: 'Andhra Pradesh', emoji: '🙏' },
  // East & Northeast India
  { name: 'Kolkata', state: 'West Bengal', emoji: '🏛️' },
  { name: 'Darjeeling', state: 'West Bengal', emoji: '🍵' },
  { name: 'Sundarbans', state: 'West Bengal', emoji: '🐯' },
  { name: 'Puri', state: 'Odisha', emoji: '🙏' },
  { name: 'Bhubaneswar', state: 'Odisha', emoji: '🏛️' },
  { name: 'Gangtok', state: 'Sikkim', emoji: '🏔️' },
  { name: 'Pelling', state: 'Sikkim', emoji: '🏔️' },
  { name: 'Shillong', state: 'Meghalaya', emoji: '🌧️' },
  { name: 'Cherrapunji', state: 'Meghalaya', emoji: '🌧️' },
  { name: 'Tawang', state: 'Arunachal Pradesh', emoji: '🏔️' },
  { name: 'Kaziranga', state: 'Assam', emoji: '🦏' },
  { name: 'Guwahati', state: 'Assam', emoji: '🏛️' },
  { name: 'Imphal', state: 'Manipur', emoji: '🌸' },
  // Central India
  { name: 'Bhopal', state: 'Madhya Pradesh', emoji: '🏛️' },
  { name: 'Khajuraho', state: 'Madhya Pradesh', emoji: '🏛️' },
  { name: 'Orchha', state: 'Madhya Pradesh', emoji: '🏰' },
  { name: 'Pachmarhi', state: 'Madhya Pradesh', emoji: '🌿' },
  // Islands
  { name: 'Andaman Islands', state: 'Andaman & Nicobar', emoji: '🏝️' },
  { name: 'Lakshadweep', state: 'Lakshadweep', emoji: '🏝️' },
];

const loadingMessages = [
  { text: 'Analyzing your destination...', emoji: '🗺️' },
  { text: 'Finding the best local spots...', emoji: '📍' },
  { text: 'Crafting your daily itinerary...', emoji: '📝' },
  { text: 'Estimating costs in ₹...', emoji: '💰' },
  { text: 'Adding local insider tips...', emoji: '💡' },
  { text: 'Polishing your perfect trip...', emoji: '✨' },
];

const loadingSteps = [
  'Understanding preferences',
  'Researching destination',
  'Building day-by-day plan',
  'Finalizing itinerary',
];

export default function PlannerPage() {
  const { session, status } = useRequireAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '15000',
    travelers: '2',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [destinationEmoji, setDestinationEmoji] = useState('✈️');
  const [toast, setToast] = useState(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [destSearch, setDestSearch] = useState('');
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const destRef = useRef(null);
  const loadingInterval = useRef(null);
  const loadingStepInterval = useRef(null);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Calculate computed days
  const computedDays = formData.startDate && formData.endDate
    ? Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // Step 1 validation
  const isStep1Valid = formData.destination.trim().length >= 2
    && formData.startDate
    && formData.endDate
    && new Date(formData.endDate) >= new Date(formData.startDate)
    && computedDays <= 14
    && Number(formData.budget) >= 1000
    && Number(formData.travelers) >= 1;

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    if (!destSearch.trim()) return indianCities;
    const q = destSearch.toLowerCase();
    return indianCities.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [destSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (destRef.current && !destRef.current.contains(e.target)) {
        setDestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectDestination = (city) => {
    setFormData({ ...formData, destination: city.name });
    setDestSearch('');
    setDestDropdownOpen(false);
  };

  const toggleInterest = (key) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Cycle loading messages
  useEffect(() => {
    if (loading) {
      setLoadingMsgIdx(0);
      setLoadingStepIdx(0);
      loadingInterval.current = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      loadingStepInterval.current = setInterval(() => {
        setLoadingStepIdx((prev) => Math.min(prev + 1, loadingSteps.length - 1));
      }, 4000);
    } else {
      clearInterval(loadingInterval.current);
      clearInterval(loadingStepInterval.current);
    }
    return () => {
      clearInterval(loadingInterval.current);
      clearInterval(loadingStepInterval.current);
    };
  }, [loading]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async () => {
    if (!isStep1Valid) return;

    setLoading(true);
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          days: computedDays,
          interests: selectedInterests,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      const data = await res.json();

      // Handle the new nested response format
      if (data.itinerary) {
        setItinerary(data.itinerary);
        setDestinationEmoji(data.destinationEmoji || '✈️');
      } else if (Array.isArray(data)) {
        // Fallback for old format
        setItinerary(data);
      }
      setStep(3);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error generating itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: formData.destination,
          emoji: destinationEmoji,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget,
          travelers: formData.travelers,
          itinerary: itinerary,
        }),
      });

      if (res.ok) {
        showToast('Trip saved successfully! ✨');
        setTimeout(() => {
          router.push('/dashboard/mytrips');
        }, 1200);
      } else {
        showToast('Failed to save trip. Please try again.');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    if (!itinerary) return;
    const summary = `🇮🇳 My ${formData.destination} Trip Plan (${computedDays} days)\n\n` +
      itinerary.map(day =>
        `📅 Day ${day.day}: ${day.title}\n` +
        day.items.map(item => `  ${item.emoji} ${item.time} — ${item.activity}`).join('\n')
      ).join('\n\n') +
      `\n\n💰 Budget: ₹${Number(formData.budget).toLocaleString('en-IN')}\n👥 ${formData.travelers} Travelers\n\nPlanned with PACKnPLAN AI ✨`;

    navigator.clipboard.writeText(summary).then(() => {
      showToast('Itinerary copied to clipboard! 📋');
    }).catch(() => {
      showToast('Could not copy. Please try again.');
    });
  };

  // Auto-adjust end date when start date changes
  const handleStartDateChange = (val) => {
    setFormData((prev) => {
      const newData = { ...prev, startDate: val };
      // If end date is before new start date, reset it
      if (prev.endDate && new Date(prev.endDate) < new Date(val)) {
        newData.endDate = val;
      }
      return newData;
    });
  };

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backBtn}>
          <ArrowLeft size={18} /> <span>Dashboard</span>
        </Link>
        <h1 className={styles.title}>
          <Brain size={24} />
          AI Trip Planner
        </h1>
        <p className={styles.subtitle}>Let AI craft your perfect India itinerary based on your preferences</p>
      </div>

      {/* Progress Steps */}
      <div className={styles.progress}>
        {['Preferences', 'Interests', 'Your Itinerary'].map((label, i) => (
          <div key={label} className={`${styles.progressStep} ${step > i ? styles.stepDone : ''} ${step === i + 1 ? styles.stepActive : ''}`}>
            <div className={styles.stepCircle}>
              {step > i + 1 ? <Check size={14} /> : i + 1}
            </div>
            <span className={styles.stepLabel}>{label}</span>
            {i < 2 && <div className={styles.stepLine} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Trip Preferences */}
        {step === 1 && (
          <motion.div
            key="step1"
            className={styles.formCard}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <h2 className={styles.formTitle}>Tell us about your trip</h2>
            <p className={styles.formDesc}>Plan your dream trip anywhere in India — from Kashmir to Kanyakumari 🇮🇳</p>
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label><MapPin size={14} /> Destination</label>
                <div className={styles.dropdownWrap} ref={destRef}>
                  <button
                    type="button"
                    className={`${styles.input} ${styles.dropdownTrigger}`}
                    onClick={() => setDestDropdownOpen(!destDropdownOpen)}
                    id="planner-destination"
                  >
                    <span className={formData.destination ? styles.dropdownValue : styles.dropdownPlaceholder}>
                      {formData.destination
                        ? `${indianCities.find(c => c.name === formData.destination)?.emoji || '📍'} ${formData.destination}`
                        : 'Select a destination...'}
                    </span>
                    <ChevronDown size={16} className={`${styles.dropdownArrow} ${destDropdownOpen ? styles.dropdownArrowOpen : ''}`} />
                  </button>
                  {destDropdownOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownSearch}>
                        <Search size={14} />
                        <input
                          type="text"
                          placeholder="Search cities..."
                          value={destSearch}
                          onChange={(e) => setDestSearch(e.target.value)}
                          className={styles.dropdownSearchInput}
                          autoFocus
                        />
                      </div>
                      <div className={styles.dropdownList}>
                        {filteredCities.length === 0 ? (
                          <div className={styles.dropdownEmpty}>No cities found</div>
                        ) : (
                          filteredCities.map((city) => (
                            <button
                              key={city.name}
                              type="button"
                              className={`${styles.dropdownItem} ${formData.destination === city.name ? styles.dropdownItemActive : ''}`}
                              onClick={() => selectDestination(city)}
                            >
                              <span className={styles.dropdownItemEmoji}>{city.emoji}</span>
                              <span className={styles.dropdownItemName}>{city.name}</span>
                              <span className={styles.dropdownItemState}>{city.state}</span>
                              {formData.destination === city.name && <Check size={14} className={styles.dropdownItemCheck} />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <span className={styles.fieldHint}>Choose from 80+ popular Indian destinations</span>
              </div>
              <div className={styles.field}>
                <label><Calendar size={14} /> Start Date</label>
                <DatePicker
                  value={formData.startDate}
                  onChange={(val) => handleStartDateChange(val)}
                  minDate={today}
                  placeholder="Pick start date"
                  id="planner-start-date"
                />
              </div>
              <div className={styles.field}>
                <label><Calendar size={14} /> End Date</label>
                <DatePicker
                  value={formData.endDate}
                  onChange={(val) => setFormData({ ...formData, endDate: val })}
                  minDate={formData.startDate || today}
                  placeholder="Pick end date"
                  id="planner-end-date"
                />
                {computedDays > 0 && (
                  <span className={styles.fieldHint}>
                    {computedDays} {computedDays === 1 ? 'day' : 'days'}
                    {computedDays > 14 && ' ⚠️ Max 14 days'}
                  </span>
                )}
              </div>
              <div className={styles.field}>
                <label><Wallet size={14} /> Budget (₹)</label>
                <input
                  type="number"
                  value={formData.budget}
                  min="1000"
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className={styles.input}
                  id="planner-budget"
                  placeholder="e.g. 15000"
                />
                <span className={styles.fieldHint}>
                  Total budget for all travelers
                </span>
              </div>
              <div className={styles.field}>
                <label><Users size={14} /> Travelers</label>
                <input
                  type="number"
                  value={formData.travelers}
                  min="1"
                  max="20"
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className={styles.input}
                  id="planner-travelers"
                />
              </div>
            </div>
            <button
              className={styles.nextBtn}
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              id="step1-next-btn"
            >
              Next: Choose Interests <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && !loading && (
          <motion.div
            key="step2"
            className={styles.formCard}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <h2 className={styles.formTitle}>What are you interested in?</h2>
            <p className={styles.formDesc}>Select all that apply — our AI will tailor your itinerary accordingly</p>
            <div className={styles.interestsGrid}>
              {interests.map((item) => (
                <button
                  key={item.key}
                  className={`${styles.interestBtn} ${selectedInterests.includes(item.key) ? styles.interestActive : ''}`}
                  onClick={() => toggleInterest(item.key)}
                >
                  <span className={styles.interestEmoji}>{item.emoji}</span>
                  <span>{item.label}</span>
                  {selectedInterests.includes(item.key) && <Check size={14} className={styles.interestCheck} />}
                </button>
              ))}
            </div>
            <div className={styles.formActions}>
              <button className={styles.backStepBtn} onClick={() => setStep(1)}>Back</button>
              <button className={styles.generateBtn} onClick={handleGenerate} disabled={loading} id="generate-itinerary-btn">
                <Sparkles size={18} /> Generate Itinerary
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading Screen */}
        {step === 2 && loading && (
          <motion.div
            key="loading"
            className={styles.formCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className={styles.loadingScreen}>
              <div className={styles.loadingOrb}>
                <div className={styles.loadingOrbInner} />
                <div className={styles.loadingOrbRing} />
                <div className={styles.loadingOrbRing2} />
                <div className={styles.loadingOrbEmoji}>
                  {loadingMessages[loadingMsgIdx].emoji}
                </div>
              </div>

              <h3 className={styles.loadingTitle}>
                AI is crafting your itinerary
              </h3>

              <motion.p
                key={loadingMsgIdx}
                className={styles.loadingMessage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {loadingMessages[loadingMsgIdx].text}
              </motion.p>

              <div className={styles.loadingSteps}>
                {loadingSteps.map((stepText, i) => (
                  <div
                    key={stepText}
                    className={`${styles.loadingStep} ${i === loadingStepIdx ? styles.loadingStepActive : ''} ${i < loadingStepIdx ? styles.loadingStepDone : ''}`}
                  >
                    <span className={styles.loadingStepIcon}>
                      {i < loadingStepIdx ? (
                        <Check size={14} />
                      ) : i === loadingStepIdx ? (
                        <Loader2 size={14} className={styles.spinner} />
                      ) : (
                        <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--border)', display: 'block' }} />
                      )}
                    </span>
                    {stepText}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 3 && itinerary && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Result Header */}
            <div className={styles.resultHeader}>
              <div>
                <h2 className={styles.resultTitle}>
                  <Sparkles size={20} />
                  Your AI-Generated Itinerary
                </h2>
                <p className={styles.resultMeta}>
                  {destinationEmoji} {formData.destination} • {itinerary.length} days • ₹{Number(formData.budget).toLocaleString('en-IN')} budget
                </p>
              </div>
              <div className={styles.resultActions}>
                <button className={styles.iconBtn} onClick={() => { setStep(2); setItinerary(null); }}>
                  <RefreshCw size={16} /> Regenerate
                </button>
                <button className={styles.iconBtn} onClick={handleShare}>
                  <Copy size={16} /> Copy Plan
                </button>
                <button
                  className={`${styles.iconBtn} ${styles.saveBtn}`}
                  onClick={handleSaveTrip}
                  disabled={saving}
                  id="save-trip-btn"
                >
                  {saving ? <Loader2 size={16} className={styles.spinner} /> : <Download size={16} />}
                  {saving ? 'Saving...' : 'Save Trip'}
                </button>
              </div>
            </div>

            {/* Summary Card */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Destination</span>
                <span className={styles.summaryValue}>{destinationEmoji} {formData.destination}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Duration</span>
                <span className={styles.summaryValue}>{computedDays} Days</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Budget</span>
                <span className={styles.summaryValue}>₹{Number(formData.budget).toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Travelers</span>
                <span className={styles.summaryValue}>{formData.travelers} {Number(formData.travelers) === 1 ? 'Person' : 'People'}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className={styles.timeline}>
              {itinerary.map((day, dayIdx) => (
                <motion.div
                  key={day.day}
                  className={styles.dayCard}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIdx * 0.12 }}
                >
                  <div className={styles.dayHeader}>
                    <div className={styles.dayBadge}>Day {day.day}</div>
                    <h3 className={styles.dayTitle}>{day.title}</h3>
                  </div>

                  {/* Day Tips */}
                  {day.tips && day.tips.length > 0 && (
                    <div className={styles.dayTips}>
                      {day.tips.map((tip, tipIdx) => (
                        <span key={tipIdx} className={styles.dayTip}>{tip}</span>
                      ))}
                    </div>
                  )}

                  <div className={styles.dayItems}>
                    {day.items.map((item, itemIdx) => (
                      <div key={itemIdx} className={styles.timelineItem}>
                        <div className={styles.timelineDot}>
                          <span>{item.emoji}</span>
                        </div>
                        <div className={styles.timelineContent}>
                          <span className={styles.timelineTime}>
                            <Clock size={12} /> {item.time}
                          </span>
                          <span className={styles.timelineActivity}>{item.activity}</span>
                          <div className={styles.timelineMeta}>
                            {item.type && (
                              <span className={styles.timelineType}>{item.type}</span>
                            )}
                            {item.estimatedCost && (
                              <span className={styles.timelineCost}>
                                {item.estimatedCost}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 30, x: '-50%' }}
          >
            <CheckCircle2 size={18} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
