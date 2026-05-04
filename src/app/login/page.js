'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Globe, GitBranch, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './login.module.css';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Register
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Registration failed');
          setLoading(false);
          return;
        }

        // Auto sign-in after registration
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError('Account created! Please sign in.');
          setIsSignUp(false);
          setLoading(false);
          return;
        }

        router.push('/dashboard');
      } else {
        // Sign in
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
          setLoading(false);
          return;
        }

        router.push('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.bgEffects}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>

      {/* Back Button */}
      <Link href="/" className={styles.backBtn}>
        <ArrowLeft size={18} />
        <span>Home</span>
      </Link>

      {/* Form Card */}
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <MapPin size={20} />
          </div>
          <span className={styles.logoText}>
            PACK<span className={styles.logoAccent}>n</span>PLAN
          </span>
        </div>

        <h1 className={styles.title}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className={styles.subtitle}>
          {isSignUp
            ? 'Start planning your dream trips today'
            : 'Sign in to continue your travel planning'}
        </p>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className={styles.errorMsg}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Login */}
        <div className={styles.socialBtns}>
          <button className={styles.socialBtn} id="google-login-btn">
            <Globe size={18} />
            <span>Google</span>
          </button>
          <button className={styles.socialBtn} id="github-login-btn">
            <GitBranch size={18} />
            <span>GitHub</span>
          </button>
        </div>

        <div className={styles.divider}>
          <span>or continue with email</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                className={styles.inputGroup}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <User size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  id="signup-name-input"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.inputGroup}>
            <Mail size={18} className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email Address"
              className={styles.input}
              value={formData.email}
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(''); }}
              required
              id="email-input"
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={styles.input}
              value={formData.password}
              onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(''); }}
              required
              minLength={6}
              id="password-input"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isSignUp && (
            <div className={styles.forgotRow}>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            id="submit-btn"
          >
            {loading ? (
              <div className={styles.spinner} />
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Toggle */}
        <p className={styles.toggle}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            className={styles.toggleBtn}
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            id="toggle-auth-mode"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
