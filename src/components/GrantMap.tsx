'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const REGION_CENTERS: Record<string, [number, number]> = {
  northwest: [-95.0, 47.2],
  northeast: [-92.5, 47.3],
  central: [-94.2, 45.55],
  southwest: [-95.5, 44.0],
  southeast: [-92.5, 43.95],
  statewide: [-94.5, 46.0],
  metro: [-93.25, 44.95],
  national: [-98.5, 39.5],
};

export default function GrantMap({
  activeRegion = 'northwest',
}: {
  activeRegion?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: REGION_CENTERS[activeRegion] ?? [-94.5, 46.0],
      zoom:
        activeRegion === 'national'
          ? 3.2
          : activeRegion === 'statewide'
            ? 5.5
            : 6.5,
      attributionControl: { compact: true },
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    map.on('load', () => {
      map.resize();
    });

    const t = window.setTimeout(() => map.resize(), 200);
    mapRef.current = map;

    return () => {
      window.clearTimeout(t);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const center = REGION_CENTERS[activeRegion] ?? [-94.5, 46.0];
    const zoom =
      activeRegion === 'national'
        ? 3.2
        : activeRegion === 'statewide'
          ? 5.5
          : 6.8;
    map.flyTo({ center, zoom, duration: 900 });
    map.resize();
  }, [activeRegion]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900"
      style={{ height: 380, minHeight: 320 }}
    >
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute bottom-2 left-2 z-10 rounded-md bg-slate-950/80 px-2 py-1 text-[10px] text-slate-400 pointer-events-none">
        MapLibre · region focus
      </div>
    </div>
  );
}
