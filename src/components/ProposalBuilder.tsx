'use client';

import { useMemo, useState } from 'react';

type Form = {
  orgName: string;
  mission: string;
  community: string;
  grantTitle: string;
  funder: string;
  amount: string;
  need: string;
  population: string;
  goals: string;
  activities: string;
  timeline: string;
  budgetNarrative: string;
  evaluation: string;
  capacity: string;
};

const EMPTY: Form = {
  orgName: '',
  mission: '',
  community: '',
  grantTitle: '',
  funder: '',
  amount: '',
  need: '',
  population: '',
  goals: '',
  activities: '',
  timeline: '',
  budgetNarrative: '',
  evaluation: '',
  capacity: '',
};

const STEPS: { key: keyof Form; label: string; hint: string; rows?: number }[] = [
  {
    key: 'orgName',
    label: 'Organization name',
    hint: 'Legal or commonly used name',
  },
  {
    key: 'mission',
    label: 'Mission (1–2 sentences)',
    hint: 'Who you serve and why you exist',
    rows: 3,
  },
  {
    key: 'community',
    label: 'Place / service area',
    hint: 'e.g. Crow Wing County, Brainerd Lakes, rural Northwest MN',
  },
  {
    key: 'grantTitle',
    label: 'Project or proposal title',
    hint: 'Short, specific title for this request',
  },
  {
    key: 'funder',
    label: 'Funder (if known)',
    hint: 'Foundation, DEED program, federal opportunity…',
  },
  {
    key: 'amount',
    label: 'Amount requested',
    hint: 'e.g. $15,000',
  },
  {
    key: 'need',
    label: 'Need / problem',
    hint: 'What gap or challenge exists? Use local facts if you have them.',
    rows: 5,
  },
  {
    key: 'population',
    label: 'Who benefits',
    hint: 'Numbers, ages, communities — be concrete',
    rows: 3,
  },
  {
    key: 'goals',
    label: 'Goals & outcomes',
    hint: 'What will be different if this is funded? Prefer measurable outcomes.',
    rows: 4,
  },
  {
    key: 'activities',
    label: 'Activities / methods',
    hint: 'What you will do, with whom, and how',
    rows: 5,
  },
  {
    key: 'timeline',
    label: 'Timeline',
    hint: 'Major milestones by month or quarter',
    rows: 3,
  },
  {
    key: 'budgetNarrative',
    label: 'Budget narrative',
    hint: 'How the money will be used (staff, supplies, contracts, travel…)',
    rows: 4,
  },
  {
    key: 'evaluation',
    label: 'Evaluation',
    hint: 'How you will know it worked — data, stories, partners',
    rows: 3,
  },
  {
    key: 'capacity',
    label: 'Organizational capacity',
    hint: 'Why your team can deliver (experience, partners, past work)',
    rows: 3,
  },
];

function buildDraft(f: Form): string {
  const lines: string[] = [];

  lines.push(`# ${f.grantTitle || 'Grant Proposal Draft'}`);
  lines.push('');
  if (f.orgName) lines.push(`**Applicant:** ${f.orgName}`);
  if (f.funder) lines.push(`**Funder:** ${f.funder}`);
  if (f.amount) lines.push(`**Amount requested:** ${f.amount}`);
  if (f.community) lines.push(`**Service area:** ${f.community}`);
  lines.push('');

  if (f.mission) {
    lines.push('## Organizational mission');
    lines.push(f.mission);
    lines.push('');
  }

  if (f.need) {
    lines.push('## Statement of need');
    lines.push(f.need);
    if (f.population) {
      lines.push('');
      lines.push(`**Population served:** ${f.population}`);
    }
    lines.push('');
  }

  if (f.goals) {
    lines.push('## Goals and intended outcomes');
    lines.push(f.goals);
    lines.push('');
  }

  if (f.activities) {
    lines.push('## Project activities');
    lines.push(f.activities);
    lines.push('');
  }

  if (f.timeline) {
    lines.push('## Timeline');
    lines.push(f.timeline);
    lines.push('');
  }

  if (f.budgetNarrative) {
    lines.push('## Budget narrative');
    lines.push(f.budgetNarrative);
    lines.push('');
  }

  if (f.evaluation) {
    lines.push('## Evaluation and learning');
    lines.push(f.evaluation);
    lines.push('');
  }

  if (f.capacity) {
    lines.push('## Organizational capacity');
    lines.push(f.capacity);
    lines.push('');
  }

  lines.push('---');
  lines.push(
    '_Draft generated with Spatialytics Grant Writer. Review for accuracy, add citations, and adapt to funder guidelines._'
  );

  return lines.join('\n');
}

