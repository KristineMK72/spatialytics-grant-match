'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [federal, setFederal] = useState<Grant[]>([]);
  const [loadingFederal, setLoadingFederal] = useState(false);
  const [federalError, setFederalError] = useState<string | null>(null);

  const searchFederal = useCallback(async (keyword: string) => {
    if (keyword.trim().length < 2) {
      setFederal([]);
      setFederalError(null);
      return;
    }
    setLoadingFederal(true);
    setFederalError(null);
    try {
      const res = await fetch('/api/grants/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim(), rows: 20 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFederalError(data.error || 'Search failed');
        setFederal([]);
      } else {
        setFederal((data.grants || []) as Grant[]);
      }
    } catch {
      setFederalError('Could not reach Grants.gov');
      setFederal([]);
    } finally {
      setLoadingFederal(false);
    }
  }, []);

  // Debounced federal search when query changes or National selected
  useEffect(() => {
    const q = query.trim();
    const shouldSearch =
      q.length >= 2 || (region === 'national' && q.length >= 2);

    if (!shouldSearch) {
      if (region === 'national' && q.length < 2) {
        // Prompt user — don't auto-spam API
        setFederal([]);
      }
      return;
    }

    const t = setTimeout(() => {
      searchFederal(q.length >= 2 ? q : 'community');
    }, 450);

    return () => clearTimeout(t);
  }, [query, region, searchFederal]);

  const localGrants = useMemo(() => {
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

  // Merge: local first, then federal (dedupe by title)
  const grants = useMemo(() => {
    const seen = new Set(localGrants.map((g) => g.title.toLowerCase()));
    const extra = federal.filter((g) => !seen.has(g.title.toLowerCase()));
    // When National or active search, show federal; always keep matching local
    if (query.trim().length >= 2 || region === 'national') {
      return [...localGrants, ...extra];
    }
    return localGrants;
  }, [localGrants, federal, query, region]);

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
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search local + Grants.gov (e.g. rural broadband, food security)…"
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 pl-11 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
        />
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"
          aria-hidden
        >
          ⌕
        </span>
        {loadingFederal && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-cyan-400">
            Searching Grants.gov…
          </span>
        )}
      </div>

      {federalError && (
        <p className="text-xs text-amber-400/90">{federalError}</p>
      )}

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
          <p className="text-xs text-slate-500">
            Type 2+ characters to pull open federal opportunities from Grants.gov.
            Local Greater Minnesota demos always stay in the mix.
          </p>
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
              {federal.length > 0 && (
                <span className="text-slate-500">
                  {' '}
                  · {federal.length} from Grants.gov
                </span>
              )}
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
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs text-cyan-400/90">{g.funder_name}</p>
                  {g.source_name === 'grants_gov' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      Federal
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{g.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    {formatMoney(g.funding_amount_min)} –{' '}
                    {formatMoney(g.funding_amount_max)}
                  </span>
                  <span>
                    {g.deadline
                      ? `Due ${new Date(g.deadline).toLocaleDateString()}`
                      : 'See listing'}
                  </span>
                  <span className="capitalize">{g.eligible_region}</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1 items-center">
                  {g.focus_categories.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                    >
                      {c.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {g.source_url && (
                    <a
                      href={g.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline ml-auto"
                    >
                      Open source →
                    </a>
                  )}
                </div>
              </article>
            ))}
            {grants.length === 0 && !loadingFederal && (
              <p className="text-sm text-slate-500 py-8 text-center">
                No matches. Try a broader keyword or Statewide.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
