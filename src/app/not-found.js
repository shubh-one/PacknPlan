'use client';

import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Compass } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: '480px' }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '5rem', marginBottom: '1rem' }}
        >
          🧭
        </motion.div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-5xl)',
          fontWeight: 800,
          marginBottom: '0.5rem',
          letterSpacing: '-0.03em',
        }}>
          Lost in Paradise?
        </h1>

        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}>
          This page seems to have wandered off the map. Let&apos;s get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.7rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              fontWeight: 600,
              fontSize: 'var(--text-base)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'all 200ms',
            }}
          >
            <ArrowLeft size={18} />
            Back Home
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.7rem 1.5rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontWeight: 600,
              fontSize: 'var(--text-base)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'all 200ms',
            }}
          >
            <Compass size={18} />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
