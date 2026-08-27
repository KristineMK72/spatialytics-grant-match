import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  url && key
    ? createClient(url, key)
    : null;

export type Grant = {
  id: string;
  title: string;
  funder_name: string;
  description: string | null;
  funding_amount_min: number | null;
  funding_amount_max: number | null;
  deadline: string | null;
  focus_categories: string[];
  eligible_region: string | null;
  source_url: string | null;
  source_name: string | null;
};

/** Demo grants used when Supabase is not configured */
export const DEMO_GRANTS: Grant[] = [
  {
    id: '1',
    title: 'Community Food Security Mini-Grant',
    funder_name: 'Initiative Foundation (Central)',
    description:
      'Small grants for food shelves and community food programs in Central Minnesota.',
    funding_amount_min: 1000,
    funding_amount_max: 10000,
    deadline: new Date(Date.now() + 90 * 864e5).toISOString(),
    focus_categories: ['food_security', 'health'],
    eligible_region: 'central',
    source_url: 'https://www.ifound.org',
    source_name: 'initiative_foundation',
  },
  {
    id: '2',
    title: 'Rural Youth Opportunity Fund',
    funder_name: 'Northwest Minnesota Foundation',
    description:
      'Support youth leadership and after-school programming in Northwest Minnesota.',
    funding_amount_min: 2500,
    funding_amount_max: 25000,
    deadline: new Date(Date.now() + 60 * 864e5).toISOString(),
    focus_categories: ['youth', 'education'],
    eligible_region: 'northwest',
    source_url: null,
    source_name: 'initiative_foundation',
  },
  {
    id: '3',
    title: 'Small Business & Main Street Working Capital',
    funder_name: 'Minnesota DEED / PROMISE partners',
    description:
      'Working capital for small businesses and community economic development in eligible areas.',
    funding_amount_min: 10000,
    funding_amount_max: 50000,
    deadline: new Date(Date.now() + 120 * 864e5).toISOString(),
    focus_categories: ['economic_development', 'small_business'],
    eligible_region: 'statewide',
    source_url: 'https://mn.gov/deed/',
    source_name: 'deed',
  },
  {
    id: '4',
    title: 'Spatial / Civic Tech Pilot',
    funder_name: 'Spatialytics Community Pilot',
    description:
      'Pilot support for place-based tools that improve local capacity in Greater Minnesota.',
    funding_amount_min: 5000,
    funding_amount_max: 15000,
    deadline: new Date(Date.now() + 45 * 864e5).toISOString(),
    focus_categories: ['technology', 'economic_development', 'civic'],
    eligible_region: 'northwest',
    source_url: 'https://spatialytics-astro.vercel.app',
    source_name: 'manual',
  },
];
