-- Spatialytics Grant Match — schema
-- Run in Supabase SQL editor after enabling PostGIS

create extension if not exists postgis;

-- Organizations seeking grants
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mission text,
  focus_areas text[] not null default '{}',
  service_area geometry(MultiPolygon, 4326),
  county text,
  region text, -- e.g. 'northwest', 'central'
  contact_email text,
  created_at timestamptz not null default now()
);

create index if not exists organizations_service_area_gix
  on organizations using gist (service_area);

-- Grants from federal / state / foundation sources
create table if not exists grants (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  funder_name text not null,
  description text,
  funding_amount_min numeric,
  funding_amount_max numeric,
  deadline timestamptz,
  focus_categories text[] not null default '{}',
  eligible_geography geometry(MultiPolygon, 4326),
  eligible_region text, -- coarse tag when full geometry unknown
  source_url text,
  source_name text, -- 'deed', 'launch_mn', 'initiative_foundation', 'grants_gov', 'manual'
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists grants_eligible_geography_gix
  on grants using gist (eligible_geography);

create index if not exists grants_focus_categories_gin
  on grants using gin (focus_categories);

create index if not exists grants_deadline_idx
  on grants (deadline);

-- Pipeline tracker
create table if not exists grant_pipelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  grant_id uuid not null references grants(id) on delete cascade,
  status text not null default 'discovering'
    check (status in ('discovering', 'researching', 'applied', 'awarded', 'rejected')),
  notes text,
  updated_at timestamptz not null default now(),
  unique (organization_id, grant_id)
);

-- Spatial + thematic match
create or replace function match_grants_for_org(org_id uuid)
returns setof grants
language plpgsql
stable
as $$
begin
  return query
  select g.*
  from grants g
  join organizations o on o.id = org_id
  where g.is_active = true
    and (g.deadline is null or g.deadline > now())
    and (
      cardinality(o.focus_areas) = 0
      or g.focus_categories && o.focus_areas
    )
    and (
      g.eligible_geography is null
      or o.service_area is null
      or st_intersects(g.eligible_geography, o.service_area)
    )
  order by g.deadline asc nulls last;
end;
$$;

-- Optional: match by region tag when geometries are sparse
create or replace function match_grants_for_region(
  region_slug text,
  focus text[] default '{}'
)
returns setof grants
language sql
stable
as $$
  select g.*
  from grants g
  where g.is_active = true
    and (g.deadline is null or g.deadline > now())
    and (
      g.eligible_region is null
      or g.eligible_region = region_slug
      or g.eligible_region = 'statewide'
    )
    and (
      cardinality(focus) = 0
      or g.focus_categories && focus
    )
  order by g.deadline asc nulls last;
$$;
