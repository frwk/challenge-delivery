'use client';

import { useEffect, useState } from 'react';
import Map, { FullscreenControl, GeolocateControl, NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Delivery } from '@/types/delivery';
import { EnumTimeScope } from '@/types/EnumTimeScope';
import { heatmapLayer } from './heatMapLayer';
import { FeatureCollection } from 'geojson';

export function HeatMapChart({ deliveries, timeScope }: { deliveries: Delivery[]; timeScope: EnumTimeScope }) {
  const [data, setData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    async function fetchData() {
      const geoJson: FeatureCollection = {
        type: 'FeatureCollection',
        features: deliveries.map(delivery => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [delivery.dropoffLongitude, delivery.dropoffLatitude],
          },
          properties: {},
        })),
      };
      setData(geoJson);
    }
    fetchData();
  }, [deliveries, timeScope]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = '.maplibregl-ctrl-bottom-right  { display: none; }';
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: 2.3522,
        latitude: 48.8566,
        zoom: 10,
      }}
      style={{ height: '300px', position: 'relative', margin: 'auto' }}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    >
      <FullscreenControl />
      <GeolocateControl />
      <NavigationControl />
      {data && (
        <Source type="geojson" data={data}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Layer {...heatmapLayer} />
        </Source>
      )}
    </Map>
  );
}
