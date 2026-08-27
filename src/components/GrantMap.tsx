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
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: REGION_CENTERS[activeRegion] ?? [-94.5, 46.0],
      zoom: activeRegion === 'statewide' ? 5.5 : 6.5,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const center = REGION_CENTERS[activeRegion] ?? [-94.5, 46.0];
    map.flyTo({
      center,
      zoom: activeRegion === 'statewide' ? 5.5 : 6.8,
      duration: 900,
    });
  }, [activeRegion]);

  return (
    <div className="relative w-full h-[340px] md:h-[420px] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
