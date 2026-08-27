-- Sample Greater Minnesota seed data for demos
-- Approximate county-ish boxes (not official boundaries)

insert into organizations (name, mission, focus_areas, county, region, service_area)
values (
  'Lakes Area Community Hub',
  'Support food security, youth programs, and local economic opportunity in Crow Wing County.',
  array['food_security', 'youth', 'economic_development'],
  'Crow Wing',
  'northwest',
  ST_GeomFromText(
    'MULTIPOLYGON(((
      -94.6 46.2,
      -93.8 46.2,
      -93.8 46.7,
      -94.6 46.7,
      -94.6 46.2
    )))',
    4326
  )
);

insert into grants (
  title, funder_name, description,
  funding_amount_min, funding_amount_max, deadline,
  focus_categories, eligible_region, source_name, source_url
) values
(
  'Community Food Security Mini-Grant',
  'Initiative Foundation (Central)',
  'Small grants for food shelves and community food programs in Central Minnesota.',
  1000, 10000, now() + interval '90 days',
  array['food_security', 'health'],
  'central',
  'initiative_foundation',
  'https://www.ifound.org'
),
(
  'Rural Youth Opportunity Fund',
  'Northwest Minnesota Foundation',
  'Support youth leadership and after-school programming in Northwest Minnesota.',
  2500, 25000, now() + interval '60 days',
  array['youth', 'education'],
  'northwest',
  'initiative_foundation',
  null
),
(
  'Small Business & Main Street Working Capital',
  'Minnesota DEED / PROMISE partners',
  'Working capital for small businesses and community economic development in eligible areas.',
  10000, 50000, now() + interval '120 days',
  array['economic_development', 'small_business'],
  'statewide',
  'deed',
  'https://mn.gov/deed/'
),
(
  'Spatial / Civic Tech Pilot',
  'Spatialytics Community Pilot',
  'Pilot support for place-based tools that improve local capacity in Greater Minnesota.',
  5000, 15000, now() + interval '45 days',
  array['technology', 'economic_development', 'civic'],
  'northwest',
  'manual',
  'https://spatialytics-astro.vercel.app'
);

-- Attach coarse geography for northwest-focused grants (demo polygon)
update grants
set eligible_geography = ST_GeomFromText(
  'MULTIPOLYGON(((
    -97.2 45.5,
    -93.0 45.5,
    -93.0 49.0,
    -97.2 49.0,
    -97.2 45.5
  )))',
  4326
)
where eligible_region = 'northwest';
