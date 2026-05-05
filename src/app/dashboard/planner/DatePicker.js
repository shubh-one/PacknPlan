'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import styles from './datepicker.module.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toDateStr(date) {
  // Returns YYYY-MM-DD string
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate();
}

export default function DatePicker({ value, onChange, minDate, placeholder = 'Select date', id }) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const ref = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDateObj = minDate ? new Date(minDate + 'T00:00:00') : null;

  // When opening, jump to the selected date's month or today
  useEffect(() => {
    if (open) {
      if (value) {
        const d = new Date(value + 'T00:00:00');
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      } else {
        const t = minDateObj || today;
        setViewYear(t.getFullYear());
        setViewMonth(t.getMonth());
      }
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDate = (date) => {
    onChange(toDateStr(date));
    setOpen(false);
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  // Build the calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startOffset = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i);
    calendarDays.push({ date: d, currentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(viewYear, viewMonth, i);
    calendarDays.push({ date: d, currentMonth: true });
  }

  // Next month leading days
  const remaining = 42 - calendarDays.length; // 6 rows
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(viewYear, viewMonth + 1, i);
    calendarDays.push({ date: d, currentMonth: false });
  }

  const isDisabled = (date) => {
    if (minDateObj) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const m = new Date(minDateObj);
      m.setHours(0, 0, 0, 0);
      return d < m;
    }
    return false;
  };

  const selectedDateObj = value ? new Date(value + 'T00:00:00') : null;

  return (
    <div className={styles.calendarWrap} ref={ref}>
      <button
        type="button"
        className={`${styles.calendarTrigger}`}
        onClick={() => setOpen(!open)}
        id={id}
        style={{
          padding: '0.65rem 0.85rem',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text)',
          fontSize: 'var(--text-sm)',
          width: '100%',
        }}
      >
        <span className={value ? styles.calendarTriggerValue : styles.calendarTriggerPlaceholder}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Calendar size={16} className={styles.calendarTriggerIcon} />
      </button>

      {open && (
        <div className={styles.calendar}>
          {/* Header */}
          <div className={styles.calHeader}>
            <span className={styles.calMonthYear}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <div className={styles.calNavBtns}>
              <button type="button" className={styles.calNavBtn} onClick={prevMonth}>
                <ChevronLeft size={16} />
              </button>
              <button type="button" className={styles.calNavBtn} onClick={nextMonth}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day labels */}
          <div className={styles.calGrid}>
            {DAYS.map((d) => (
              <div key={d} className={styles.calDayLabel}>{d}</div>
            ))}

            {/* Calendar days */}
            {calendarDays.map(({ date, currentMonth }, idx) => {
              const disabled = !currentMonth || isDisabled(date);
              const isToday = isSameDay(date, today);
              const isSelected = selectedDateObj && isSameDay(date, selectedDateObj);

              let className = styles.calDay;
              if (disabled) className += ` ${styles.calDayDisabled}`;
              if (!currentMonth) className += ` ${styles.calDayOtherMonth}`;
              if (isToday && currentMonth) className += ` ${styles.calDayToday}`;
              if (isSelected && currentMonth) className += ` ${styles.calDaySelected}`;

              return (
                <button
                  key={idx}
                  type="button"
                  className={className}
                  disabled={disabled}
                  onClick={() => !disabled && selectDate(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <button type="button" className={styles.calTodayBtn} onClick={goToToday}>
            Today
          </button>
        </div>
      )}
    </div>
  );
}