export default function ProposalBuilder() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const draft = useMemo(() => buildDraft(form), [form]);
  const current = STEPS[step];

  function setField(key: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function loadExample() {
    setForm({
      orgName: 'Lakes Area Community Hub',
      mission:
        'We strengthen food security, youth opportunity, and local economic resilience across Crow Wing County.',
      community: 'Crow Wing County / Brainerd Lakes area, Minnesota',
      grantTitle: 'Mobile Pantry Expansion — Rural Lakes Route',
      funder: 'Initiative Foundation / local community fund',
      amount: '$12,500',
      need: 'Rural households outside Brainerd face longer drives and fewer food-access points. Seasonal tourism economies leave gaps in year-round support. Local partners report rising demand at existing shelves without matching capacity for outreach routes.',
      population:
        'Approximately 400–600 household visits per quarter on an expanded rural route, with priority for seniors and families with children.',
      goals:
        '1) Add two rural stop locations with reliable monthly service.\n2) Increase rural household visits by 25% within 12 months.\n3) Establish referral partnerships with two clinics or schools.',
      activities:
        'Coordinate volunteer drivers and refrigerated capacity; publish a stop calendar; partner with township halls for sites; track visits and referrals in a simple monthly log.',
      timeline:
        'Months 1–2: site agreements and route design.\nMonths 3–10: monthly service and outreach.\nMonth 12: evaluation report to funder and partners.',
      budgetNarrative:
        'Fuel and vehicle costs; portable cold storage; part-time coordination stipend; printed outreach materials; contingency for winter weather reroutes.',
      evaluation:
        'Monthly visit counts by stop; anonymous household feedback cards; partner referral tally; short end-of-year summary shared with funder.',
      capacity:
        'Existing volunteer base, relationships with area food shelves, and prior small-grant reporting experience. Fiscal sponsorship or board oversight in place.',
    });
    setStep(0);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Guided form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-slate-400">
            Step{' '}
            <span className="text-white font-medium">
              {step + 1} / {STEPS.length}
            </span>{' '}
            — {current.label}
          </p>
          <button
            type="button"
            onClick={loadExample}
            className="text-xs text-cyan-400 hover:underline"
          >
            Load Brainerd Lakes example
          </button>
        </div>

        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-white">{current.label}</span>
            <span className="block text-xs text-slate-500 mt-1">{current.hint}</span>
            {current.rows ? (
              <textarea
                value={form[current.key]}
                onChange={(e) => setField(current.key, e.target.value)}
                rows={current.rows}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                placeholder="Type here…"
              />
            ) : (
              <input
                type="text"
                value={form[current.key]}
                onChange={(e) => setField(current.key, e.target.value)}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                placeholder="Type here…"
              />
            )}
          </label>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="px-4 py-2 rounded-full text-sm border border-slate-700 text-slate-300 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() =>
                setStep((s) => Math.min(STEPS.length - 1, s + 1))
              }
              className="px-4 py-2 rounded-full text-sm font-semibold bg-cyan-400 text-slate-950"
            >
              {step === STEPS.length - 1 ? 'Done' : 'Next'}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Tip: Jump sections anytime by using Next/Back. Your draft updates live on
          the right.
        </p>
      </div>

      {/* Live draft */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Live draft</h2>
          <button
            type="button"
            onClick={copyDraft}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-600 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300"
          >
            {copied ? 'Copied!' : 'Copy draft'}
          </button>
        </div>
        <pre className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-xs md:text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-[70vh] overflow-y-auto">
          {draft}
        </pre>
      </div>
    </div>
  );
}
