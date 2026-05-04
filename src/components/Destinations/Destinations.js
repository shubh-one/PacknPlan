'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import styles from './Destinations.module.css';

const destinations = [
  {
    name: 'Bali, Indonesia',
    image: '🏝️',
    rating: 4.9,
    reviews: 2340,
    price: '$850',
    duration: '5 Days',
    tag: 'Trending',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    name: 'Santorini, Greece',
    image: '🏛️',
    rating: 4.8,
    reviews: 1890,
    price: '$1,200',
    duration: '4 Days',
    tag: 'Popular',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    name: 'Tokyo, Japan',
    image: '⛩️',
    rating: 4.9,
    reviews: 3100,
    price: '$1,450',
    duration: '7 Days',
    tag: 'Must Visit',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    name: 'Swiss Alps',
    image: '🏔️',
    rating: 4.7,
    reviews: 1560,
    price: '$2,100',
    duration: '6 Days',
    tag: 'Adventure',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    name: 'Paris, France',
    image: '🗼',
    rating: 4.8,
    reviews: 4200,
    price: '$1,350',
    duration: '5 Days',
    tag: 'Romantic',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    name: 'Maldives',
    image: '🌊',
    rating: 4.9,
    reviews: 1980,
    price: '$2,800',
    duration: '5 Days',
    tag: 'Luxury',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
];

export default function Destinations() {
  return (
    <section className={styles.section} id="destinations">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>Destinations</span>
          <h2 className={styles.title}>
            Explore{' '}
            <span className="gradient-text">Popular Destinations</span>
          </h2>
          <p className={styles.subtitle}>
            Discover handpicked destinations loved by travelers worldwide
          </p>
        </motion.div>

        <div className={styles.grid}>
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.name}
              className={styles.card}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* Card Image Area */}
              <div className={styles.cardImage} style={{ background: dest.gradient }}>
                <span className={styles.cardEmoji}>{dest.image}</span>
                <span className={styles.tag}>{dest.tag}</span>
              </div>

              {/* Card Content */}
              <div className={styles.cardContent}>
                <div className={styles.cardLocation}>
                  <MapPin size={14} />
                  <span>{dest.name}</span>
                </div>

                <div className={styles.cardMeta}>
                  <div className={styles.rating}>
                    <Star size={14} fill="currentColor" />
                    <span>{dest.rating}</span>
                    <span className={styles.reviewCount}>({dest.reviews.toLocaleString()})</span>
                  </div>
                  <span className={styles.duration}>{dest.duration}</span>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.price}>
                    <span className={styles.priceValue}>{dest.price}</span>
                    <span className={styles.priceLabel}>/person</span>
                  </div>
                  <button className={styles.bookBtn}>
                    Explore <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.viewAll}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button className={styles.viewAllBtn} id="view-all-destinations">
            View All Destinations
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
