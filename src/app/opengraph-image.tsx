import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Spatialytics Grant Match — map-first grants for Greater Minnesota';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(145deg, #020617 0%, #0f172a 55%, #083344 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #22d3ee, #0891b2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#020617',
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            S
          </div>
          <span style={{ color: '#94a3b8', fontSize: 22, fontWeight: 600 }}>
            Spatialytics
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              color: '#22d3ee',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Grant Match
          </div>
          <div
            style={{
              color: '#f8fafc',
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            Find funding by place, not just keywords
          </div>
          <div style={{ color: '#94a3b8', fontSize: 24, maxWidth: 720 }}>
            Map-first discovery + guided proposals for Greater Minnesota
            nonprofits
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            color: '#64748b',
            fontSize: 18,
          }}
        >
          <span style={{ color: '#22d3ee' }}>Discover</span>
          <span>·</span>
          <span style={{ color: '#22d3ee' }}>Write</span>
          <span>·</span>
          <span>Brainerd Lakes · Greater MN</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
