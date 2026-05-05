'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, MapPin, LogIn, LogOut, User, LayoutDashboard, Map, Wallet, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Explore', href: '#features' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Reviews', href: '#testimonials' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const profileRef = useRef(null);

  const isLoggedIn = status === 'authenticated' && session?.user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className={`container ${styles.navInner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <MapPin size={22} />
          </div>
          <span className={styles.logoText}>
            PACK<span className={styles.logoAccent}>n</span>PLAN
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className={styles.navActions}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            id="theme-toggle"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {isLoggedIn ? (
            /* ─── Logged In: Profile Dropdown ─── */
            <div className={styles.profileWrap} ref={profileRef}>
              <button
                className={styles.profileBtn}
                onClick={() => setProfileOpen(!profileOpen)}
                id="nav-profile-btn"
              >
                {session.user.image ? (
                  <img src={session.user.image} alt="" className={styles.profileImg} />
                ) : (
                  <div className={styles.profileInitials}>
                    {getInitials(session.user.name)}
                  </div>
                )}
                <span className={styles.profileName}>{session.user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`${styles.profileChevron} ${profileOpen ? styles.profileChevronOpen : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className={styles.profileMenu}
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* User Info */}
                    <div className={styles.profileInfo}>
                      {session.user.image ? (
                        <img src={session.user.image} alt="" className={styles.menuAvatar} />
                      ) : (
                        <div className={styles.menuAvatarPlaceholder}>
                          {getInitials(session.user.name)}
                        </div>
                      )}
                      <div>
                        <div className={styles.menuName}>{session.user.name}</div>
                        <div className={styles.menuEmail}>{session.user.email}</div>
                      </div>
                    </div>

                    <div className={styles.menuDivider} />

                    {/* Menu Links */}
                    <Link href="/dashboard" className={styles.menuItem} onClick={() => setProfileOpen(false)}>
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link href="/dashboard/mytrips" className={styles.menuItem} onClick={() => setProfileOpen(false)}>
                      <Map size={16} /> My Trips
                    </Link>
                    <Link href="/dashboard/budget" className={styles.menuItem} onClick={() => setProfileOpen(false)}>
                      <Wallet size={16} /> Budget Planner
                    </Link>
                    <Link href="/dashboard/reviews" className={styles.menuItem} onClick={() => setProfileOpen(false)}>
                      <User size={16} /> Reviews
                    </Link>

                    <div className={styles.menuDivider} />

                    <button className={styles.logoutItem} onClick={handleLogout}>
                      <LogOut size={16} /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ─── Not Logged In: Sign In + Get Started ─── */
            <>
              <Link href="/login" className={styles.loginBtn} id="nav-login-btn">
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>

              <Link href="/login?mode=signup" className={styles.ctaBtn} id="nav-signup-btn">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className={styles.mobileLink}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {link.label}
              </motion.a>
            ))}

            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className={styles.mobileCta} onClick={() => setMobileOpen(false)}>
                  Go to Dashboard
                </Link>
                <button className={styles.mobileLogout} onClick={handleLogout}>
                  <LogOut size={16} /> Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login?mode=signup"
                className={styles.mobileCta}
                onClick={() => setMobileOpen(false)}
              >
                Get Started Free
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
