"use client";

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), { 
  ssr: false,
  loading: () => <p className="text-center mt-10">Loading map...</p>
});

export default function MapWrapper() {
  return <MapView />;
}