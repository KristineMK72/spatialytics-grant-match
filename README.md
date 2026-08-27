# Spatialytics Grant Match

Map-first grant discovery for nonprofits and community organizations in **Greater Minnesota**.

Match funding to **place + mission**, not just keywords.

## Stack

- **Next.js 15** (App Router)
- **Supabase** (Postgres + PostGIS + Auth)
- **MapLibre GL JS**
- **TypeScript + Tailwind**

## MVP scope

1. Org profile: focus areas + service area geometry
2. Curated grants with eligible geography
3. Spatial + category matching (`match_grants_for_org`)
4. Map + list UI
5. Simple pipeline (save / status)

## Setup

```bash
npm install
cp .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

### Database

1. Create a Supabase project
2. Enable the **PostGIS** extension
3. Run `supabase/schema.sql` in the SQL editor
4. (Optional) Run `supabase/seed.sql` for sample Greater MN data

## Deploy

Connect this repo to Vercel and set the same env vars.

## Spatialytics

Part of [Spatialytics](https://spatialytics-astro.vercel.app) — software and spatial tools that keep value in Greater Minnesota.
