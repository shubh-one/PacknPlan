'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Solo Traveler',
    avatar: '👩‍💻',
    rating: 5,
    text: 'PACKnPLAN completely changed how I plan trips. The AI suggestions were spot on, and the budget tracker saved me so much money!',
    trip: 'Bali, Indonesia',
  },
  {
    name: 'Rahul Mehta',
    role: 'Group Trip Organizer',
    avatar: '👨‍🎓',
    rating: 5,
    text: 'Managing a group trip of 8 people used to be a nightmare. The group chat and shared expense tracking made everything seamless.',
    trip: 'Manali, India',
  },
  {
    name: 'Sarah Johnson',
    role: 'Adventure Enthusiast',
    avatar: '🧗‍♀️',
    rating: 5,
    text: 'The weather alerts saved our hiking trip! We rescheduled our summit day based on the real-time forecast. Absolutely life-saving.',
    trip: 'Swiss Alps',
  },
  {
    name: 'Arjun Patel',
    role: 'Budget Traveler',
    avatar: '🎒',
    rating: 5,
    text: 'I entered my budget of ₹25,000 and PACKnPLAN suggested the perfect 3-day Goa itinerary with flights, hotel, everything!',
    trip: 'Goa, India',
  },
  {
    name: 'Emma Wilson',
    role: 'Travel Blogger',
    avatar: '📸',
    rating: 5,
    text: 'The hotel and restaurant recommendations are incredibly accurate. Found hidden gems I would never have discovered on my own.',
    trip: 'Tokyo, Japan',
  },
  {
    name: 'Vikram Singh',
    role: 'Business Traveler',
    avatar: '💼',
    rating: 5,
    text: 'The transport booking feature is a game-changer. Comparing flights, trains, and cabs in one place saved me hours of research.',
    trip: 'Dubai, UAE',
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section} id="testimonials">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>Testimonials</span>
          <h2 className={styles.title}>
            Loved by{' '}
            <span className="gradient-text">10,000+ Travelers</span>
          </h2>
          <p className={styles.subtitle}>
            See what our community says about their PACKnPLAN experience
          </p>
        </motion.div>

        <div className={styles.grid}>
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className={styles.quoteIcon}>
                <Quote size={20} />
              </div>

              <div className={styles.stars}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>

              <p className={styles.text}>{t.text}</p>

              <div className={styles.author}>
                <div className={styles.avatar}>{t.avatar}</div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role} — {t.trip}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
