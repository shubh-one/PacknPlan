'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowLeft, Plus, Trash2, Edit3, TrendingDown, TrendingUp,
  Plane, Hotel as HotelIcon, Utensils, Camera, ShoppingBag, Bus,
  PieChart as PieChartIcon, Target, AlertTriangle, CheckCircle2, X, Save, StickyNote,
  Download, RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import {
  PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import styles from './budget.module.css';

const STORAGE_KEY = 'packnplan_budget';

const categoryConfig = {
  transport: { icon: Plane, label: 'Transport', color: '#4facfe' },
  hotel: { icon: HotelIcon, label: 'Accommodation', color: '#fa709a' },
  food: { icon: Utensils, label: 'Food & Dining', color: '#43e97b' },
  activities: { icon: Camera, label: 'Activities', color: '#a18cd1' },
  shopping: { icon: ShoppingBag, label: 'Shopping', color: '#f093fb' },
  misc: { icon: Bus, label: 'Miscellaneous', color: '#FFA502' },
};

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function loadData() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

function saveData(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function BudgetPage() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [planName, setPlanName] = useState('My Travel Budget');
  const [loaded, setLoaded] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ category: 'transport', name: '', amount: '', note: '', date: '' });

  // Budget editing
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [editingPlanName, setEditingPlanName] = useState(false);
  const [planNameInput, setPlanNameInput] = useState('');

  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Load from localStorage
  useEffect(() => {
    const data = loadData();
    if (data) {
      setBudget(data.budget || 0);
      setExpenses(data.expenses || []);
      setPlanName(data.planName || 'My Travel Budget');
    }
    setLoaded(true);
  }, []);

  // Auto-save on every change
  useEffect(() => {
    if (!loaded) return;
    saveData({ budget, expenses, planName });
  }, [budget, expenses, planName, loaded]);

  // Calculations
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - totalSpent;
  const pct = budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 100) : 0;

  // Chart data
  const catTotals = Object.keys(categoryConfig).map(k => ({
    name: categoryConfig[k].label, value: expenses.filter(e => e.category === k).reduce((s, e) => s + e.amount, 0), color: categoryConfig[k].color,
  })).filter(c => c.value > 0);

  const dateMap = {};
  expenses.forEach(e => { const d = e.date || 'Other'; dateMap[d] = (dateMap[d] || 0) + e.amount; });
  const barData = Object.entries(dateMap).map(([day, amount]) => ({ day, amount })).slice(-7);

  // Handlers
  const openAdd = () => { setEditingId(null); setForm({ category: 'transport', name: '', amount: '', note: '', date: '' }); setShowModal(true); };
  const openEdit = (exp) => { setEditingId(exp.id); setForm({ category: exp.category, name: exp.name, amount: String(exp.amount), note: exp.note || '', date: exp.date || '' }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.amount) return;
    const dateStr = form.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (editingId) {
      setExpenses(prev => prev.map(e => e.id === editingId ? { ...e, ...form, amount: Number(form.amount), date: dateStr } : e));
      showToast('Expense updated!');
    } else {
      setExpenses(prev => [{ id: genId(), ...form, amount: Number(form.amount), date: dateStr }, ...prev]);
      showToast('Expense added!');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => { setExpenses(prev => prev.filter(e => e.id !== id)); showToast('Expense removed'); };

  const handleSaveBudget = () => { setBudget(Number(budgetInput) || 0); setEditingBudget(false); showToast('Budget updated!'); };

  const handleReset = () => { if (confirm('Reset all data? This cannot be undone.')) { setBudget(0); setExpenses([]); setPlanName('My Travel Budget'); showToast('Budget reset'); } };

  const handleExport = () => {
    const lines = [`${planName}\nBudget: ₹${budget.toLocaleString('en-IN')}\nTotal Spent: ₹${totalSpent.toLocaleString('en-IN')}\nRemaining: ₹${Math.abs(remaining).toLocaleString('en-IN')}${remaining < 0 ? ' (Over)' : ''}\n\n--- Expenses ---`];
    expenses.forEach(e => { lines.push(`${e.date} | ${categoryConfig[e.category]?.label || e.category} | ${e.name} | ₹${e.amount.toLocaleString('en-IN')}${e.note ? ` | Note: ${e.note}` : ''}`); });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${planName.replace(/\s/g, '_')}_budget.txt`; a.click();
    showToast('Budget exported!');
  };

  if (!loaded) return null;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backBtn}><ArrowLeft size={18} /><span>Dashboard</span></Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          {editingPlanName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Wallet size={24} style={{ color: 'var(--primary)' }} />
              <input value={planNameInput} onChange={e => setPlanNameInput(e.target.value)} className={styles.modalInput}
                style={{ fontSize: 'var(--text-xl)', fontWeight: 700, padding: '0.3rem 0.6rem', width: '260px' }} autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { setPlanName(planNameInput || 'My Travel Budget'); setEditingPlanName(false); } }} />
              <button onClick={() => { setPlanName(planNameInput || 'My Travel Budget'); setEditingPlanName(false); }}
                style={{ background: 'var(--success)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.35rem', cursor: 'pointer' }}><Save size={14} /></button>
              <button onClick={() => setEditingPlanName(false)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.35rem', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={14} /></button>
            </div>
          ) : (
            <h1 className={styles.title} style={{ cursor: 'pointer' }} onClick={() => { setPlanNameInput(planName); setEditingPlanName(true); }}>
              <Wallet size={24} /> {planName} <Edit3 size={14} style={{ color: 'var(--text-tertiary)', marginLeft: '0.25rem' }} />
            </h1>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleExport} className={styles.backBtn} style={{ marginBottom: 0 }}><Download size={14} /> Export</button>
            <button onClick={handleReset} className={styles.backBtn} style={{ marginBottom: 0, color: 'var(--error)' }}><RotateCcw size={14} /> Reset</button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className={styles.overviewGrid}>
        <motion.div className={styles.overviewCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.overviewIcon} style={{ background: '#6C63FF18', color: '#6C63FF' }}><Target size={22} /></div>
          <div className={styles.overviewLabel}>Total Budget</div>
          {editingBudget ? (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>₹</span>
              <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)}
                className={styles.modalInput} style={{ width: '120px', padding: '0.4rem 0.6rem' }} autoFocus
                onKeyDown={e => { if (e.key === 'Enter') handleSaveBudget(); }} />
              <button onClick={handleSaveBudget} style={{ background: 'var(--success)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.35rem', cursor: 'pointer' }}><Save size={14} /></button>
              <button onClick={() => setEditingBudget(false)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.35rem', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={14} /></button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className={styles.overviewValue}>₹{budget.toLocaleString('en-IN')}</div>
              <button onClick={() => { setBudgetInput(budget || ''); setEditingBudget(true); }}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.3rem', cursor: 'pointer', color: 'var(--text-tertiary)' }}><Edit3 size={13} /></button>
            </div>
          )}
          {budget === 0 && !editingBudget && (
            <button onClick={() => { setBudgetInput(''); setEditingBudget(true); }} style={{ marginTop: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + Set your budget
            </button>
          )}
        </motion.div>

        <motion.div className={styles.overviewCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className={styles.overviewIcon} style={{ background: '#fa709a18', color: '#fa709a' }}><TrendingDown size={22} /></div>
          <div className={styles.overviewLabel}>Total Spent</div>
          <div className={styles.overviewValue}>₹{totalSpent.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</div>
        </motion.div>

        <motion.div className={styles.overviewCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <div className={styles.overviewIcon} style={{ background: remaining >= 0 ? '#2ED57318' : '#FF475718', color: remaining >= 0 ? '#2ED573' : '#FF4757' }}>
            {remaining >= 0 ? <TrendingUp size={22} /> : <AlertTriangle size={22} />}
          </div>
          <div className={styles.overviewLabel}>{remaining >= 0 ? 'Remaining' : 'Over Budget'}</div>
          <div className={styles.overviewValue} style={{ color: remaining >= 0 ? '#2ED573' : '#FF4757' }}>
            {remaining < 0 && '-'}₹{Math.abs(remaining).toLocaleString('en-IN')}
          </div>
        </motion.div>

        <motion.div className={`${styles.overviewCard} ${styles.progressCard}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <div className={styles.progressRing}>
            <svg viewBox="0 0 100 100" className={styles.progressSvg}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none"
                stroke={pct > 90 ? '#FF4757' : pct > 70 ? '#FFA502' : '#6C63FF'}
                strokeWidth="8" strokeDasharray={`${pct * 2.64} 264`}
                strokeLinecap="round" transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dasharray 1s ease' }} />
            </svg>
            <span className={styles.progressPercent}>{pct}%</span>
          </div>
          <div className={styles.overviewLabel}>Budget Used</div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className={styles.contentGrid}>
        {/* Expenses List */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Expenses ({expenses.length})</h2>
            <button className={styles.addBtn} onClick={openAdd} id="add-expense-btn"><Plus size={16} /> Add Expense</button>
          </div>

          <div className={styles.expensesList}>
            {expenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-tertiary)' }}>
                <StickyNote size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3, display: 'block' }} />
                <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>No expenses yet</p>
                <p style={{ fontSize: 'var(--text-sm)', marginBottom: '0.75rem' }}>Start tracking your travel spending</p>
                <button onClick={openAdd} style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', background: 'var(--primary-light)', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>
                  + Add your first expense
                </button>
              </div>
            ) : (
              expenses.map((expense, i) => {
                const config = categoryConfig[expense.category] || categoryConfig.misc;
                const Icon = config.icon;
                return (
                  <motion.div key={expense.id} className={styles.expenseItem}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} layout>
                    <div className={styles.expenseIcon} style={{ background: `${config.color}18`, color: config.color }}><Icon size={18} /></div>
                    <div className={styles.expenseInfo}>
                      <span className={styles.expenseName}>{expense.name}</span>
                      <span className={styles.expenseDate}>{expense.date} • {config.label}</span>
                      {expense.note && <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.15rem', fontStyle: 'italic' }}>📝 {expense.note}</span>}
                    </div>
                    <div className={styles.expenseAmount}>-₹{expense.amount.toLocaleString('en-IN')}</div>
                    <button className={styles.deleteBtn} onClick={() => openEdit(expense)} title="Edit"
                      style={{ opacity: 1, color: 'var(--text-tertiary)' }}><Edit3 size={13} /></button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(expense.id)} title="Delete"><Trash2 size={14} /></button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Charts */}
        <div className={styles.chartsCol}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}><PieChartIcon size={16} /> Spending by Category</h3>
            {catTotals.length > 0 ? (
              <>
                <div className={styles.pieWrap}>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPie>
                      <Pie data={catTotals} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                        {catTotals.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '13px' }}
                        formatter={v => [`₹${v.toLocaleString('en-IN')}`, '']} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className={styles.legend}>
                  {catTotals.map(c => (
                    <div key={c.name} className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: c.color }} />
                      <span className={styles.legendLabel}>{c.name}</span>
                      <span className={styles.legendValue}>₹{c.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: '2rem 0' }}>Add expenses to see breakdown</p>
            )}
          </div>

          {barData.length > 0 && (
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Spending by Date</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={11} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={11} tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '13px' }}
                    formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Spent']} />
                  <Bar dataKey="amount" fill="#6C63FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className={styles.modal} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>{editingId ? 'Edit Expense' : 'Add Expense'}</h3>

              <div className={styles.modalField}>
                <label>Category</label>
                <div className={styles.categoryGrid}>
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button key={key} className={`${styles.categoryBtn} ${form.category === key ? styles.categoryActive : ''}`}
                        style={form.category === key ? { borderColor: config.color, background: `${config.color}15` } : {}}
                        onClick={() => setForm({ ...form, category: key })}>
                        <Icon size={16} style={{ color: config.color }} /><span>{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.modalField}>
                <label>Description</label>
                <input type="text" placeholder="e.g. Airport taxi, Hotel booking" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} className={styles.modalInput} autoFocus />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className={styles.modalField}>
                  <label>Amount (₹)</label>
                  <input type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className={styles.modalInput} />
                </div>
                <div className={styles.modalField}>
                  <label>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={styles.modalInput} />
                </div>
              </div>

              <div className={styles.modalField}>
                <label>Note (optional)</label>
                <textarea placeholder="Any extra details..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                  className={styles.modalInput} style={{ minHeight: '60px', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={!form.name || !form.amount}>
                  {editingId ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div style={{ position: 'fixed', bottom: '2rem', left: '50%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.5rem', background: 'var(--success)', color: 'white', fontWeight: 600, fontSize: 'var(--text-sm)', borderRadius: '9999px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 700 }}
            initial={{ opacity: 0, y: 30, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 30, x: '-50%' }}>
            <CheckCircle2 size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
