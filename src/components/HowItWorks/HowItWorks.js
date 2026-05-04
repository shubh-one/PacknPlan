'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles, CreditCard, Luggage } from 'lucide-react';
import styles from './HowItWorks.module.css';

const steps = [
  {
    number: '01',
    icon: MapPin,
    title: 'Choose Your Destination',
    description: 'Search from 120+ destinations worldwide. Tell us your budget, dates, and preferences.',
    color: '#6C63FF',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Get AI Recommendations',
    description: 'Our AI crafts a personalized itinerary — hotels, restaurants, activities, all within budget.',
    color: '#4ECDC4',
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Book Everything',
    description: 'Book flights, hotels, and experiences in one click. Track expenses in real-time.',
    color: '#fa709a',
  },
  {
    number: '04',
    icon: Luggage,
    title: 'Pack & Explore!',
    description: 'Get weather alerts, chat with co-travelers, and enjoy a stress-free, planned adventure.',
    color: '#FFB347',
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>How It Works</span>
          <h2 className={styles.title}>
            Your Dream Trip in{' '}
            <span className="gradient-text">4 Simple Steps</span>
          </h2>
        </motion.div>

        <div className={styles.stepsGrid}>
          {/* Connector Line */}
          <div className={styles.connector} />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className={styles.stepCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className={styles.stepNumber} style={{ background: step.color }}>
                  {step.number}
                </div>
                <div
                  className={styles.stepIcon}
                  style={{ background: `${step.color}15`, color: step.color }}
                >
                  <Icon size={28} />
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
