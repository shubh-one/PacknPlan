'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowLeft, Plus, Trash2, Edit3, TrendingDown, TrendingUp,
  Plane, Hotel as HotelIcon, Utensils, Camera, ShoppingBag, Bus,
  ChevronRight, PieChart, DollarSign, Target, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import {
  PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import styles from './budget.module.css';

const categoryConfig = {
  transport: { icon: Plane, label: 'Transport', color: '#4facfe', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  hotel: { icon: HotelIcon, label: 'Accommodation', color: '#fa709a', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
  food: { icon: Utensils, label: 'Food & Dining', color: '#43e97b', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  activities: { icon: Camera, label: 'Activities', color: '#a18cd1', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
  shopping: { icon: ShoppingBag, label: 'Shopping', color: '#f093fb', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  misc: { icon: Bus, label: 'Miscellaneous', color: '#FFA502', gradient: 'linear-gradient(135deg, #FFA502, #FF6348)' },
};

const initialExpenses = [
  { id: 1, category: 'transport', name: 'Round-trip Flight', amount: 320, date: 'May 15' },
  { id: 2, category: 'hotel', name: 'Beach Resort (5 nights)', amount: 450, date: 'May 15-20' },
  { id: 3, category: 'food', name: 'Restaurant Budget', amount: 150, date: 'Daily' },
  { id: 4, category: 'activities', name: 'Scuba Diving', amount: 80, date: 'May 17' },
  { id: 5, category: 'activities', name: 'Temple Tour', amount: 35, date: 'May 18' },
  { id: 6, category: 'transport', name: 'Airport Transfer', amount: 25, date: 'May 15' },
  { id: 7, category: 'shopping', name: 'Souvenirs', amount: 60, date: 'May 19' },
  { id: 8, category: 'misc', name: 'Travel Insurance', amount: 40, date: 'Pre-trip' },
];

const dailySpend = [
  { day: 'Day 1', amount: 180 },
  { day: 'Day 2', amount: 95 },
  { day: 'Day 3', amount: 145 },
  { day: 'Day 4', amount: 210 },
  { day: 'Day 5', amount: 130 },
];

export default function BudgetPage() {
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'transport', name: '', amount: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tripsRes = await fetch('/api/trips');
      if (tripsRes.ok) {
        const tripsData = await tripsRes.json();
        if (tripsData.length > 0) {
          const currentTrip = tripsData[0];
          setTrip(currentTrip);
          
          const expRes = await fetch(`/api/expenses?tripId=${currentTrip._id}`);
          if (expRes.ok) {
            const expData = await expRes.json();
            setExpenses(expData);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = trip?.budget || 0;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Pie chart data
  const categoryTotals = Object.keys(categoryConfig).map((key) => {
    const total = expenses.filter((e) => e.category === key).reduce((s, e) => s + e.amount, 0);
    return { name: categoryConfig[key].label, value: total, color: categoryConfig[key].color };
  }).filter((c) => c.value > 0);

  const handleAddExpense = async () => {
    if (!newExpense.name || !newExpense.amount || !trip) return;
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExpense,
          tripId: trip._id,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setExpenses([data.expense, ...expenses]);
        setShowAddModal(false);
        setNewExpense({ category: 'transport', name: '', amount: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExpenses(expenses.filter(e => e._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backBtn}>
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </Link>
        <h1 className={styles.title}>
          <Wallet size={24} />
          Budget Planner {trip && <span>— <span className={styles.tripName}>{trip.destination}</span></span>}
        </h1>
      </div>

      {/* Overview Cards */}
      <div className={styles.overviewGrid}>
        <motion.div
          className={styles.overviewCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className={styles.overviewIcon} style={{ background: '#6C63FF18', color: '#6C63FF' }}>
            <Target size={22} />
          </div>
          <div className={styles.overviewLabel}>Total Budget</div>
          <div className={styles.overviewValue}>${totalBudget.toLocaleString()}</div>
        </motion.div>

        <motion.div
          className={styles.overviewCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className={styles.overviewIcon} style={{ background: '#fa709a18', color: '#fa709a' }}>
            <TrendingDown size={22} />
          </div>
          <div className={styles.overviewLabel}>Total Spent</div>
          <div className={styles.overviewValue}>${totalSpent.toLocaleString()}</div>
        </motion.div>

        <motion.div
          className={styles.overviewCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <div className={styles.overviewIcon} style={{ background: remaining > 0 ? '#2ED57318' : '#FF475718', color: remaining > 0 ? '#2ED573' : '#FF4757' }}>
            {remaining > 0 ? <TrendingUp size={22} /> : <AlertTriangle size={22} />}
          </div>
          <div className={styles.overviewLabel}>Remaining</div>
          <div className={styles.overviewValue} style={{ color: remaining > 0 ? '#2ED573' : '#FF4757' }}>
            ${Math.abs(remaining).toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          className={`${styles.overviewCard} ${styles.progressCard}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
        >
          <div className={styles.progressRing}>
            <svg viewBox="0 0 100 100" className={styles.progressSvg}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={percentage > 90 ? '#FF4757' : percentage > 70 ? '#FFA502' : '#6C63FF'}
                strokeWidth="8"
                strokeDasharray={`${percentage * 2.64} 264`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <span className={styles.progressPercent}>{percentage}%</span>
          </div>
          <div className={styles.overviewLabel}>Budget Used</div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className={styles.contentGrid}>
        {/* Left: Expenses List */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Expenses</h2>
            <button className={styles.addBtn} onClick={() => setShowAddModal(true)} id="add-expense-btn">
              <Plus size={16} />
              Add Expense
            </button>
          </div>

          <div className={styles.expensesList}>
            {loading ? (
              <p style={{ color: 'var(--text-tertiary)', padding: '1rem' }}>Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', padding: '1rem' }}>No expenses yet.</p>
            ) : (
              expenses.map((expense, i) => {
                const config = categoryConfig[expense.category] || categoryConfig.misc;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={expense._id}
                    className={styles.expenseItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    layout
                  >
                    <div className={styles.expenseIcon} style={{ background: `${config.color}18`, color: config.color }}>
                      <Icon size={18} />
                    </div>
                    <div className={styles.expenseInfo}>
                      <span className={styles.expenseName}>{expense.name}</span>
                      <span className={styles.expenseDate}>{expense.date}</span>
                    </div>
                    <div className={styles.expenseAmount}>-${expense.amount}</div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteExpense(expense._id)}
                      aria-label="Delete expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Charts */}
        <div className={styles.chartsCol}>
          {/* Pie Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <PieChart size={16} />
              Spending by Category
            </h3>
            <div className={styles.pieWrap}>
              <ResponsiveContainer width="100%" height={220}>
                <RechartsPie>
                  <Pie
                    data={categoryTotals}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {categoryTotals.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '13px',
                    }}
                    formatter={(value) => [`$${value}`, '']}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className={styles.legend}>
              {categoryTotals.map((c) => (
                <div key={c.name} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: c.color }} />
                  <span className={styles.legendLabel}>{c.name}</span>
                  <span className={styles.legendValue}>${c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Daily Spending</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dailySpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={12} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '13px',
                  }}
                  formatter={(value) => [`$${value}`, 'Spent']}
                />
                <Bar dataKey="amount" fill="#6C63FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.modalTitle}>Add Expense</h3>

              <div className={styles.modalField}>
                <label>Category</label>
                <div className={styles.categoryGrid}>
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        className={`${styles.categoryBtn} ${newExpense.category === key ? styles.categoryActive : ''}`}
                        style={newExpense.category === key ? { borderColor: config.color, background: `${config.color}15` } : {}}
                        onClick={() => setNewExpense({ ...newExpense, category: key })}
                      >
                        <Icon size={16} style={{ color: config.color }} />
                        <span>{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.modalField}>
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Airport taxi"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  className={styles.modalInput}
                  id="expense-name-input"
                />
              </div>

              <div className={styles.modalField}>
                <label>Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className={styles.modalInput}
                  id="expense-amount-input"
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleAddExpense} id="save-expense-btn">Add Expense</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
