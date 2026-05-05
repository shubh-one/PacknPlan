'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './CTA.module.css';

export default function CTA() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.bgOrb1} />
          <div className={styles.bgOrb2} />

          <div className={styles.content}>
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles size={16} />
              <span>{isLoggedIn ? 'Welcome back, ' + (session.user.name?.split(' ')[0] || 'Traveler') + '!' : 'Start Free — No Credit Card Required'}</span>
            </motion.div>

            <h2 className={styles.title}>
              {isLoggedIn ? 'Continue Planning Your' : 'Ready to Plan Your'}
              <br />
              <span className={styles.gradientText}>Dream Trip?</span>
            </h2>

            <p className={styles.subtitle}>
              {isLoggedIn
                ? 'Your trips, budgets, and reviews are waiting. Jump back in and keep the adventure going.'
                : 'Join 10,000+ travelers who use PACKnPLAN to create unforgettable travel experiences. Start planning in minutes.'}
            </p>

            <div className={styles.actions}>
              {isLoggedIn ? (
                <Link href="/dashboard" className={styles.primaryBtn} id="cta-dashboard">
                  <LayoutDashboard size={18} />
                  Go to Dashboard
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <Link href="/login?mode=signup" className={styles.primaryBtn} id="cta-get-started">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
              )}
              <a href="#features" className={styles.secondaryBtn}>
                See How It Works
              </a>
            </div>

            <div className={styles.trust}>
              <div className={styles.avatarGroup}>
                <span className={styles.trustAvatar}>👨</span>
                <span className={styles.trustAvatar}>👩</span>
                <span className={styles.trustAvatar}>🧑</span>
                <span className={styles.trustAvatar}>👩‍🦱</span>
              </div>
              <span className={styles.trustText}>
                <strong>10,000+</strong> travelers trust PACKnPLAN
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
