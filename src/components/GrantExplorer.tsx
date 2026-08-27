'use client';

import { useMemo, useState } from 'react';
import GrantMap from './GrantMap';
import { DEMO_GRANTS, type Grant } from '@/lib/supabase';

const REGIONS = [
  { id: 'northwest', label: 'Northwest (Brainerd Lakes)' },
  { id: 'central', label: 'Central' },
  { id: 'northeast', label: 'Northeast' },
  { id: 'southwest', label: 'Southwest' },
  { id: 'southeast', label: 'Southeast' },
  { id: 'statewide', label: 'Statewide' },
  { id: 'national', label: 'National' },
];

const FOCUS = [
  'food_security',
  'youth',
  'education',
  'economic_development',
  'health',
  'housing',
  'technology',
  'civic',
  'small_business',
];

function formatMoney(n: number | null) {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function GrantExplorer() {
  const [region, setRegion] = useState('northwest');
  const [focus, setFocus] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const grants = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_GRANTS.filter((g) => {
      const regionOk =
        region === 'national' ||
        !g.eligible_region ||
        g.eligible_region === 'statewide' ||
        g.eligible_region === 'national' ||
        g.eligible_region === region;
      const focusOk =
        focus.length === 0 ||
        g.focus_categories.some((c) => focus.includes(c));
      const textOk =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.funder_name.toLowerCase().includes(q) ||
        (g.description ?? '').toLowerCase().includes(q) ||
        g.focus_categories.some((c) => c.replace(/_/g, ' ').includes(q));
      return regionOk && focusOk && textOk;
    });
  }, [region, focus, query]);

  function toggleFocus(tag: string) {
    setFocus((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function toggleSave(id: string) {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search grants, funders, keywords…"
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 pl-11 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" aria-hidden>
          ⌕
        </span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <GrantMap activeRegion={region} />
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegion(r.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  region === r.id
                    ? 'bg-cyan-400 text-slate-950 border-cyan-400'
                    : 'border-slate-700 text-slate-300 hover:border-cyan-500/50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Focus areas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FOCUS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleFocus(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs border transition ${
                    focus.includes(tag)
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {tag.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              <span className="text-white font-medium">{grants.length}</span> matching
              opportunities
              <span className="text-slate-600"> · demo data</span>
            </p>
            {grants.map((g: Grant) => (
              <article
                key={g.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{g.title}</h3>
                  <button
                    type="button"
                    onClick={() => toggleSave(g.id)}
                    className={`text-xs shrink-0 px-2 py-1 rounded-lg border ${
                      saved[g.id]
                        ? 'border-cyan-500/50 text-cyan-400'
                        : 'border-slate-700 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {saved[g.id] ? 'Saved' : 'Save'}
                  </button>
                </div>
                <p className="text-xs text-cyan-400/90">{g.funder_name}</p>
                <p className="text-sm text-slate-400 line-clamp-2">{g.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    {formatMoney(g.funding_amount_min)} –{' '}
                    {formatMoney(g.funding_amount_max)}
                  </span>
                  <span>
                    {g.deadline
                      ? `Due ${new Date(g.deadline).toLocaleDateString()}`
                      : 'Rolling'}
                  </span>
                  <span className="capitalize">{g.eligible_region}</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {g.focus_categories.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                    >
                      {c.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </article>
            ))}
            {grants.length === 0 && (
              <p className="text-sm text-slate-500 py-8 text-center">
                No matches. Try clearing search, Statewide, or National.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
