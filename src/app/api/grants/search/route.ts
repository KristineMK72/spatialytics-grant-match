import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy to Grants.gov search2 (no API key required).
 * https://api.grants.gov/v1/api/search2
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const keyword = String(body.keyword ?? body.query ?? '').trim();
    const rows = Math.min(Number(body.rows) || 25, 50);

    if (!keyword || keyword.length < 2) {
      return NextResponse.json(
        { error: 'keyword required (min 2 characters)', grants: [] },
        { status: 400 }
      );
    }

    const payload = {
      rows,
      keyword,
      oppStatuses: 'posted|forecasted',
      // Optional filters can be added later: agencies, fundingCategories, eligibilities
    };

    const res = await fetch('https://api.grants.gov/v1/api/search2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // Grants.gov can be slow
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: `Grants.gov error ${res.status}`,
          detail: text.slice(0, 300),
          grants: [],
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    const hits =
      data?.data?.oppHits ??
      data?.data?.opportunityHits ??
      data?.oppHits ??
      data?.data ??
      [];

    const list = Array.isArray(hits) ? hits : [];

    const grants = list.map((h: Record<string, unknown>, i: number) => {
      const id =
        String(h.id ?? h.number ?? h.oppNumber ?? h.opportunityNumber ?? `gg-${i}`);
      const title = String(h.title ?? h.opportunityTitle ?? 'Untitled opportunity');
      const agency = String(
        h.agencyName ?? h.agency ?? h.agencyCode ?? 'Federal agency'
      );
      const number = h.number ?? h.oppNumber ?? h.opportunityNumber;
      const openDate = h.openDate ?? h.postDate ?? null;
      const closeDate =
        h.closeDate ?? h.closingDate ?? h.responseDate ?? h.deadline ?? null;
      const synopsis = h.synopsis ?? h.description ?? null;

      return {
        id: `gg-${id}`,
        title,
        funder_name: agency,
        description:
          typeof synopsis === 'string'
            ? synopsis.slice(0, 400)
            : number
              ? `Opportunity ${number}`
              : 'Federal opportunity from Grants.gov',
        funding_amount_min: numOrNull(h.awardFloor ?? h.award_floor),
        funding_amount_max: numOrNull(
          h.awardCeiling ?? h.award_ceiling ?? h.estimatedFunding
        ),
        deadline: closeDate ? String(closeDate) : null,
        focus_categories: ['federal', 'national'],
        eligible_region: 'national',
        source_url: number
          ? `https://www.grants.gov/search-results-detail/${number}`
          : 'https://www.grants.gov',
        source_name: 'grants_gov',
        posted: openDate ? String(openDate) : null,
      };
    });

    return NextResponse.json({
      grants,
      source: 'grants.gov',
      count: grants.length,
      rawKeys: list[0] ? Object.keys(list[0] as object) : [],
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message, grants: [] }, { status: 500 });
  }
}

function numOrNull(v: unknown): number | null {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
