import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FiltersData, CollegeQuery } from '../../types';
import { formatFees } from '../../utils';

interface FilterPanelProps {
  filters: FiltersData | undefined;
  query: CollegeQuery;
  onChange: (updates: Partial<CollegeQuery>) => void;
  onReset: () => void;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-surface-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-primary-900 mb-3 hover:text-primary-600 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  );
}

export function FilterPanel({ filters, query, onChange, onReset }: FilterPanelProps) {
  const hasActiveFilters = !!(query.state || query.type || query.minFees || query.maxFees || query.minRating);

  return (
    <div className="card p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary-600" />
          <h2 className="font-semibold text-primary-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
            <X size={12} /> Reset all
          </button>
        )}
      </div>

      {/* Type */}
      <Section title="College Type">
        <div className="space-y-2">
          {['Engineering', 'Management', 'Medical', 'Arts & Science'].map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="type"
                checked={query.type === type}
                onChange={() => onChange({ type: query.type === type ? undefined : type, page: 1 })}
                className="accent-primary-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-primary-700 transition-colors">{type}</span>
            </label>
          ))}
          {query.type && (
            <button onClick={() => onChange({ type: undefined, page: 1 })} className="text-xs text-primary-500 hover:text-primary-700 mt-1">
              Clear type
            </button>
          )}
        </div>
      </Section>

      {/* State */}
      <Section title="State">
        <select
          value={query.state || ''}
          onChange={(e) => onChange({ state: e.target.value || undefined, page: 1 })}
          className="input text-sm"
        >
          <option value="">All States</option>
          {filters?.states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Section>

      {/* Rating */}
      <Section title="Minimum Rating">
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={query.minRating === r}
                onChange={() => onChange({ minRating: query.minRating === r ? undefined : r, page: 1 })}
                className="accent-primary-600"
              />
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-sm">{'★'.repeat(Math.floor(r))}</span>
                <span className="text-sm text-gray-700">{r}+</span>
              </div>
            </label>
          ))}
          {query.minRating && (
            <button onClick={() => onChange({ minRating: undefined, page: 1 })} className="text-xs text-primary-500 hover:text-primary-700">
              Clear rating
            </button>
          )}
        </div>
      </Section>

      {/* Fees */}
      <Section title="Annual Fees">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Min Fees</label>
            <select
              value={query.minFees || ''}
              onChange={(e) => onChange({ minFees: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              className="input text-sm"
            >
              <option value="">No minimum</option>
              {[10000, 50000, 100000, 300000, 500000, 1000000].map((f) => (
                <option key={f} value={f}>{formatFees(f)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max Fees</label>
            <select
              value={query.maxFees || ''}
              onChange={(e) => onChange({ maxFees: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              className="input text-sm"
            >
              <option value="">No maximum</option>
              {[50000, 100000, 300000, 500000, 1000000, 2000000, 3000000].map((f) => (
                <option key={f} value={f}>{formatFees(f)}</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* Sort */}
      <Section title="Sort By" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { value: 'rating-desc', label: 'Highest Rating' },
            { value: 'rating-asc', label: 'Lowest Rating' },
            { value: 'fees-asc', label: 'Lowest Fees' },
            { value: 'fees-desc', label: 'Highest Fees' },
            { value: 'name-asc', label: 'Name A-Z' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                checked={`${query.sortBy || 'rating'}-${query.sortOrder || 'desc'}` === opt.value}
                onChange={() => {
                  const [field, order] = opt.value.split('-');
                  onChange({ sortBy: field, sortOrder: order as 'asc' | 'desc', page: 1 });
                }}
                className="accent-primary-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-primary-700 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}
