'use client';

import { MapPin, Mail, Phone, Globe, MessageCircle, Camera, Heart } from 'lucide-react';
import Link from 'next/link';
import styles from './Footer.module.css';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'Pricing', href: '#' },
    { label: 'Reviews', href: '#testimonials' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <MapPin size={20} />
              </div>
              <span className={styles.logoText}>
                PACK<span className={styles.logoAccent}>n</span>PLAN
              </span>
            </Link>
            <p className={styles.brandDesc}>
              Your all-in-one AI-powered travel companion. Plan smarter, travel better.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Twitter"><MessageCircle size={18} /></a>
              <a href="#" className={styles.socialLink} aria-label="Instagram"><Camera size={18} /></a>
              <a href="#" className={styles.socialLink} aria-label="GitHub"><Globe size={18} /></a>
              <a href="#" className={styles.socialLink} aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>{category}</h4>
              {links.map((link) => (
                <a key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 PACKnPLAN. Made with <Heart size={14} fill="currentColor" className={styles.heart} /> by Team PACKnPLAN
          </p>
          <p className={styles.credit}>
            Designed for better travel experiences
          </p>
        </div>
      </div>
    </footer>
  );
}
