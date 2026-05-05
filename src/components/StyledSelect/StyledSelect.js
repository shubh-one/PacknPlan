'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, MapPin } from 'lucide-react';

/*
  Reusable styled dropdown that replaces native <select>.
  Props:
    - options: string[] or { value, label, sub? }[]
    - value: string
    - onChange: (value) => void
    - placeholder?: string
    - icon?: LucideIcon
    - searchable?: boolean (shows search input for long lists)
    - className?: string (wrapper class)
    - id?: string
*/
export default function StyledSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  icon: Icon,
  searchable = false,
  className = '',
  id,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Normalize options to { value, label, sub? }
  const normalized = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  const selected = normalized.find((o) => o.value === value);

  const filtered = searchable && search
    ? normalized.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        (o.sub && o.sub.toLowerCase().includes(search.toLowerCase()))
      )
    : normalized;

  return (
    <div className={`styledSelectWrap ${className}`} ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="styledSelectTrigger"
        onClick={() => { setOpen(!open); setSearch(''); }}
        id={id}
      >
        {Icon && <Icon size={16} className="styledSelectIcon" />}
        <span className={selected ? 'styledSelectValue' : 'styledSelectPlaceholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className={`styledSelectChevron ${open ? 'styledSelectChevronOpen' : ''}`} />
      </button>

      {open && (
        <div className="styledSelectMenu">
          {searchable && (
            <div className="styledSelectSearch">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          )}
          <div className="styledSelectList">
            {filtered.length === 0 ? (
              <div className="styledSelectEmpty">No results found</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`styledSelectItem ${value === opt.value ? 'styledSelectItemActive' : ''}`}
                  onClick={() => { onChange(opt.value); setOpen(false); setSearch(''); }}
                >
                  <div>
                    <span className="styledSelectItemLabel">{opt.label}</span>
                    {opt.sub && <span className="styledSelectItemSub">{opt.sub}</span>}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
