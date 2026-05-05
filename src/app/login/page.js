'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './login.module.css';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#FF4757', '#FFA502', '#FFA502', '#2ED573', '#2ED573'];
  const idx = Math.min(score, 4);

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '3px', marginBottom: '0.25rem' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= idx ? colors[idx] : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <span style={{ fontSize: '0.65rem', color: colors[idx], fontWeight: 600 }}>{labels[idx]}</span>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-switch to signup if ?mode=signup in URL
  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return; }

        // Auto sign-in after registration
        const result = await signIn('credentials', { email: formData.email, password: formData.password, redirect: false });
        if (result?.error) { setSuccess('Account created! Please sign in.'); setIsSignUp(false); setLoading(false); return; }
        router.push('/dashboard');
      } else {
        const result = await signIn('credentials', { email: formData.email, password: formData.password, redirect: false });
        if (result?.error) { setError(result.error); setLoading(false); return; }
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch {
      setError('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgEffects}><div className={styles.blob1} /><div className={styles.blob2} /></div>

      <Link href="/" className={styles.backBtn}><ArrowLeft size={18} /><span>Home</span></Link>

      <motion.div className={styles.card} initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}><MapPin size={20} /></div>
          <span className={styles.logoText}>PACK<span className={styles.logoAccent}>n</span>PLAN</span>
        </div>

        <h1 className={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
        <p className={styles.subtitle}>{isSignUp ? 'Start planning your dream trips today' : 'Sign in to continue your travel planning'}</p>

        {/* Error / Success */}
        <AnimatePresence>
          {error && (
            <motion.div className={styles.errorMsg} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AlertCircle size={16} /><span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div className={styles.errorMsg} style={{ background: '#2ED57315', borderColor: '#2ED573', color: '#2ED573' }}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CheckCircle2 size={16} /><span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Login — full-width, prominent */}
        <button className={styles.googleBtn} onClick={handleGoogleLogin} disabled={googleLoading} id="google-login-btn">
          {googleLoading ? <Loader2 size={18} className={styles.spinIcon} /> : <GoogleIcon />}
          <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        <div className={styles.divider}><span>or continue with email</span></div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div className={styles.inputGroup} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                <User size={18} className={styles.inputIcon} />
                <input type="text" placeholder="Full Name" className={styles.input} value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} required id="signup-name-input" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.inputGroup}>
            <Mail size={18} className={styles.inputIcon} />
            <input type="email" placeholder="Email Address" className={styles.input} value={formData.email}
              onChange={e => { setFormData({ ...formData, email: e.target.value }); setError(''); }} required id="email-input" />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={18} className={styles.inputIcon} />
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" className={styles.input} value={formData.password}
              onChange={e => { setFormData({ ...formData, password: e.target.value }); setError(''); }} required minLength={6} id="password-input" />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isSignUp && <PasswordStrength password={formData.password} />}

          <button type="submit" className={styles.submitBtn} disabled={loading} id="submit-btn">
            {loading ? <div className={styles.spinner} /> : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className={styles.toggle}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button className={styles.toggleBtn} onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }} id="toggle-auth-mode">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
