'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Brain, Sparkles, MapPin, Calendar, Wallet,
  Users, Sun, Mountain, Waves, Utensils, Camera, Music,
  RefreshCw, Download, Share2, Clock, Check, ChevronRight, Loader2
} from 'lucide-react';
import Link from 'next/link';
import styles from './planner.module.css';

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

// We no longer need the mock generatedItinerary as we are using real AI generation.

export default function PlannerPage() {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [formData, setFormData] = useState({ destination: 'Bali, Indonesia', days: '3', budget: '1200', travelers: '2' });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const toggleInterest = (key) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interests: selectedInterests,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await res.json();
      setItinerary(data);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert('Error generating itinerary. Please make sure your API key is correct and try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <p className={styles.subtitle}>Let AI craft your perfect itinerary based on your preferences</p>
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
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label><MapPin size={14} /> Destination</label>
                <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className={styles.input} id="planner-destination" />
              </div>
              <div className={styles.field}>
                <label><Calendar size={14} /> Duration (days)</label>
                <input type="number" value={formData.days} onChange={(e) => setFormData({ ...formData, days: e.target.value })} className={styles.input} id="planner-days" />
              </div>
              <div className={styles.field}>
                <label><Wallet size={14} /> Budget ($)</label>
                <input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className={styles.input} id="planner-budget" />
              </div>
              <div className={styles.field}>
                <label><Users size={14} /> Travelers</label>
                <input type="number" value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: e.target.value })} className={styles.input} id="planner-travelers" />
              </div>
            </div>
            <button className={styles.nextBtn} onClick={() => setStep(2)}>
              Next: Choose Interests <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
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
                {loading ? (
                  <><Loader2 size={18} className={styles.spinner} /> AI is planning...</>
                ) : (
                  <><Sparkles size={18} /> Generate Itinerary</>
                )}
              </button>
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
                  {formData.destination} • {formData.days} days • ${formData.budget} budget • {formData.travelers} travelers
                </p>
              </div>
              <div className={styles.resultActions}>
                <button className={styles.iconBtn} onClick={() => { setStep(2); setItinerary(null); }}>
                  <RefreshCw size={16} /> Regenerate
                </button>
                <button className={styles.iconBtn}><Share2 size={16} /> Share</button>
                <button className={styles.iconBtn}><Download size={16} /> Save</button>
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
                  transition={{ delay: dayIdx * 0.15 }}
                >
                  <div className={styles.dayHeader}>
                    <div className={styles.dayBadge}>Day {day.day}</div>
                    <h3 className={styles.dayTitle}>{day.title}</h3>
                  </div>

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
    </div>
  );
}
