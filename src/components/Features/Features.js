'use client';

import { motion } from 'framer-motion';
import {
  Wallet, Plane, Hotel, Brain, CloudSun, MessageCircle,
  Star, Shield, ArrowRight
} from 'lucide-react';
import styles from './Features.module.css';

const features = [
  {
    icon: Wallet,
    title: 'Smart Budget Planning',
    description: 'Enter your budget and get personalized trip suggestions. Track expenses in real-time with beautiful dashboards.',
    gradient: 'linear-gradient(135deg, #6C63FF, #4ECDC4)',
    color: '#6C63FF',
  },
  {
    icon: Plane,
    title: 'Transport Booking',
    description: 'Book flights, trains, buses, and cabs from one unified interface. Compare prices and find the best deals.',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    color: '#4facfe',
  },
  {
    icon: Hotel,
    title: 'Hotel & Restaurant Finder',
    description: 'Discover top-rated hotels and restaurants based on ratings, price, and your preferences.',
    gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    color: '#fa709a',
  },
  {
    icon: Brain,
    title: 'AI Trip Suggestions',
    description: 'Our AI analyzes your interests, budget, and style to create the perfect personalized itinerary.',
    gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    color: '#a18cd1',
  },
  {
    icon: CloudSun,
    title: 'Real-time Weather',
    description: 'Stay updated with live weather data and alerts for your destination. Never get caught off guard.',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    color: '#f093fb',
  },
  {
    icon: MessageCircle,
    title: 'Group Travel Chat',
    description: 'Coordinate with your travel buddies in real-time. Share plans, split expenses, and stay connected.',
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    color: '#43e97b',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Features() {
  return (
    <section className={styles.features} id="features">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>Features</span>
          <h2 className={styles.title}>
            Everything You Need,{' '}
            <span className="gradient-text">In One Place</span>
          </h2>
          <p className={styles.subtitle}>
            From budgeting to booking, weather alerts to group chats — PACKnPLAN
            brings together every tool you need for stress-free travel.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className={styles.card}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div
                  className={styles.iconWrap}
                  style={{ background: feature.gradient }}
                >
                  <Icon size={24} color="white" />
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDesc}>{feature.description}</p>
                <a href="#" className={styles.cardLink}>
                  Learn more <ArrowRight size={14} />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
